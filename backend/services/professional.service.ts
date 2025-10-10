import { professionals, projects, reviews, users, type Professional, type Project } from "../../shared/schema";
import { db } from "../config/database";
import { eq, and, or, like, desc } from "drizzle-orm";

export class ProfessionalService {
  async getProfessional(id: number): Promise<any> {
    const [professional] = await db.select({
      id: professionals.id,
      userId: professionals.userId,
      companyName: professionals.companyName,
      address: professionals.address,
      pincode: professionals.pincode,
      phone: professionals.phone,
      profession: professionals.profession,
      experience: professionals.experience,
      profileImage: professionals.profileImage,
      about: professionals.about,
      rating: professionals.rating,
      reviewCount: professionals.reviewCount,
      location: professionals.location,
      specializations: professionals.specializations,
      isVerified: professionals.isVerified,
      isFeatured: professionals.isFeatured,
      availability: professionals.availability,
      completedProjects: professionals.completedProjects,
      responseTime: professionals.responseTime,
      createdAt: professionals.createdAt,
      updatedAt: professionals.updatedAt,
      fullName: users.fullName
    }).from(professionals)
      .leftJoin(users, eq(professionals.userId, users.id))
      .where(eq(professionals.id, id));
    return professional || undefined;
  }

  async getProfessionalByUserId(userId: number): Promise<any> {
    const [professional] = await db.select({
      id: professionals.id,
      userId: professionals.userId,
      companyName: professionals.companyName,
      address: professionals.address,
      pincode: professionals.pincode,
      phone: professionals.phone,
      profession: professionals.profession,
      experience: professionals.experience,
      profileImage: professionals.profileImage,
      about: professionals.about,
      rating: professionals.rating,
      reviewCount: professionals.reviewCount,
      location: professionals.location,
      specializations: professionals.specializations,
      isVerified: professionals.isVerified,
      isFeatured: professionals.isFeatured,
      availability: professionals.availability,
      completedProjects: professionals.completedProjects,
      responseTime: professionals.responseTime,
      createdAt: professionals.createdAt,
      updatedAt: professionals.updatedAt,
      fullName: users.fullName
    }).from(professionals)
      .leftJoin(users, eq(professionals.userId, users.id))
      .where(eq(professionals.userId, userId));
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
      ? db.select({
          id: professionals.id,
          userId: professionals.userId,
          companyName: professionals.companyName,
          address: professionals.address,
          pincode: professionals.pincode,
          phone: professionals.phone,
          profession: professionals.profession,
          experience: professionals.experience,
          profileImage: professionals.profileImage,
          about: professionals.about,
          rating: professionals.rating,
          reviewCount: professionals.reviewCount,
          location: professionals.location,
          specializations: professionals.specializations,
          isVerified: professionals.isVerified,
          isFeatured: professionals.isFeatured,
          availability: professionals.availability,
          completedProjects: professionals.completedProjects,
          responseTime: professionals.responseTime,
          createdAt: professionals.createdAt,
          updatedAt: professionals.updatedAt,
          fullName: users.fullName
        }).from(professionals)
          .leftJoin(users, eq(professionals.userId, users.id))
          .where(and(...conditions))
          .orderBy(desc(professionals.rating))
      : db.select({
          id: professionals.id,
          userId: professionals.userId,
          companyName: professionals.companyName,
          address: professionals.address,
          pincode: professionals.pincode,
          phone: professionals.phone,
          profession: professionals.profession,
          experience: professionals.experience,
          profileImage: professionals.profileImage,
          about: professionals.about,
          rating: professionals.rating,
          reviewCount: professionals.reviewCount,
          location: professionals.location,
          specializations: professionals.specializations,
          isVerified: professionals.isVerified,
          isFeatured: professionals.isFeatured,
          availability: professionals.availability,
          completedProjects: professionals.completedProjects,
          responseTime: professionals.responseTime,
          createdAt: professionals.createdAt,
          updatedAt: professionals.updatedAt,
          fullName: users.fullName
        }).from(professionals)
          .leftJoin(users, eq(professionals.userId, users.id))
          .orderBy(desc(professionals.rating));
    
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
