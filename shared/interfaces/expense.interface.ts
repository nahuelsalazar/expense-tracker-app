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

export type Result<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export const ok = <T = void>(data?: T): Result<T> => ({
  success: true,
  data: data as T,
});

export const fail = (error: unknown, fallback: string): Result<never> => ({
  success: false,
  error: error instanceof Error ? error.message : fallback,
});
