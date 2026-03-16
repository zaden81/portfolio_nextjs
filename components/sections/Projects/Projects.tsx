import { PROJECTS } from "@/data";
import { Container, SectionHeader } from "@/components/ui";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projects" className="bg-bg-secondary py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeader
          imageSrc="/images/white-desk-work-study-aesthetics.jpg"
          imageAlt="Projects"
          title="Projects"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
