import zod from "zod";

import { CreateCategoryDto } from "shared/interfaces/category.interface";
import { CategoryRepository } from "../repositories/category.repository";
import { jsonResponse } from "../../../utils";

export class CategoryService {
  categoryRepo = new CategoryRepository();

  categorySchema = zod.object({
    category: zod
      .string({ error: "Este campo es obligatorio" })
      .trim()
      .min(4, "El campo debe tener como mínimo 4 caracteres"),
  });

  getAll() {
    return this.categoryRepo.getAll();
  }

  create(dto: CreateCategoryDto) {
    const validation = this.categorySchema.safeParse(dto);

    if (!validation.success) {
      const response = jsonResponse(
        400,
        zod.flattenError(validation.error).fieldErrors,
      );
      return response;
    }

    try {
      const exist = this.categoryRepo.findOne(validation.data.category);
      if (exist) {
        return jsonResponse(400, {
          category: ["Esta categoría ya existe"],
        });
      }

      dto.category = dto.category.toLocaleUpperCase();
      const result = this.categoryRepo.create(dto);

      return jsonResponse(201, result);
    } catch (error) {
      console.error("Error crítico de base de datos:", error);
      return jsonResponse(500);
    }
  }

  remove(categoryId: number) {
    const result = this.categoryRepo.remove(categoryId);
    if (result.error) {
      return jsonResponse(500, {
        detail: result.error,
      });
    }

    return jsonResponse(200, result.id);
  }
}
