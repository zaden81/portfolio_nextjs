import Image from "next/image";
import { Container } from "@/components/ui";
import HeroScrollButton from "./HeroScrollButton";
import WaveDivider from "./WaveDivider";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-br from-hero-from via-hero-via to-hero-to flex items-center pt-20 overflow-hidden"
    >
      <Container className="py-10 sm:py-14 lg:py-16 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12">
          {/* Text */}
          <div className="flex-1 text-text-primary">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/images/happy-bearded-young-man.JPEG"
                alt="Thuong avatar"
                width={72}
                height={72}
                className="rounded-full object-cover border-4 border-text-secondary/40"
              />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">Hello friend!</h1>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl text-text-secondary mb-8">
              I am open to new career opportunities in Ho Chi Minh City.
            </h2>
            <HeroScrollButton />
          </div>

          {/* Image */}
          <div className="flex-1 flex justify-center relative">
            <div className="absolute inset-0 bg-text-secondary/10 rounded-full blur-3xl scale-75" />
            <Image
              src="/images/portrait-happy-excited-man-holding-laptop-computer.png"
              alt="Thuong with laptop"
              width={400}
              height={450}
              className="relative z-10 object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </Container>

      <WaveDivider />
    </section>
  );
}
