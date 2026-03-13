import { SKILLS } from "@/data";

export default function SkillsGrid() {
  return (
    <div className="grid grid-cols-2 gap-0 border border-gray-700 rounded-2xl overflow-hidden">
      {SKILLS.map((skill, i) => (
        <div
          key={skill.title}
          className={`p-5 ${i % 2 === 1 ? "border-l border-gray-700" : ""} ${
            i < 2 ? "border-b border-gray-700" : ""
          }`}
        >
          <strong className="text-white text-sm block mb-2">
            {skill.title}
          </strong>
          <p className="text-gray-400 text-xs leading-relaxed">{skill.items}</p>
        </div>
      ))}
    </div>
  );
}
