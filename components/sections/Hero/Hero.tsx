import Image from "next/image";
import { Container } from "@/components/ui";
import HeroScrollButton from "./HeroScrollButton";
import WaveDivider from "./WaveDivider";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#535da1] flex items-center pt-20 overflow-hidden"
    >
      <Container className="py-16 w-full">
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
            <HeroScrollButton />
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
      </Container>

      <WaveDivider />
    </section>
  );
}
