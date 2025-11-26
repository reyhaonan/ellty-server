import bcrypt from "bcrypt";
import { UserRepository } from "@/repositories/UserRepository";
import type { RegisterRequest, LoginRequest } from "@/types";

const SALT_ROUNDS = 10;

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterRequest) {
    if (!data.username || !data.password) {
      throw new Error("Username and password are required");
    }

    const existingUser = await this.userRepository.findByUsername(
      data.username
    );
    if (existingUser) {
      throw new Error("Username is already taken");
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    return await this.userRepository.create(data.username, hashedPassword);
  }

  async login(data: LoginRequest) {
    if (!data.username || !data.password) {
      throw new Error("Username and password are required");
    }

    const user = await this.userRepository.findByUsername(data.username);

    if (!user || !user.password) {
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
