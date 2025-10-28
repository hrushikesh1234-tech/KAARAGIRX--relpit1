import type { Request, Response } from "express";
import { projectService } from "../services/project.service";
import { z } from "zod";

const createProjectSchema = z.object({
  professionalId: z.number(),
  title: z.string(),
  name: z.string(),
  description: z.string().optional(),
  propertyType: z.string(),
  type: z.string(),
  budget: z.string().optional(),
  completionYear: z.string().optional(),
  completionDate: z.string().optional(),
  area: z.string().optional(),
  location: z.string().optional(),
  bhk: z.number().optional(),
  style: z.string().optional(),
  coverImage: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export class ProjectController {
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await projectService.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  async getProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const project = await projectService.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  }

  async getProjectsByProfessional(req: Request, res: Response) {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const projects = await projectService.getProjectsByProfessional(professionalId);
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects by professional:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  async createProject(req: Request, res: Response) {
    try {
      console.log('Creating project with data:', JSON.stringify(req.body, null, 2));
      const validatedData = createProjectSchema.parse(req.body);
      const project = await projectService.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error creating project:', JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code
          }))
        });
      }
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const project = await projectService.updateProject(id, req.body);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json(project);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await projectService.deleteProject(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
}

export const projectController = new ProjectController();
