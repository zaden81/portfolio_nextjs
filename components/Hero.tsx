"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#535da1] flex items-center pt-20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-white">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/images/happy-bearded-young-man.JPEG"
                alt="Thuong avatar"
                width={72}
                height={72}
                className="rounded-full object-cover border-4 border-white/30"
              />
              <h1 className="text-4xl lg:text-5xl font-bold">Hello friend!</h1>
            </div>
            <h2 className="text-xl lg:text-2xl text-white/80 mb-8">
              I am open to new career opportunities in Ho Chi Minh City.
            </h2>
            <button
              onClick={() => {
                document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block bg-white text-[#535da1] font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-colors"
            >
              Let&apos;s begin
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex justify-center relative">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-75" />
            <Image
              src="/images/portrait-happy-excited-man-holding-laptop-computer.png"
              alt="Thuong with laptop"
              width={400}
              height={450}
              className="relative z-10 object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
          <path
            fill="#232323"
            d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}
