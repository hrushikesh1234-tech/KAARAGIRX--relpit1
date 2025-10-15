import { pgTable, text, serial, integer, timestamp, boolean, decimal, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  userType: text("user_type", { enum: ["customer", "contractor", "architect", "material_dealer", "rental_merchant", "admin"] }).notNull(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  phone: text("phone"),
  address: text("address"),
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
  profession: text("profession", { enum: ["contractor", "architect", "material_dealer", "rental_merchant"] }).notNull(),
  experience: integer("experience").default(0),
  profileImage: text("profile_image"),
  about: text("about"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  location: text("location"),
  specializations: jsonb("specializations").$type<string[]>(),
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  availability: text("availability", { enum: ["Available", "Busy", "Away"] }).default("Available"),
  completedProjects: integer("completed_projects").default(0),
  responseTime: text("response_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  professionIdx: index("professionals_profession_idx").on(table.profession),
  locationIdx: index("professionals_location_idx").on(table.location),
  isFeaturedIdx: index("professionals_is_featured_idx").on(table.isFeatured),
  ratingIdx: index("professionals_rating_idx").on(table.rating),
}));

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

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  followingId: integer("following_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
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
  userId: integer("user_id").notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
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
}, (table) => ({
  categoryIdx: index("dealers_category_idx").on(table.category),
  subcategoryIdx: index("dealers_subcategory_idx").on(table.subcategory),
  locationIdx: index("dealers_location_idx").on(table.location),
  ratingIdx: index("dealers_rating_idx").on(table.rating),
}));

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
}, (table) => ({
  userIdIdx: index("orders_user_id_idx").on(table.userId),
  createdAtIdx: index("orders_created_at_idx").on(table.createdAt),
  statusIdx: index("orders_status_idx").on(table.status),
}));

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

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  dealerId: integer("dealer_id").notNull().references(() => dealers.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  quantity: integer("quantity").default(0),
  minOrder: text("min_order"),
  image: text("image"),
  images: jsonb("images").$type<string[]>(),
  specifications: jsonb("specifications").$type<Record<string, string>>(),
  inStock: boolean("in_stock").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  dealerIdIdx: index("materials_dealer_id_idx").on(table.dealerId),
  categoryIdx: index("materials_category_idx").on(table.category),
  subcategoryIdx: index("materials_subcategory_idx").on(table.subcategory),
  inStockIdx: index("materials_in_stock_idx").on(table.inStock),
}));

export const rentalEquipment = pgTable("rental_equipment", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  description: text("description"),
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }).notNull(),
  weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }),
  monthlyRate: decimal("monthly_rate", { precision: 10, scale: 2 }),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
  quantity: integer("quantity").default(1),
  available: integer("available").default(1),
  image: text("image"),
  images: jsonb("images").$type<string[]>(),
  specifications: jsonb("specifications").$type<Record<string, string>>(),
  condition: text("condition", { enum: ["excellent", "good", "fair"] }).default("good"),
  minRentalPeriod: text("min_rental_period"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  categoryIdx: index("rental_equipment_category_idx").on(table.category),
  merchantIdIdx: index("rental_equipment_merchant_id_idx").on(table.merchantId),
  conditionIdx: index("rental_equipment_condition_idx").on(table.condition),
  subcategoryIdx: index("rental_equipment_subcategory_idx").on(table.subcategory),
}));

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  equipmentId: integer("equipment_id").notNull().references(() => rentalEquipment.id, { onDelete: 'cascade' }),
  merchantId: integer("merchant_id").notNull().references(() => professionals.id, { onDelete: 'cascade' }),
  bookingNumber: text("booking_number").unique(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  quantity: integer("quantity").notNull().default(1),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
  status: text("status", { 
    enum: ["pending", "approved", "active", "completed", "cancelled"] 
  }).notNull().default("pending"),
  paymentStatus: text("payment_status", { enum: ["pending", "partially_paid", "paid", "refunded"] }).default("pending"),
  deliveryAddress: text("delivery_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  merchantIdIdx: index("bookings_merchant_id_idx").on(table.merchantId),
  userIdIdx: index("bookings_user_id_idx").on(table.userId),
  equipmentIdIdx: index("bookings_equipment_id_idx").on(table.equipmentId),
  createdAtIdx: index("bookings_created_at_idx").on(table.createdAt),
}));

