import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
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
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  console.log('🌱 Seeding database with demo users...');

  const sql = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(sql);

  try {
    for (const user of demoUsers) {
      const [insertedUser] = await db
        .insert(users)
        .values(user)
        .returning();
      
      console.log(`✅ Created user: ${insertedUser.username} (${insertedUser.userType})`);
    }

    console.log('✨ Seeding complete!');
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await sql.end();
    process.exit(1);
  }
}

seed();
