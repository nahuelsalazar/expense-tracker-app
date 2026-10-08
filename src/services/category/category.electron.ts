import { CategoryService } from "@/interfaces/category.interface";
import { CreateCategoryDto } from "shared/interfaces/category.interface";

export const categoryElectronService: CategoryService = {
  getAll: () => window.api.categories.getAll(),
  create: async (category: CreateCategoryDto) => {
    const response = await window.api.categories.create(category);
    if (!response.ok) {
      throw response.data;
    }

    return response.data;
  },
  remove: async (categoryId: number) => {
    const response = await window.api.categories.remove(categoryId);
    if (!response.ok) {
      throw response.data;
    }
    return response.data;
  },
};
