import { db } from '../config/database';
import { conversations, messages, users, type Conversation, type Message, type InsertConversation, type InsertMessage } from '../../shared/schema';
import { eq, and, or, desc } from 'drizzle-orm';

class MessageService {
  async getOrCreateConversation(user1Id: number, user2Id: number): Promise<Conversation> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(
        or(
          and(eq(conversations.user1Id, user1Id), eq(conversations.user2Id, user2Id)),
          and(eq(conversations.user1Id, user2Id), eq(conversations.user2Id, user1Id))
        )
      );

    if (conversation) {
      return conversation;
    }

    const [newConversation] = await db
      .insert(conversations)
      .values({
        user1Id,
        user2Id,
      })
      .returning();

    return newConversation;
  }

  async getUserConversations(userId: number) {
    const userConversations = await db
      .select({
        conversation: conversations,
        otherUser: users,
        lastMessage: messages,
      })
      .from(conversations)
      .leftJoin(users, or(
        and(eq(conversations.user1Id, userId), eq(users.id, conversations.user2Id)),
        and(eq(conversations.user2Id, userId), eq(users.id, conversations.user1Id))
      ))
      .leftJoin(messages, eq(messages.conversationId, conversations.id))
      .where(or(
        eq(conversations.user1Id, userId),
        eq(conversations.user2Id, userId)
      ))
      .orderBy(desc(conversations.lastMessageAt));

    return userConversations;
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    return conversationMessages;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();

    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, insertMessage.conversationId));

    return message;
  }

  async updateMessageStatus(messageId: number, status: 'sent' | 'delivered' | 'read'): Promise<Message> {
    const [message] = await db
      .update(messages)
      .set({ status })
      .where(eq(messages.id, messageId))
      .returning();

    return message;
  }
}

export const messageService = new MessageService();
