import { useState, useEffect } from "react";
import {
  Category,
  CreateCategoryDto,
} from "shared/interfaces/category.interface";
import { ok, fail } from "../../shared/interfaces/expense.interface";
import { categoryService } from "@/services/category/category.service";

export function useCategory() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createCategory = async (category: CreateCategoryDto) => {
    try {
      console.log(category);
      const data = await categoryService.create(category);
      setCategories((prev) => [data, ...prev]);
      return ok();
    } catch (error) {
      return fail(error, "No se pudo crear la categoría");
    }
  };

  const removeCategory = async (categoryId: number) => {
    try {
      const data = await categoryService.remove(categoryId);
      if (data.error) {
        throw new Error(data.error);
      }
      loadCategories();
      return ok();
    } catch (error) {
      return fail(error, "No se pudo eliminar la categoría");
    }
  };

  return {
    categories,
    loadCategories,
    createCategory,
    removeCategory,
  };
}
