import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types";
import { Card } from "@/components/ui";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const linkLabel = project.isInternal ? "Play Now" : "View on GitHub";

  const overlay = (
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
      <span className="bg-accent text-white px-6 py-2 rounded-full text-sm font-medium">
        {linkLabel}
      </span>
    </div>
  );

  return (
    <Card className="group hover:shadow-xl hover:shadow-accent/10 transition-all duration-300">
      <div className="relative overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          width={600}
          height={350}
          className="w-full h-40 sm:h-48 md:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {project.isInternal ? (
          <Link href={project.href} className="absolute inset-0">
            {overlay}
          </Link>
        ) : (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
          >
            {overlay}
          </a>
        )}
      </div>
      <div className="p-4 sm:p-6">
        <p className="text-text-muted text-xs mb-3 leading-relaxed">
          {project.tag}
        </p>
        <h3 className="text-text-primary font-semibold text-lg">{project.title}</h3>
      </div>
    </Card>
  );
}
