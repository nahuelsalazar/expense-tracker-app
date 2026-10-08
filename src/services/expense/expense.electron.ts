import { ExpenseService } from "@/interfaces/expense.interface";

export const expenseElectronService: ExpenseService = {
  getAll: () => window.api.expenses.getAll(),
  getAllByPeriod: (year: number, month: number) =>
    window.api.expenses.getAllByPeriod(year, month),
  getOne: async (id) => {
    const response = await window.api.expenses.getOne(id);
    if (!response.ok) {
      throw response.data;
    }

    return response.data;
  },
  create: async (expense) => {
    const response = await window.api.expenses.create(expense);
    if (!response.ok) {
      throw response.data;
    }

    return response.data;
  },
  createDetail: (detail) => window.api.expenses.createDetail(detail),
  remove: async (id) => {
    const response = await window.api.expenses.remove(id);
    if (!response.ok) {
      throw response.data;
    }

    return response.data;
  },
  removeDetail: (id) => window.api.expenses.removeDetail(id),
  loadMock: () => window.api.expenses.loadMock(),
  getSummaryByCategories: (year: number, month: number) =>
    window.api.expenses.getSummaryByCategories(year, month),
};
