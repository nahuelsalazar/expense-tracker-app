import { ExpenseService } from "@/interfaces/expense.interface";

export const expenseElectronService: ExpenseService = {
  getAll: () => window.api.expenses.getAll(),
  getAllByPeriod: (year: number, month: number) =>
    window.api.expenses.getAllByPeriod(year, month),
  getOne: (id) => window.api.expenses.getOne(id),
  create: (expense) => window.api.expenses.create(expense),
  createDetail: (detail) => window.api.expenses.createDetail(detail),
  remove: (id) => window.api.expenses.remove(id),
  removeDetail: (id) => window.api.expenses.removeDetail(id),
  loadMock: () => window.api.expenses.loadMock(),
  getSummaryByCategories: (year: number, month: number) =>
    window.api.expenses.getSummaryByCategories(year, month),
};
