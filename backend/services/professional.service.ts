import { professionals, projects, reviews, type Professional, type Project } from "../../shared/schema";
import { db } from "../config/database";
import { eq, and, or, like, desc } from "drizzle-orm";

export class ProfessionalService {
  async getProfessional(id: number): Promise<Professional | undefined> {
    const [professional] = await db.select().from(professionals).where(eq(professionals.id, id));
    return professional || undefined;
  }

  async getProfessionalByUserId(userId: number): Promise<Professional | undefined> {
    const [professional] = await db.select().from(professionals).where(eq(professionals.userId, userId));
    return professional || undefined;
  }

  async getAllProfessionals(): Promise<Professional[]> {
    return await db.select().from(professionals).orderBy(desc(professionals.rating));
  }

  async getProfessionalsByType(profession: 'contractor' | 'architect'): Promise<Professional[]> {
    return await db.select().from(professionals)
      .where(eq(professionals.profession, profession))
      .orderBy(desc(professionals.rating));
  }

  async searchProfessionals(filters: {
    profession?: string;
    location?: string;
    specialization?: string;
    search?: string;
    limit?: number;
    featured?: boolean;
  }): Promise<any[]> {
    const conditions: any[] = [];

    if (filters.profession && filters.profession !== 'all') {
      conditions.push(eq(professionals.profession, filters.profession as 'contractor' | 'architect'));
    }

    if (filters.location) {
      conditions.push(like(professionals.location, `%${filters.location}%`));
    }

    if (filters.search) {
      conditions.push(
        or(
          like(professionals.companyName, `%${filters.search}%`),
          like(professionals.location, `%${filters.search}%`),
          like(professionals.about, `%${filters.search}%`)
        )
      );
    }

    if (filters.featured) {
      conditions.push(eq(professionals.isFeatured, true));
    }

    let query = conditions.length > 0
      ? db.select().from(professionals).where(and(...conditions)).orderBy(desc(professionals.rating))
      : db.select().from(professionals).orderBy(desc(professionals.rating));
    
    const result = filters.limit 
      ? await query.limit(filters.limit)
      : await query;
    
    const professionalsWithProjects = await Promise.all(
      result.map(async (prof) => {
        const profProjects = await this.getProfessionalProjects(prof.id);
        return {
          ...prof,
          projects: profProjects
        };
      })
    );

    return professionalsWithProjects;
  }

  async createProfessional(data: typeof professionals.$inferInsert): Promise<Professional> {
    const [professional] = await db.insert(professionals).values(data).returning();
    return professional;
  }

  async updateProfessional(id: number, data: Partial<typeof professionals.$inferInsert>): Promise<Professional | undefined> {
    const [updated] = await db.update(professionals)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(professionals.id, id))
      .returning();
    return updated || undefined;
  }

  async getProfessionalProjects(professionalId: number): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.professionalId, professionalId))
      .orderBy(desc(projects.createdAt));
  }

  async getProfessionalReviews(professionalId: number) {
    return await db.select().from(reviews)
      .where(eq(reviews.professionalId, professionalId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByUserId(userId: number) {
    return await db.select().from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }
}

export const professionalService = new ProfessionalService();
