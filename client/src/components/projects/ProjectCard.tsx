import { Link } from "react-router-dom";
import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link to={`/portfolio/${project.id}`} className="block">
      <div className="group relative cursor-pointer">
        <div className="aspect-square overflow-hidden rounded-lg">
          {project.coverImage ? (
            <img 
              src={project.coverImage} 
              alt={project.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-medium">{project.title}</h3>
          <p className="text-white/80 text-sm">{project.propertyType}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
