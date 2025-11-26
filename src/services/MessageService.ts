import { MessageRepository } from "@/repositories/MessageRepository";
import { ThreadRepository } from "@/repositories/ThreadRepository";
import { Calculator } from "@/utils/calculator";
import type { CreateMessageRequest } from "@/types";

export class MessageService {
  private messageRepository: MessageRepository;
  private threadRepository: ThreadRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.threadRepository = new ThreadRepository();
  }

  async getMessages(threadId: number) {
    return await this.messageRepository.findAll(threadId);
  }

  async createMessage(authorId: number, data: CreateMessageRequest) {
    if (!data.threadId || !data.operation || data.operand === undefined) {
      throw new Error("Thread ID, operation, and operand are required");
    }

    let parentNumber: string;
    let depth = 0;

    if (data.parentMessageId) {
      const parentMsg = await this.messageRepository.findById(
        data.parentMessageId
      );

      if (!parentMsg) {
        throw new Error("Parent message not found");
      }

      parentNumber = parentMsg.resultNumber;
      depth = parentMsg.depth + 1;
    } else {
      const thread = await this.threadRepository.findById(data.threadId);

      if (!thread) {
        throw new Error("Thread not found");
      }

      parentNumber = thread.startingNumber;
    }

    const operandNum = parseFloat(data.operand);
    const parentNum = parseFloat(parentNumber);

    const resultNumber = Calculator.calculate(
      data.operation,
      parentNum,
      operandNum
    );

    const newMessage = await this.messageRepository.create({
      parentMessageId: data.parentMessageId || undefined,
      threadId: data.threadId,
      authorId,
      operation: data.operation,
      operand: data.operand,
      resultNumber: resultNumber.toString(),
      depth,
    });

    return await this.messageRepository.findByIdWithAuthor(newMessage.id);
  }
}
