import { describe, expect, it } from "vitest";
import { checkPassword, createSessionToken, isAuthConfigured, verifySessionToken } from "@/lib/cms/session";
import { assertWritablePath, slugify, uniqueId, zagrebIso, zagrebParts } from "@/lib/cms/utils";

const secrets = { password: "tajna-lozinka", secret: "dovoljno-dugi-tajni-niz" };

describe("CMS session", () => {
  it("accepts only the configured password", () => {
    expect(checkPassword("tajna-lozinka", secrets)).toBe(true);
    expect(checkPassword("pogresna", secrets)).toBe(false);
    expect(checkPassword("", { password: "", secret: "" })).toBe(false);
  });

  it("refuses to work without a long enough secret", () => {
    expect(isAuthConfigured({ password: "x", secret: "kratko" })).toBe(false);
  });

  it("verifies its own tokens until they expire", () => {
    const now = Date.UTC(2026, 9, 1);
    const token = createSessionToken(now, secrets);
    expect(verifySessionToken(token, now + 1000, secrets)).toBe(true);
    expect(verifySessionToken(token, now + 13 * 60 * 60 * 1000, secrets)).toBe(false);
  });

  it("rejects tampered tokens and tokens from an old password", () => {
    const now = Date.UTC(2026, 9, 1);
    const token = createSessionToken(now, secrets);
    const [expires, signature] = token.split(".");
    expect(verifySessionToken(`${Number(expires) + 99999}.${signature}`, now, secrets)).toBe(false);
    expect(verifySessionToken(token, now, { ...secrets, password: "nova-lozinka" })).toBe(false);
    expect(verifySessionToken(undefined, now, secrets)).toBe(false);
  });
});

describe("CMS write guard", () => {
  it("only allows content and uploads", () => {
    expect(() => assertWritablePath("content/site/home.json")).not.toThrow();
    expect(() => assertWritablePath("public/uploads/2026/slika.jpg")).not.toThrow();
    expect(() => assertWritablePath("src/app/page.tsx")).toThrow();
    expect(() => assertWritablePath("content/../package.json")).toThrow();
    expect(() => assertWritablePath("public/images/logo.png")).toThrow();
  });
});

describe("CMS helpers", () => {
  it("creates readable ids from Croatian names", () => {
    expect(slugify("NK Šibenik – Đakovo Žute")).toBe("nk-sibenik-dakovo-zute");
    expect(uniqueId("NK Alfa", ["nk-alfa", "nk-alfa-2"])).toBe("nk-alfa-3");
  });

  it("stores kickoff times with the Zagreb offset for summer and winter", () => {
    expect(zagrebIso("2026-09-26", "10:30")).toBe("2026-09-26T10:30:00+02:00");
    expect(zagrebIso("2026-12-05", "18:00")).toBe("2026-12-05T18:00:00+01:00");
    expect(zagrebParts("2026-12-05T18:00:00+01:00")).toEqual({ date: "2026-12-05", time: "18:00" });
  });
});
