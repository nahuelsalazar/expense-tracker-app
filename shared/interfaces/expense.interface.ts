export type Expense = {
  id: number;
  description: string;
  value: number;
  expense_date: string;
  created_at: string;
  category_id: number | null;
};

export type ExpenseDetail = {
  id: number;
  expense_id: number;
  description: string;
  value: number;
  category_id: number | null;
  is_auto_generated: number;
};

export type ExpenseDetailed = Expense & {
  detail: ExpenseDetail[];
};

export type CreateExpenseDto = Omit<Expense, "id" | "created_at">;
export type CreateExpenseDetailDto = Omit<ExpenseDetail, "id">;

export type FieldErrors = Record<string, string[]>;

export type Result<T = void> =
  | { success: true; data: T }
  | { success: false; globalError: string; fieldErrors: FieldErrors };

export const ok = <T = void>(data?: T): Result<T> => ({
  success: true,
  data: data as T,
});

export const fail = (error: any, fallback: string): Result<never> => {
  console.log(error);
  // 1. Extraemos el error global si existe (DRF usa 'detail' o 'non_field_errors')
  const global = error?.detail || error?.non_field_errors?.[0] || fallback;

  // 2. Limpiamos el objeto para quedarnos solo con los errores de campo
  const fields = { ...error };
  delete fields.detail;
  delete fields.non_field_errors;

  return {
    success: false,
    globalError: global,
    fieldErrors: fields,
  };
};
