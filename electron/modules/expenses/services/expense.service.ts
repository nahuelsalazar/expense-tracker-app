import { ExpenseRepository } from "../repositories/expense.repository";

import {
  CreateExpenseDetailDto,
  CreateExpenseDto,
} from "../../../../shared/interfaces/expense.interface";

export class ExpenseService {
  expenseRepo = new ExpenseRepository();
  async findAll() {
    return this.expenseRepo.findAll();
  }

  async findAllByPeriod(year: number, month: number) {
    return this.expenseRepo.findAllByPeriod(year, month);
  }

  async findOne(expense_id: number) {
    return this.expenseRepo.findOne(expense_id);
  }

  async create(dto: CreateExpenseDto) {
    return this.expenseRepo.create(dto);
  }

  async createDetail(dto: CreateExpenseDetailDto) {
    this.expenseRepo.createDetail(dto);
    return this.findOne(dto.expense_id);
  }

  deleteExpense(id: number) {
    return this.expenseRepo.deleteExpense(id);
  }

  deleteDetail(id: number) {
    return this.expenseRepo.deleteDetail(id);
  }

  loadMock() {
    return this.expenseRepo.fill();
  }

  getSummaryByCategories(year: number, month: number) {
    return this.expenseRepo.getSummaryByCategories(year, month);
  }
}
