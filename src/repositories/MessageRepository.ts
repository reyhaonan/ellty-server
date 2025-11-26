import { messages, users } from "@/models";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/config/database";

export class MessageRepository {
  private table = messages;

  // --- Single Message Operations (Unchanged) ---
  async findById(id: number) {
    const result = await db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);
    return result[0] || null;
  }

  async findByIdWithAuthor(id: number) {
    const result = await db
      .select({
        id: this.table.id,
        parentMessageId: this.table.parentMessageId,
        threadId: this.table.threadId,
        authorId: this.table.authorId,
        authorUsername: users.username,
        operation: this.table.operation,
        operand: this.table.operand,
        resultNumber: this.table.resultNumber,
        depth: this.table.depth,
        createdAt: this.table.createdAt,
      })
      .from(this.table)
      .leftJoin(users, eq(this.table.authorId, users.id))
      .where(eq(this.table.id, id))
      .limit(1);
    return result[0] || null;
  }

  async create(data: {
    parentMessageId?: number;
    threadId: number;
    authorId: number;
    operation: "add" | "sub" | "mul" | "div";
    operand: string;
    resultNumber: string;
    depth: number;
  }) {
    const result = await db.insert(this.table).values(data).returning();
    return result[0];
  }

  async update(
    id: number,
    data: {
      operation: "add" | "sub" | "mul" | "div";
      operand: string;
      resultNumber: string;
    }
  ) {
    const result = await db
      .update(this.table)
      .set(data)
      .where(eq(this.table.id, id))
      .returning();
    return result[0];
  }

  async findAll(threadId: number) {
    const rootMessages = await db
      .select({ id: this.table.id })
      .from(this.table)
      .where(and(eq(this.table.threadId, threadId), eq(this.table.depth, 0)))
      .orderBy(desc(this.table.createdAt));

    const rootIds = rootMessages.map((msg) => msg.id);

    if (rootIds.length === 0) {
      return {
        messages: [],
      };
    }

    const allMessages = await db
      .select({
        id: this.table.id,
        parentMessageId: this.table.parentMessageId,
        threadId: this.table.threadId,
        authorId: this.table.authorId,
        authorUsername: users.username,
        operation: this.table.operation,
        operand: this.table.operand,
        resultNumber: this.table.resultNumber,
        depth: this.table.depth,
        createdAt: this.table.createdAt,
      })
      .from(this.table)
      .leftJoin(users, eq(this.table.authorId, users.id))
      .where(eq(this.table.threadId, threadId))
      .orderBy(this.table.depth, desc(this.table.createdAt));

    type Message = {
      replies: Message[];
    } & (typeof allMessages)[number];

    const messageMap = new Map<number, Message>();
    const fullTree: Message[] = [];

    allMessages.forEach((msg) => {
      messageMap.set(msg.id, { ...msg, replies: [] });
    });

    // Assemble the tree by linking children to their parents.
    allMessages.forEach((msg) => {
      const node = messageMap.get(msg.id);
      if (!node) return; // Skip if node doesn't exist in map

      if (msg.depth === 0) {
        fullTree.push(node);
      } else {
        // Add null check for parentMessageId
        if (msg.parentMessageId !== null) {
          const parent = messageMap.get(msg.parentMessageId);
          if (parent) {
            parent.replies.push(node);
          }
        }
      }
    });

    return {
      messages: fullTree,
    };
  }
}
