import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GalleryGrid } from "@/components/gallery-grid";
import { MatchCard } from "@/components/match-card";
import { MatchdayFilm } from "@/components/matchday-film";
import { ScheduleView } from "@/components/schedule-view";
import { announcements, sponsorFallback } from "@/lib/data";
import type { Match } from "@/lib/types";

vi.mock("next/image", () => ({ default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt ?? ""} />;
} }));

const scheduled: Match = { id: "m1", ageGroup: "2015", stage: "league", round: "1", kickoff: "2026-03-21T13:00:00+01:00", venue: "SC Trnovčica", status: "scheduled", homeTeam: { id: "a", name: "Alfa" }, awayTeam: { id: "b", name: "Beta" } };
const played: Match = { ...scheduled, id: "m2", ageGroup: "2016", status: "played", homeScore: 3, awayScore: 1 };

describe("matchday components", () => {
  it("keeps teams, score, age and venue visible", () => {
    render(<MatchCard match={played} />);
    expect(screen.getByText("Alfa")).toBeVisible();
    expect(screen.getByText("Beta")).toBeVisible();
    expect(screen.getByText("Uzrast 2016")).toBeVisible();
    expect(screen.getByText("SC Trnovčica")).toBeVisible();
  });

  it("filters the schedule by age group", () => {
    render(<ScheduleView matches={[scheduled, played]} />);
    fireEvent.click(screen.getByRole("button", { name: "2016" }));
    expect(screen.queryByText("Uzrast 2015")).not.toBeInTheDocument();
    expect(screen.getByText("Uzrast 2016")).toBeInTheDocument();
  });

  it("supports keyboard navigation, focus trapping and focus restoration in the lightbox", async () => {
    render(<GalleryGrid images={[
      { id: "1", src: "/photo.jpg", alt: "Momčad na terenu", width: 100, height: 100 },
      { id: "2", src: "/photo-2.jpg", alt: "Slavlje nakon utakmice", width: 100, height: 100 },
    ]} />);
    const opener = screen.getByRole("button", { name: /otvori fotografiju: momčad/i });
    fireEvent.click(opener);
    expect(screen.getByRole("dialog", { name: "Momčad na terenu" })).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /zatvori fotografiju/i });
    expect(closeButton).toHaveFocus();
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(screen.getByRole("button", { name: /sljedeća fotografija/i })).toHaveFocus();

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByRole("dialog", { name: "Slavlje nakon utakmice" })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("does not request the film until the visitor presses play", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function play(this: HTMLMediaElement) {
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    });

    const { container } = render(<MatchdayFilm />);
    expect(container.querySelector("video source")).not.toBeInTheDocument();
    expect(container.querySelector("video")).not.toHaveAttribute("controls");

    fireEvent.click(screen.getByRole("button", { name: /pokreni video atmosfere/i }));
    await waitFor(() => expect(container.querySelector("video source")).toHaveAttribute("src", "/media/Video-by-klincek__.mp4"));
    expect(container.querySelector("video")).toHaveAttribute("controls");
  });

  it("keeps the supplied sponsor artwork as the guaranteed local fallback", () => {
    expect(sponsorFallback).toMatchObject({
      name: "Poliklinika Ribnjak",
      image: "/images/DOC-20240309-WA0010_240729_164917_page-00012-scaled.jpg",
      width: 2560,
      height: 853,
    });
    expect(sponsorFallback.url).toBeUndefined();
  });

  it("maps each announcement to the correct supplied WordPress image", () => {
    expect(announcements.find(({ id }) => id === "rastane-2026")?.image).toBe("/images/WhatsApp-Image-2026-03-12-at-09.34.13.jpeg");
    expect(announcements.find(({ id }) => id === "trnovcica-proljece")?.image).toBe("/images/WhatsApp-Image-2026-02-09-at-20.58.08.jpeg");
  });
});
