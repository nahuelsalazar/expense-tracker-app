import {
  Expense,
  CreateExpenseDto,
  ExpenseDetailed,
  CreateExpenseDetailDto,
} from "shared/interfaces/expense.interface";

export interface ExpenseError {
  load?: string;
  create?: string;
  createDetail?: string;
  delete?: string;
  detail?: string;
}

export interface ExpenseService {
  getAll(): Promise<Expense[]>;
  getAllByPeriod(year: number, month: number): Promise<Expense[]>;
  getOne(id: number): Promise<ExpenseDetailed>;
  create(expense: CreateExpenseDto): Promise<Expense>;
  createDetail(expense: CreateExpenseDetailDto): Promise<ExpenseDetailed>;
  remove(id: number): Promise<void>;
  removeDetail(id: number): Promise<void>;
  loadMock(): Promise<Expense[]>;
  getSummaryByCategories(year: number, month: number): Promise<any[]>;
}
