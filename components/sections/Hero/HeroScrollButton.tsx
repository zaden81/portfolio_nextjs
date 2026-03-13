"use client";

export default function HeroScrollButton() {
  return (
    <button
      onClick={() => {
        document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="inline-block bg-white text-[#535da1] font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-colors"
    >
      Let&apos;s begin
    </button>
  );
}
