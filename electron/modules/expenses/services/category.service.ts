import { CreateCategoryDto } from "shared/interfaces/category.interface";
import { CategoryRepository } from "../repositories/category.repository";

export class CategoryService {
  categoryRepo = new CategoryRepository();

  getAll() {
    return this.categoryRepo.getAll();
  }

  create(dto: CreateCategoryDto) {
    return this.categoryRepo.create(dto);
  }

  remove(categoryId: number) {
    return this.categoryRepo.remove(categoryId);
  }
}
