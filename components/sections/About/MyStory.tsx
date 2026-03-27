import Image from "next/image";
import { MY_STORY_TEXT } from "@/config";
import { FadeIn } from "@/components/motion";

export default function MyStory() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-20">
      <FadeIn direction="left" className="flex-1">
        <Image
          src="/images/IMG_2814.JPEG"
          alt="Thuong"
          width={500}
          height={400}
          className="rounded-2xl object-cover w-full max-h-[400px]"
        />
      </FadeIn>

      <FadeIn direction="right" delay={0.2} className="flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-end gap-4 mb-6">
          <h2 className="text-text-primary text-2xl sm:text-3xl font-bold">My Story</h2>
          <Image
            src="/images/happy-bearded-young-man.JPEG"
            alt="Avatar"
            width={56}
            height={56}
            className="rounded-full object-cover border-4 border-accent"
          />
        </div>
        <h3 className="text-text-secondary text-xl mb-4">a little bit about me</h3>
        <p className="text-text-muted leading-relaxed">{MY_STORY_TEXT}</p>
      </FadeIn>
    </div>
  );
}
