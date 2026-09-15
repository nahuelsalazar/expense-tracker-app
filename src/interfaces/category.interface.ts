import {
  Category,
  CreateCategoryDto,
} from "shared/interfaces/category.interface";

export interface CategoryService {
  getAll(): Promise<Category[]>;
  create(category: CreateCategoryDto): Promise<Category>;
  remove(categoryId: number): Promise<any>;
}
