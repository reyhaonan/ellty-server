import { users } from "@/models";
import { eq } from "drizzle-orm";
import { db } from "@/config/database";

export class UserRepository {
  private table = users;

  async findById(id: number) {
    const result = await db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);
    return result[0] || null;
  }

  async findByUsername(username: string) {
    const result = await db
      .select()
      .from(this.table)
      .where(eq(this.table.username, username))
      .limit(1);
    return result[0] || null;
  }

  async create(username: string, hashedPassword: string) {
    const result = await db
      .insert(this.table)
      .values({ username, password: hashedPassword })
      .returning();
    return result[0];
  }
}
