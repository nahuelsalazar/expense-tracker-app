import { db } from "../../../db";

export interface User {
  id?: number;
  name: string;
  email: string;
}

export class UserRepository {
  async findAll(): Promise<User[]> {
    return db.prepare("SELECT * FROM users").all() as User[];
  }

  async create(user: User): Promise<User> {
    const statement = db.prepare(
      "INSERT INTO users (name, email) VALUES (?, ?)",
    );

    const result = statement.run(user.name, user.email);

    return {
      id: Number(result.lastInsertRowid),
      ...user,
    };
  }
}
