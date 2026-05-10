"use client";

export function HeroVideo() {
  return (
    <video
      className="hero-video"
      autoPlay
      muted
      loop
      playsInline
      src="/brand/story.mp4"
    />
  );
}
