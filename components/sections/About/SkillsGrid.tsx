import { SKILLS } from "@/data";

export default function SkillsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl overflow-hidden border border-border bg-border gap-px">
      {SKILLS.map((skill) => (
        <div key={skill.title} className="p-5 bg-bg-primary">
          <strong className="text-text-primary text-sm block mb-2">
            {skill.title}
          </strong>
          <p className="text-text-muted text-xs leading-relaxed">{skill.items}</p>
        </div>
      ))}
    </div>
  );
}
