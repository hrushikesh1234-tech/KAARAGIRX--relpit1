import { pgTable, text, serial, integer, timestamp, boolean, decimal, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  userType: text("user_type", { enum: ["customer", "contractor", "architect"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const professionals = pgTable("professionals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyName: text("company_name"),
  address: text("address"),
  pincode: text("pincode"),
  phone: text("phone"),
  profession: text("profession", { enum: ["contractor", "architect"] }).notNull(),
  experience: integer("experience").default(0),
  profileImage: text("profile_image"),
  about: text("about"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  location: text("location"),
  specializations: jsonb("specializations").$type<string[]>(),
  isVerified: boolean("is_verified").default(false),
  availability: text("availability", { enum: ["Available", "Busy", "Away"] }).default("Available"),
  completedProjects: integer("completed_projects").default(0),
  responseTime: text("response_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  professionalId: integer("professional_id").notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  propertyType: text("property_type").notNull(),
  type: text("type").notNull(),
  budget: text("budget"),
  completionYear: text("completion_year"),
  completionDate: text("completion_date"),
  area: text("area"),
  location: text("location"),
  bhk: integer("bhk"),
  style: text("style"),
  coverImage: text("cover_image"),
  images: jsonb("images").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  professionalId: integer("professional_id").notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer("rating").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  professionalId: integer("professional_id").references(() => professionals.id, { onDelete: 'cascade' }),
  dealerId: integer("dealer_id").references(() => dealers.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dealers = pgTable("dealers", {
  id: serial("id").primaryKey(),
  dealerCode: text("dealer_code").notNull().unique(),
  name: text("name").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  location: text("location").notNull(),
  distance: text("distance"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  deliveryTime: text("delivery_time"),
  verified: boolean("verified").default(false),
  image: text("image"),
  features: jsonb("features").$type<string[]>(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  description: text("description"),
  businessType: text("business_type"),
  yearEstablished: text("year_established"),
  deliveryArea: text("delivery_area"),
  certifications: jsonb("certifications").$type<string[]>(),
  responseRate: integer("response_rate"),
  avgResponseTime: text("avg_response_time"),
  orderFulfillmentRate: integer("order_fulfillment_rate"),
  logo: text("logo"),
  phone: text("phone"),
  additionalImages: jsonb("additional_images").$type<string[]>(),
  minOrder: text("min_order"),
  productsCount: integer("products_count"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'set null' }),
  orderNumber: text("order_number").unique(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }),
  deliveryCharge: decimal("delivery_charge", { precision: 10, scale: 2 }),
  tax: decimal("tax", { precision: 10, scale: 2 }),
  status: text("status", { 
    enum: ["pending", "verified", "paid", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"] 
  }).notNull().default("pending"),
  paymentStatus: text("payment_status", { enum: ["pending", "partially_paid", "paid"] }).default("pending"),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  shippingAddress: text("shipping_address"),
  trackingNumber: text("tracking_number"),
  carrier: text("carrier"),
  advancePaid: decimal("advance_paid", { precision: 10, scale: 2 }),
  dueAmount: decimal("due_amount", { precision: 10, scale: 2 }),
  isAdvancePaid: boolean("is_advance_paid").default(false),
  isDuePaid: boolean("is_due_paid").default(false),
  dealerName: text("dealer_name"),
  dealerId: integer("dealer_id").references(() => dealers.id, { onDelete: 'set null' }),
  dealerPhone: text("dealer_phone"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  estimatedDelivery: text("estimated_delivery"),
  orderDate: timestamp("order_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(),
  image: text("image"),
  dealerName: text("dealer_name"),
  dealerId: integer("dealer_id").references(() => dealers.id, { onDelete: 'set null' }),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  professional: one(professionals, {
    fields: [users.id],
    references: [professionals.userId],
  }),
  reviews: many(reviews),
  bookmarks: many(bookmarks),
  orders: many(orders),
}));

export const professionalsRelations = relations(professionals, ({ one, many }) => ({
  user: one(users, {
    fields: [professionals.userId],
    references: [users.id],
  }),
  projects: many(projects),
  reviews: many(reviews),
  bookmarks: many(bookmarks),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  professional: one(professionals, {
    fields: [projects.professionalId],
    references: [professionals.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  professional: one(professionals, {
    fields: [reviews.professionalId],
    references: [professionals.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  professional: one(professionals, {
    fields: [bookmarks.professionalId],
    references: [professionals.id],
  }),
  dealer: one(dealers, {
    fields: [bookmarks.dealerId],
    references: [dealers.id],
  }),
}));

export const dealersRelations = relations(dealers, ({ many }) => ({
  bookmarks: many(bookmarks),
  orders: many(orders),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  dealer: one(dealers, {
    fields: [orders.dealerId],
    references: [dealers.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  dealer: one(dealers, {
    fields: [orderItems.dealerId],
    references: [dealers.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  userType: true,
});

export const insertProfessionalSchema = createInsertSchema(professionals);
export const insertProjectSchema = createInsertSchema(projects);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertBookmarkSchema = createInsertSchema(bookmarks);
export const insertDealerSchema = createInsertSchema(dealers);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Professional = typeof professionals.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Dealer = typeof dealers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
