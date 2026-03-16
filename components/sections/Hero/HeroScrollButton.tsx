"use client";

export default function HeroScrollButton() {
  return (
    <button
      onClick={() => {
        document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="inline-block bg-accent text-white font-semibold px-8 py-3 rounded-full hover:bg-accent-hover transition-colors"
    >
      Let&apos;s begin
    </button>
  );
}
