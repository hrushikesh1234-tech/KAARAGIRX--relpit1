import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { users, professionals, dealers } from "../../shared/schema";
import bcrypt from 'bcryptjs';
import { dealers as mockDealers } from '../../client/src/data/dealers';

const demoUsers = [
  {
    username: "demouser",
    password: "password123",
    email: "demo@example.com",
    fullName: "Demo User",
    userType: "customer" as const
  },
  {
    username: "john.smith",
    password: "Customer@123",
    email: "john.smith@example.com",
    fullName: "John Smith",
    userType: "customer" as const
  },
  {
    username: "sarah.johnson",
    password: "Customer@456",
    email: "sarah.johnson@example.com",
    fullName: "Sarah Johnson",
    userType: "customer" as const
  },
  {
    username: "contractor1",
    password: "password123",
    email: "contractor@example.com",
    fullName: "Rajesh Sharma",
    userType: "contractor" as const
  },
  {
    username: "architect1",
    password: "password123",
    email: "architect@example.com",
    fullName: "Priya Desai",
    userType: "architect" as const
  }
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  console.log('🌱 Seeding database...');

  const sql = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(sql);

  try {
    console.log('\n📦 Seeding users...');
    for (const user of demoUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const [insertedUser] = await db
        .insert(users)
        .values({
          ...user,
          password: hashedPassword,
        })
        .returning();
      
      console.log(`✅ Created user: ${insertedUser.username} (${insertedUser.userType})`);

      if (insertedUser.userType === 'contractor' || insertedUser.userType === 'architect') {
        const professionalData = insertedUser.userType === 'contractor' 
          ? {
              userId: insertedUser.id,
              companyName: "Sharma Constructions",
              address: "123 MG Road, Lonavala",
              pincode: "411001",
              phone: "+91 9876543210",
              profession: 'contractor' as const,
              experience: 15,
              profileImage: "/Featured-sections-images/Featured Contractors/1- Rajesh Sharma.png",
              about: "Leading construction company with 15+ years of experience in building high-quality residential and commercial properties.",
              rating: "4.5",
              reviewCount: 48,
              location: "Lonavala, Maharashtra",
              specializations: ["Bungalow Construction", "Interior Renovation", "Office Spaces"],
              isVerified: true,
              completedProjects: 50,
              responseTime: "Within 2 hours",
            }
          : {
              userId: insertedUser.id,
              companyName: "DesignScape Architects",
              address: "78 Park Street, Pune",
              pincode: "411001",
              phone: "+91 9876543222",
              profession: 'architect' as const,
              experience: 10,
              profileImage: "/Featured-sections-images/Featured Architects/1 - Priya Desai.jpeg",
              about: "Award-winning architect with a passion for innovative and sustainable designs.",
              rating: "4.8",
              reviewCount: 52,
              location: "Pune, Maharashtra",
              specializations: ["Residential Design", "Sustainable Architecture", "Interior Design"],
              isVerified: true,
              completedProjects: 35,
              responseTime: "Within 1 hour",
            };

        await db.insert(professionals).values(professionalData);
        console.log(`  ✅ Created professional profile for ${insertedUser.fullName}`);
      }
    }

    console.log('\n🏪 Seeding dealers (first 20 items)...');
    const dealersToSeed = mockDealers.slice(0, 20);
    for (const dealer of dealersToSeed) {
      await db.insert(dealers).values({
        dealerCode: dealer.dealerCode,
        name: dealer.name,
        rating: dealer.rating.toString(),
        reviewCount: dealer.reviewCount,
        location: dealer.location,
        distance: dealer.distance,
        price: dealer.price.toString(),
        unit: dealer.unit,
        deliveryTime: dealer.deliveryTime,
        verified: dealer.verified,
        image: dealer.image,
        features: dealer.features,
        category: dealer.category,
        subcategory: dealer.subcategory,
        description: dealer.description,
        businessType: dealer.businessType,
        yearEstablished: dealer.yearEstablished,
        deliveryArea: dealer.deliveryArea,
        certifications: dealer.certifications,
        responseRate: dealer.responseRate,
        avgResponseTime: dealer.avgResponseTime,
        orderFulfillmentRate: dealer.orderFulfillmentRate,
        logo: dealer.logo,
      });
      console.log(`✅ Created dealer: ${dealer.name}`);
    }

    console.log('\n✨ Seeding complete!');
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await sql.end();
    process.exit(1);
  }
}

seed();
