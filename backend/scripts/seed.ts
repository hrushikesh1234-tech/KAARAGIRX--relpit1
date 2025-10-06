import { db } from "../config/database";
import { users } from "../../shared/schema";

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
    fullName: "Demo Contractor",
    userType: "contractor" as const
  },
  {
    username: "architect1",
    password: "password123",
    email: "architect@example.com",
    fullName: "Demo Architect",
    userType: "architect" as const
  }
];

async function seed() {
  console.log('🌱 Seeding database with demo users...');

  try {
    for (const user of demoUsers) {
      const [insertedUser] = await db
        .insert(users)
        .values(user)
        .returning();
      
      console.log(`✅ Created user: ${insertedUser.username} (${insertedUser.userType})`);
    }

    console.log('✨ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
