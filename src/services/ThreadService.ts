import { ThreadRepository } from "@/repositories/ThreadRepository";
import type { CreateThreadRequest } from "@/types";

export class ThreadService {
  private threadRepository: ThreadRepository;

  constructor() {
    this.threadRepository = new ThreadRepository();
  }

  async getAllThreads() {
    return await this.threadRepository.findAll();
  }

  async createThread(creatorId: number, data: CreateThreadRequest) {
    if (!data.startingNumber) {
      throw new Error("Starting number is required");
    }

    return await this.threadRepository.create(creatorId, data.startingNumber);
  }
}
