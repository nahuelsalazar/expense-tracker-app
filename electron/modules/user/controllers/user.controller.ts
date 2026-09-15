import { ipcMain } from "electron";
import { UserService } from "../services/user.service";
import { User } from "../repositories/user.repository";

export class UserController {
  private userService = new UserService();

  async getAll() {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  async getOne(_event: Electron.IpcMainInvokeEvent, params: any) {
    return params;
  }

  async create(_: Electron.IpcMainInvokeEvent, user: User) {
    try {
      return await this.userService.registerUser(user);
    } catch (error: any) {
      // Si el error es de SQLite por duplicado, mandamos un mensaje claro
      if (error.message && error.message.includes("UNIQUE constraint failed")) {
        return { error: "Este correo electrónico ya está registrado." };
      }
      return { error: (error as Error).message };
    }
  }

  registerRoutes() {
    ipcMain.handle("users:get-all", this.getAll);
    ipcMain.handle("users:get-one", this.getOne);
    ipcMain.handle("users:create", this.create);
  }
}
