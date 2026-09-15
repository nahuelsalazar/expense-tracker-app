import { db } from "../../../db";
import {
  Category,
  CreateCategoryDto,
} from "../../../../shared/interfaces/category.interface";

export class CategoryRepository {
  getAll() {
    return db
      .prepare("SELECT * FROM categories ORDER BY id DESC")
      .all() as Category[];
  }

  create(dto: CreateCategoryDto) {
    const stmt = db.prepare("INSERT INTO categories (category) VALUES (?)");
    const result = stmt.run(dto.category.toLocaleUpperCase());
    return {
      ...dto,
      id: result.lastInsertRowid,
    };
  }

  remove(categoryId: number) {
    const result = db
      .prepare(
        "SELECT id FROM expense_details WHERE (category_id = ? and is_active = 1) LIMIT 1",
      )
      .all(categoryId);

    const isUsed = result.length > 0;

    if (isUsed) {
      return {
        error:
          "Esta categoría no se puede eliminar porque tiene gastos asociados",
      };
    }

    const stmt = db.prepare("DELETE FROM categories WHERE id = ?");
    stmt.run(categoryId);
    return {
      id: categoryId,
    };
  }
}
