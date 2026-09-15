import { UserRepository, User } from "../repositories/user.repository";

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async registerUser(user: User): Promise<User> {
    if (!user.email.includes("@")) {
      throw new Error("El formato del correo electrónico es inválido.");
    }
    return await this.userRepository.create(user);
  }
}
