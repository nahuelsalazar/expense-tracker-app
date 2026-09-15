import { CategoryService } from "@/interfaces/category.interface";
import { CreateCategoryDto } from "shared/interfaces/category.interface";

export const categoryElectronService: CategoryService = {
  getAll: () => window.api.categories.getAll(),
  create: (category: CreateCategoryDto) =>
    window.api.categories.create(category),
  remove: (categoryId: number) => window.api.categories.remove(categoryId),
};
