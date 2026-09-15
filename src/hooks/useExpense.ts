import { useEffect, useState, useCallback } from "react";
import {
  CreateExpenseDto,
  CreateExpenseDetailDto, // Tipo adecuado en lugar de 'any'
  Expense,
  ExpenseDetailed,
  Result,
} from "../../shared/interfaces/expense.interface";
import { expenseService } from "@/services/expense/expense.service";
import { ok, fail } from "../../shared/interfaces/expense.interface";

export function useExpense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseDetailed | null>(null);

  const loadExpenses = useCallback(
    async (
      year = new Date().getFullYear(),
      month = new Date().getMonth() + 1,
    ) => {
      try {
        const data = await expenseService.getAllByPeriod(year, month);
        setExpenses(data);
      } catch (err) {
        console.error(err);
        setInitialLoadError("No se pudieron cargar los gastos iniciales.");
      }
    },
    [],
  );

  const getSummaryByCategories = useCallback(
    async (
      year = new Date().getFullYear(),
      month = new Date().getMonth() + 1,
    ) => {
      try {
        const result = await expenseService.getSummaryByCategories(year, month);
        setChartData(result);
      } catch (error) {
        return fail(error, "Fallo al obtener datos del grafico");
      }
    },
    [],
  );

  useEffect(() => {
    loadExpenses();
    getSummaryByCategories();
  }, [loadExpenses, getSummaryByCategories]);

  const getOneExpense = useCallback(async (id: number): Promise<Result> => {
    try {
      const expense = await expenseService.getOne(id);
      setSelectedExpense(expense);
      return ok();
    } catch (err) {
      return fail(err, "Error al obtener el detalle");
    }
  }, []);

  const createExpense = useCallback(
    async (expense: CreateExpenseDto): Promise<Result<Expense>> => {
      try {
        const data = await expenseService.create(expense);
        setExpenses((prev) => [...prev, data]);
        getSummaryByCategories();
        return ok(data);
      } catch (err) {
        return fail(err, "Error al crear el gasto");
      }
    },
    [],
  );

  const createExpenseDetail = useCallback(
    async (detail: CreateExpenseDetailDto): Promise<Result> => {
      try {
        await expenseService.createDetail(detail);
        await getOneExpense(detail.expense_id);
        getSummaryByCategories();
        return ok();
      } catch (err) {
        return fail(err, "Error al crear el detalle");
      }
    },
    [getOneExpense],
  );

  const removeExpense = useCallback(
    async (id: number): Promise<Result<number>> => {
      try {
        await expenseService.remove(id);
        setExpenses((prev) => prev.filter((e) => e.id !== id));
        getSummaryByCategories();
        return ok(id);
      } catch (err) {
        return fail(err, "Error al eliminar");
      }
    },
    [],
  );

  const removeExpenseDetail = useCallback(
    async (expense_id: number, detail_id: number): Promise<Result<number>> => {
      try {
        await expenseService.removeDetail(detail_id);
        getOneExpense(expense_id);
        getSummaryByCategories();
        return ok(detail_id);
      } catch (err) {
        return fail(err, "Error al eliminar");
      }
    },
    [],
  );

  const loadMockExpenses = useCallback(async () => {
    try {
      const mockData = await expenseService.loadMock();
      setExpenses(mockData);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const clearSelectedExpense = useCallback(() => setSelectedExpense(null), []);

  return {
    expenses,
    selectedExpense,
    initialLoadError,
    loadExpenses,
    getOneExpense,
    createExpense,
    createExpenseDetail,
    removeExpense,
    removeExpenseDetail,
    loadMockExpenses,
    clearSelectedExpense,
    chartData,
    getSummaryByCategories,
  };
}
