import { Container } from "@/components/ui";
import MyStory from "./MyStory";
import InfoCard from "./InfoCard";
import SkillsGrid from "./SkillsGrid";

export default function About() {
  return (
    <section id="about" className="bg-[#232323] py-20">
      <Container>
        <MyStory />

        {/* Info + Skills */}
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <InfoCard />
          </div>
          <div className="flex-1">
            <SkillsGrid />
          </div>
        </div>
      </Container>
    </section>
  );
}
