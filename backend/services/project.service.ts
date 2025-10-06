import { projects, type Project } from "../../shared/schema";
import { db } from "../config/database";
import { eq, desc } from "drizzle-orm";

export class ProjectService {
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjectsByProfessional(professionalId: number): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.professionalId, professionalId))
      .orderBy(desc(projects.createdAt));
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async createProject(data: typeof projects.$inferInsert): Promise<Project> {
    const [project] = await db.insert(projects).values(data).returning();
    return project;
  }

  async updateProject(id: number, data: Partial<typeof projects.$inferInsert>): Promise<Project | undefined> {
    const [updated] = await db.update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return true;
  }
}

export const projectService = new ProjectService();
