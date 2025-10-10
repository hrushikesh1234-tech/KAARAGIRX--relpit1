import { professionals, projects, reviews, users, follows, type Professional, type Project } from "../../shared/schema";
import { db } from "../config/database";
import { eq, and, or, like, desc, sql } from "drizzle-orm";

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
    return await db.select({
      id: reviews.id,
      professionalId: reviews.professionalId,
      userId: reviews.userId,
      rating: reviews.rating,
      content: reviews.content,
      createdAt: reviews.createdAt,
      userFullName: users.fullName
    }).from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.professionalId, professionalId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByUserId(userId: number) {
    return await db.select().from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(professionalId: number, userId: number, rating: number, content: string) {
    const [review] = await db.insert(reviews).values({
      professionalId,
      userId,
      rating,
      content
    }).returning();

    // Update professional's average rating and review count
    const allReviews = await this.getProfessionalReviews(professionalId);
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await db.update(professionals)
      .set({ 
        rating: avgRating.toFixed(2),
        reviewCount: allReviews.length
      })
      .where(eq(professionals.id, professionalId));

    // Get user info for the review
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    return {
      ...review,
      userFullName: user?.fullName || 'Anonymous'
    };
  }

  async followUser(followerId: number, followingId: number) {
    const [follow] = await db.insert(follows).values({
      followerId,
      followingId
    }).returning();
    return follow;
  }

  async unfollowUser(followerId: number, followingId: number) {
    await db.delete(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ));
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const [result] = await db.select().from(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ));
    return !!result;
  }

  async getFollowerCount(userId: number): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followingId, userId));
    return Number(result[0]?.count || 0);
  }

  async getFollowingCount(userId: number): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followerId, userId));
    return Number(result[0]?.count || 0);
  }
}

export const professionalService = new ProfessionalService();
