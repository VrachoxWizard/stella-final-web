import "server-only";

import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { readContentFiles, type ContentFiles } from "@/lib/content-files";
import { assertWritablePath } from "@/lib/cms/utils";

export type FileChange = { path: string; content: string | Uint8Array | null };
export type Snapshot = { files: ContentFiles; head: string | null };

export interface ContentStore {
  mode: "github" | "local";
  load(): Promise<Snapshot>;
  commit(changes: FileChange[], message: string, head: string | null): Promise<void>;
}

export class ConflictError extends Error {}

/* ---------- Lokalno (npm run dev) ---------- */

class LocalStore implements ContentStore {
  mode = "local" as const;

  async load() {
    return { files: await readContentFiles(), head: null };
  }

  async commit(changes: FileChange[]) {
    for (const change of changes) {
      assertWritablePath(change.path);
      // Local mode only runs on a developer machine, so it must not pull the whole project into the deploy.
      const absolute = path.join(/*turbopackIgnore: true*/ process.cwd(), change.path);
      if (change.content === null) {
        await rm(absolute, { force: true });
      } else {
        await mkdir(path.dirname(absolute), { recursive: true });
        await writeFile(absolute, change.content);
      }
    }
  }
}

/* ---------- GitHub (Vercel) ---------- */

type TreeEntry = { name: string; type: string; object: { text?: string | null; entries?: TreeEntry[] } | null };

const blobOrTree = (depth: number): string => depth === 0
  ? "... on Blob { text }"
  : `... on Blob { text } ... on Tree { entries { name type object { ${blobOrTree(depth - 1)} } } }`;

const loadQuery = `query($owner: String!, $name: String!, $ref: String!) {
  repository(owner: $owner, name: $name) {
    ref(qualifiedName: $ref) {
      target { ... on Commit { oid file(path: "content") { object { ${blobOrTree(3)} } } } }
    }
  }
}`;

const commitMutation = `mutation($input: CreateCommitOnBranchInput!) {
  createCommitOnBranch(input: $input) { commit { oid } }
}`;

class GitHubStore implements ContentStore {
  mode = "github" as const;

  constructor(private token: string, private repo: string, private branch: string) {}

  private async graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
    if (response.status === 401) throw new Error("GitHub token nije ispravan ili je istekao. Javite se administratoru.");
    if (!response.ok) throw new Error(`GitHub trenutno ne odgovara (${response.status}). Pokušajte ponovno za minutu.`);
    const body = await response.json() as { data?: T; errors?: { message: string }[] };
    if (body.errors?.length) {
      const message = body.errors.map(({ message }) => message).join("; ");
      if (/expected branch to point to|but it did not|expectedHeadOid/i.test(message)) throw new ConflictError(message);
      throw new Error(`GitHub greška: ${message}`);
    }
    return body.data as T;
  }

  async load(): Promise<Snapshot> {
    const [owner, name] = this.repo.split("/");
    type Result = { repository: { ref: { target: { oid: string; file: { object: { entries?: TreeEntry[] } } | null } } | null } | null };
    const data = await this.graphql<Result>(loadQuery, { owner, name, ref: `refs/heads/${this.branch}` });
    const target = data.repository?.ref?.target;
    if (!target) throw new Error(`Grana ${this.branch} nije pronađena u repozitoriju ${this.repo}.`);
    const files: ContentFiles = {};
    const walk = (entries: TreeEntry[] | undefined, prefix: string) => {
      for (const entry of entries ?? []) {
        const file = `${prefix}/${entry.name}`;
        if (entry.type === "tree") walk(entry.object?.entries, file);
        else if (entry.name.endsWith(".json") && typeof entry.object?.text === "string") files[file] = entry.object.text;
      }
    };
    walk(target.file?.object.entries, "content");
    return { files, head: target.oid };
  }

  async commit(changes: FileChange[], message: string, head: string | null) {
    changes.forEach(({ path: file }) => assertWritablePath(file));
    const additions = changes.filter((change) => change.content !== null).map((change) => ({
      path: change.path,
      contents: Buffer.from(change.content as string | Uint8Array).toString("base64"),
    }));
    const deletions = changes.filter((change) => change.content === null).map((change) => ({ path: change.path }));
    await this.graphql(commitMutation, {
      input: {
        branch: { repositoryNameWithOwner: this.repo, branchName: this.branch },
        message: { headline: message },
        expectedHeadOid: head,
        fileChanges: { additions, deletions },
      },
    });
  }
}

export function getStore(): ContentStore {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (token && repo) return new GitHubStore(token, repo, process.env.GITHUB_BRANCH || "main");
  if (process.env.NODE_ENV !== "production" || process.env.CMS_LOCAL === "1") return new LocalStore();
  throw new Error("CMS nije povezan s GitHubom (nedostaju GITHUB_TOKEN i GITHUB_REPO). Javite se administratoru.");
}
