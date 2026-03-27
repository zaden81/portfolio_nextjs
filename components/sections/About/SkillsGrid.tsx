import { SKILLS } from "@/data";
import { StaggerContainer, StaggerItem } from "@/components/motion";

export default function SkillsGrid() {
  return (
    <StaggerContainer
      className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl overflow-hidden border border-border bg-border gap-px"
      staggerDelay={0.1}
    >
      {SKILLS.map((skill) => (
        <StaggerItem key={skill.title}>
          <div className="p-5 bg-bg-primary">
            <strong className="text-text-primary text-sm block mb-2">
              {skill.title}
            </strong>
            <p className="text-text-muted text-xs leading-relaxed">{skill.items}</p>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
