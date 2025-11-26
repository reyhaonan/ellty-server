import { threads, users } from "@/models";
import { desc, eq } from "drizzle-orm";
import { db } from "@/config/database";

export class ThreadRepository {
  private table = threads;

  async findById(id: number) {
    const result = await db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);
    return result[0] || null;
  }

  async findAll() {
    return await db
      .select({
        id: this.table.id,
        creatorId: this.table.creatorId,
        creatorUsername: users.username,
        startingNumber: this.table.startingNumber,
        createdAt: this.table.createdAt,
      })
      .from(this.table)
      .leftJoin(users, eq(this.table.creatorId, users.id))
      .orderBy(desc(this.table.createdAt));
  }

  async findByIdWithCreator(id: number) {
    const result = await db
      .select({
        id: this.table.id,
        creatorId: this.table.creatorId,
        creatorUsername: users.username,
        startingNumber: this.table.startingNumber,
        createdAt: this.table.createdAt,
      })
      .from(this.table)
      .leftJoin(users, eq(this.table.creatorId, users.id))
      .where(eq(this.table.id, id))
      .limit(1);

    return result[0] || null;
  }

  async create(creatorId: number, startingNumber: string) {
    const result = await db
      .insert(this.table)
      .values({
        creatorId,
        startingNumber,
      })
      .returning();

    return result[0];
  }
}
