import { PROJECTS } from "@/data";
import { Container, SectionHeader } from "@/components/ui";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projects" className="bg-bg-secondary py-12 sm:py-16 lg:py-20">
      <Container>
        <FadeIn>
          <SectionHeader
            imageSrc="/images/white-desk-work-study-aesthetics.jpg"
            imageAlt="Projects"
            title="Projects"
          />
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8" staggerDelay={0.15}>
          {PROJECTS.map((project) => (
            <StaggerItem key={project.title}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
