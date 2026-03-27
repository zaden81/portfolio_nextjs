import { Container } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import MyStory from "./MyStory";
import InfoCard from "./InfoCard";
import SkillsGrid from "./SkillsGrid";

export default function About() {
  return (
    <section id="about" className="bg-bg-primary py-12 sm:py-16 lg:py-20">
      <Container>
        <MyStory />

        {/* Info + Skills */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <FadeIn delay={0.1} className="flex-1">
            <InfoCard />
          </FadeIn>
          <FadeIn delay={0.3} className="flex-1">
            <SkillsGrid />
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
