// src/seed.ts
import bcrypt from "bcrypt";
import { db } from "@/config/database";
import { users, threads, messages } from "@/models";

// Helper function to hash passwords
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

const main = async () => {
  console.log("🌱 Starting database seeding...");

  try {
    // =================================================================
    // 1. SEED USERS (Unchanged)
    // =================================================================
    console.log("Seeding users...");
    const alicePassword = await hashPassword("password123");
    const bobPassword = await hashPassword("password456");
    const charliePassword = await hashPassword("password789");

    await db
      .insert(users)
      .values([
        { username: "alice", password: alicePassword },
        { username: "bob", password: bobPassword },
        { username: "charlie", password: charliePassword },
      ])
      .onConflictDoNothing();
    console.log("Users seeded.");

    // =================================================================
    // 2. SEED THREADS (Unchanged)
    // =================================================================
    console.log("Seeding threads...");
    const [aliceThread] = await db
      .insert(threads)
      .values({ creatorId: 1, startingNumber: "42" })
      .returning();

    const [bobThread] = await db
      .insert(threads)
      .values({ creatorId: 2, startingNumber: "100" })
      .returning();

    const [charlieThread] = await db
      .insert(threads)
      .values({ creatorId: 3, startingNumber: "7" })
      .returning();

    const [aliceThread2] = await db
      .insert(threads)
      .values({ creatorId: 1, startingNumber: "0" })
      .returning();

    const [bobThread2] = await db
      .insert(threads)
      .values({ creatorId: 2, startingNumber: "999" })
      .returning();
    console.log("Threads seeded.");

    // =================================================================
    // 3. SEED MESSAGES (Corrected: Create Root Messages First)
    // =================================================================
    console.log("Seeding messages...");

    // --- Alice's Thread (ID: 1, starting: 42) ---
    // NEW: Create the root message for this thread
    const [aliceRootMsg] = await db
      .insert(messages)
      .values({
        threadId: aliceThread.id,
        authorId: 1, // alice creates the root message of her own thread
        operation: "add", // A no-op operation
        operand: "0",
        resultNumber: "42.0000", // The starting number
        depth: 0, // THIS IS THE KEY: It's a root message
      })
      .returning();

    // Now, replies to the root message
    const [msg1] = await db
      .insert(messages)
      .values({
        threadId: aliceThread.id,
        parentMessageId: aliceRootMsg.id,
        authorId: 3,
        operation: "add",
        operand: "8",
        resultNumber: "50.0000",
        depth: 1,
      })
      .returning();
    const [msg2] = await db
      .insert(messages)
      .values({
        threadId: aliceThread.id,
        parentMessageId: msg1.id,
        authorId: 2,
        operation: "div",
        operand: "2",
        resultNumber: "25.0000",
        depth: 2,
      })
      .returning();
    await db
      .insert(messages)
      .values({
        threadId: aliceThread.id,
        parentMessageId: msg2.id,
        authorId: 1,
        operation: "mul",
        operand: "4",
        resultNumber: "100.0000",
        depth: 3,
      })
      .returning();
    const [msg4] = await db
      .insert(messages)
      .values({
        threadId: aliceThread.id,
        parentMessageId: aliceRootMsg.id,
        authorId: 3,
        operation: "sub",
        operand: "2",
        resultNumber: "40.0000",
        depth: 1,
      })
      .returning();
    await db
      .insert(messages)
      .values({
        threadId: aliceThread.id,
        parentMessageId: msg4.id,
        authorId: 2,
        operation: "mul",
        operand: "2.5",
        resultNumber: "100.0000",
        depth: 2,
      })
      .returning();
    await db
      .insert(messages)
      .values({
        threadId: aliceThread.id,
        parentMessageId: aliceRootMsg.id,
        authorId: 1,
        operation: "mul",
        operand: "2",
        resultNumber: "84.0000",
        depth: 1,
      })
      .returning();

    // --- Bob's Thread (ID: 2, starting: 100) ---
    // NEW: Create the root message
    const [bobRootMsg] = await db
      .insert(messages)
      .values({
        threadId: bobThread.id,
        authorId: 2,
        operation: "add",
        operand: "0",
        resultNumber: "100.0000",
        depth: 0,
      })
      .returning();

    const [msg7] = await db
      .insert(messages)
      .values({
        threadId: bobThread.id,
        parentMessageId: bobRootMsg.id,
        authorId: 1,
        operation: "sub",
        operand: "1",
        resultNumber: "99.0000",
        depth: 1,
      })
      .returning();
    await db
      .insert(messages)
      .values({
        threadId: bobThread.id,
        parentMessageId: msg7.id,
        authorId: 3,
        operation: "add",
        operand: "1",
        resultNumber: "100.0000",
        depth: 2,
      })
      .returning();
    const [msg9] = await db
      .insert(messages)
      .values({
        threadId: bobThread.id,
        parentMessageId: bobRootMsg.id,
        authorId: 2,
        operation: "div",
        operand: "10",
        resultNumber: "10.0000",
        depth: 1,
      })
      .returning();
    const [msg10] = await db
      .insert(messages)
      .values({
        threadId: bobThread.id,
        parentMessageId: msg9.id,
        authorId: 1,
        operation: "mul",
        operand: "10",
        resultNumber: "100.0000",
        depth: 2,
      })
      .returning();
    await db
      .insert(messages)
      .values({
        threadId: bobThread.id,
        parentMessageId: msg10.id,
        authorId: 3,
        operation: "sub",
        operand: "50",
        resultNumber: "50.0000",
        depth: 3,
      })
      .returning();

    // --- Charlie's Thread (ID: 3, starting: 7) ---
    // NEW: Create the root message
    const [charlieRootMsg] = await db
      .insert(messages)
      .values({
        threadId: charlieThread.id,
        authorId: 3,
        operation: "add",
        operand: "0",
        resultNumber: "7.0000",
        depth: 0,
      })
      .returning();

    const [msg12] = await db
      .insert(messages)
      .values({
        threadId: charlieThread.id,
        parentMessageId: charlieRootMsg.id,
        authorId: 1,
        operation: "mul",
        operand: "3",
        resultNumber: "21.0000",
        depth: 1,
      })
      .returning();
    const [msg13] = await db
      .insert(messages)
      .values({
        threadId: charlieThread.id,
        parentMessageId: msg12.id,
        authorId: 2,
        operation: "sub",
        operand: "1",
        resultNumber: "20.0000",
        depth: 2,
      })
      .returning();
    const [msg14] = await db
      .insert(messages)
      .values({
        threadId: charlieThread.id,
        parentMessageId: msg13.id,
        authorId: 3,
        operation: "div",
        operand: "2",
        resultNumber: "10.0000",
        depth: 3,
      })
      .returning();
    const [msg15] = await db
      .insert(messages)
      .values({
        threadId: charlieThread.id,
        parentMessageId: msg14.id,
        authorId: 1,
        operation: "mul",
        operand: "10",
        resultNumber: "100.0000",
        depth: 4,
      })
      .returning();
    const [msg16] = await db
      .insert(messages)
      .values({
        threadId: charlieThread.id,
        parentMessageId: msg15.id,
        authorId: 2,
        operation: "sub",
        operand: "99",
        resultNumber: "1.0000",
        depth: 5,
      })
      .returning();
    await db
      .insert(messages)
      .values({
        threadId: charlieThread.id,
        parentMessageId: msg16.id,
        authorId: 3,
        operation: "add",
        operand: "0",
        resultNumber: "1.0000",
        depth: 6,
      })
      .returning();
    await db
      .insert(messages)
      .values({
        threadId: charlieThread.id,
        parentMessageId: charlieRootMsg.id,
        authorId: 1,
        operation: "add",
        operand: "93",
        resultNumber: "100.0000",
        depth: 1,
      })
      .returning();

    // --- Alice's Second Thread (ID: 4, starting: 0) ---
    const [aliceRootMsg2] = await db
      .insert(messages)
      .values({
        threadId: aliceThread2.id,
        authorId: 1,
        operation: "add",
        operand: "0",
        resultNumber: "0.0000",
        depth: 0,
      })
      .returning();
    const [msg19] = await db
      .insert(messages)
      .values({
        threadId: aliceThread2.id,
        parentMessageId: aliceRootMsg2.id,
        authorId: 2,
        operation: "add",
        operand: "100",
        resultNumber: "100.0000",
        depth: 1,
      })
      .returning();
    await db
      .insert(messages)
      .values({
        threadId: aliceThread2.id,
        parentMessageId: msg19.id,
        authorId: 3,
        operation: "div",
        operand: "2",
        resultNumber: "50.0000",
        depth: 2,
      })
      .returning();
    await db
      .insert(messages)
      .values({
        threadId: aliceThread2.id,
        parentMessageId: msg19.id,
        authorId: 1,
        operation: "mul",
        operand: "0",
        resultNumber: "0.0000",
        depth: 2,
      })
      .returning();

    // --- Bob's Second Thread (ID: 5, starting: 999) ---
    const [bobRootMsg2] = await db
      .insert(messages)
      .values({
        threadId: bobThread2.id,
        authorId: 2,
        operation: "add",
        operand: "0",
        resultNumber: "999.0000",
        depth: 0,
      })
      .returning();
    const [msg22] = await db
      .insert(messages)
      .values({
        threadId: bobThread2.id,
        parentMessageId: bobRootMsg2.id,
        authorId: 3,
        operation: "sub",
        operand: "899",
        resultNumber: "100.0000",
        depth: 1,
      })
      .returning();
    await db
      .insert(messages)
      .values({
        threadId: bobThread2.id,
        parentMessageId: msg22.id,
        authorId: 1,
        operation: "div",
        operand: "100",
        resultNumber: "1.0000",
        depth: 2,
      })
      .returning();

    console.log("Messages seeded.");

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
};

main();
