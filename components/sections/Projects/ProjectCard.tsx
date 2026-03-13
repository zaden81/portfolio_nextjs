import Image from "next/image";
import type { Project } from "@/types";
import { Card } from "@/components/ui";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-300">
      <div className="relative overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          width={600}
          height={350}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
            View on GitHub
          </span>
        </a>
      </div>
      <div className="p-6">
        <p className="text-gray-400 text-xs mb-3 leading-relaxed">
          {project.tag}
        </p>
        <h3 className="text-white font-semibold text-lg">{project.title}</h3>
      </div>
    </Card>
  );
}
