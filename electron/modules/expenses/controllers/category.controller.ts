import { ipcMain } from "electron";
import { CategoryService } from "../services/category.service";
import { CreateCategoryDto } from "shared/interfaces/category.interface";

export class CategoryController {
  private categoryService = new CategoryService();

  getAll = () => {
    return this.categoryService.getAll();
  };

  create = (_event: Electron.IpcMainInvokeEvent, dto: CreateCategoryDto) => {
    return this.categoryService.create(dto);
  };

  remove = (_event: Electron.IpcMainInvokeEvent, categoryId: number) => {
    return this.categoryService.remove(categoryId);
  };

  registerRoutes() {
    ipcMain.handle("categories:get-all", this.getAll);
    ipcMain.handle("categories:create", this.create);
    ipcMain.handle("categories:remove", this.remove);
  }
}
