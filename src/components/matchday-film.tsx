"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function MatchdayFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const [activated, setActivated] = useState(false);
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!activated) return;
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {
      setActivated(false);
      setMessage("Video nije moguće pokrenuti. Pokušajte ponovno.");
      window.setTimeout(() => playRef.current?.focus(), 0);
    });
  }, [activated]);

  return (
    <section className="matchday-film" aria-labelledby="matchday-film-title">
      <div className="shell film-grid">
        <div className="film-copy">
          <span className="eyebrow">Liga u pokretu</span>
          <h2 id="matchday-film-title">Noć kada teren postaje pozornica.</h2>
          <p>Kratki pogled iznad terena — svjetla, ekipe i atmosfera zbog koje se čeka svako novo kolo.</p>
          <span className="film-meta">Video · 43 sekunde</span>
        </div>
        <figure className="film-frame" data-activated={activated || undefined}>
          <video ref={videoRef} controls={started} playsInline preload="none" poster="/images/video-matchday-poster.jpg" aria-label="Zračni video večernje utakmice i sportskih terena" onPlay={() => { setStarted(true); setMessage(""); }}>
            {activated && <source src="/media/Video-by-klincek__.mp4" type="video/mp4" />}
            Vaš preglednik ne podržava prikaz videozapisa.
          </video>
          {!activated && <button ref={playRef} className="film-play" type="button" onClick={() => setActivated(true)} aria-label="Pokreni video atmosfere s terena">
            <Play fill="currentColor" aria-hidden="true" />
            <span>Pokreni video</span>
          </button>}
          <figcaption>Snimka iz zraka · Tina Šport–Pia</figcaption>
          {message && <p className="film-message" role="status">{message}</p>}
        </figure>
      </div>
    </section>
  );
}