export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  materialId: integer("material_id").references(() => materials.id, { onDelete: 'cascade' }),
  equipmentId: integer("equipment_id").references(() => rentalEquipment.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text("type", { enum: ["order", "booking", "message", "review", "system"] }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: text("related_id"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  user1Id: integer("user1_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  user2Id: integer("user2_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  user1IdIdx: index("conversations_user1_id_idx").on(table.user1Id),
  user2IdIdx: index("conversations_user2_id_idx").on(table.user2Id),
}));

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: integer("sender_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  text: text("text").notNull(),
  status: text("status", { enum: ["sent", "delivered", "read"] }).default("sent"),
  fileInfo: jsonb("file_info").$type<{
    name: string;
    type: string;
    size: number;
    url: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  conversationIdIdx: index("messages_conversation_id_idx").on(table.conversationId),
  createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  professional: one(professionals, {
    fields: [users.id],
    references: [professionals.userId],
  }),
  dealer: one(dealers, {
    fields: [users.id],
    references: [dealers.userId],
  }),
  reviews: many(reviews),
  bookmarks: many(bookmarks),
  orders: many(orders),
  bookings: many(bookings),
  wishlists: many(wishlists),
  notifications: many(notifications),
  sentMessages: many(messages),
  conversationsAsUser1: many(conversations, { relationName: "user1Conversations" }),
  conversationsAsUser2: many(conversations, { relationName: "user2Conversations" }),
  followers: many(follows, { relationName: "following" }),
  following: many(follows, { relationName: "follower" }),
}));

export const professionalsRelations = relations(professionals, ({ one, many }) => ({
  user: one(users, {
    fields: [professionals.userId],
    references: [users.id],
  }),
  projects: many(projects),
  reviews: many(reviews),
  bookmarks: many(bookmarks),
  rentalEquipment: many(rentalEquipment),
  bookings: many(bookings),
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

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "following",
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

export const dealersRelations = relations(dealers, ({ one, many }) => ({
  user: one(users, {
    fields: [dealers.userId],
    references: [users.id],
  }),
  bookmarks: many(bookmarks),
  orders: many(orders),
  orderItems: many(orderItems),
  materials: many(materials),
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

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user1: one(users, {
    fields: [conversations.user1Id],
    references: [users.id],
    relationName: "user1Conversations",
  }),
  user2: one(users, {
    fields: [conversations.user2Id],
    references: [users.id],
    relationName: "user2Conversations",
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const materialsRelations = relations(materials, ({ one, many }) => ({
  dealer: one(dealers, {
    fields: [materials.dealerId],
    references: [dealers.id],
  }),
  wishlists: many(wishlists),
}));

export const rentalEquipmentRelations = relations(rentalEquipment, ({ one, many }) => ({
  merchant: one(professionals, {
    fields: [rentalEquipment.merchantId],
    references: [professionals.id],
  }),
  bookings: many(bookings),
  wishlists: many(wishlists),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  equipment: one(rentalEquipment, {
    fields: [bookings.equipmentId],
    references: [rentalEquipment.id],
  }),
  merchant: one(professionals, {
    fields: [bookings.merchantId],
    references: [professionals.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  material: one(materials, {
    fields: [wishlists.materialId],
    references: [materials.id],
  }),
  equipment: one(rentalEquipment, {
    fields: [wishlists.equipmentId],
    references: [rentalEquipment.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
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
export const insertFollowSchema = createInsertSchema(follows);
export const insertBookmarkSchema = createInsertSchema(bookmarks);
export const insertDealerSchema = createInsertSchema(dealers);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertMaterialSchema = createInsertSchema(materials);
export const insertRentalEquipmentSchema = createInsertSchema(rentalEquipment);
export const insertBookingSchema = createInsertSchema(bookings);
export const insertConversationSchema = createInsertSchema(conversations);
export const insertMessageSchema = createInsertSchema(messages);
export const insertWishlistSchema = createInsertSchema(wishlists);
export const insertNotificationSchema = createInsertSchema(notifications);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Professional = typeof professionals.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Dealer = typeof dealers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Material = typeof materials.$inferSelect;
export type RentalEquipment = typeof rentalEquipment.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Wishlist = typeof wishlists.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type InsertRentalEquipment = z.infer<typeof insertRentalEquipmentSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
