import { ExpenseRepository } from "../repositories/expense.repository";

import {
  CreateExpenseDetailDto,
  CreateExpenseDto,
} from "../../../../shared/interfaces/expense.interface";
import { jsonResponse } from "../../../utils";

export class ExpenseService {
  expenseRepo = new ExpenseRepository();

  async findAllByPeriod(year: number, month: number) {
    return this.expenseRepo.findAllByPeriod(year, month);
  }

  async findOne(expense_id: number) {
    try {
      const data = this.expenseRepo.findOne(expense_id);
      return jsonResponse(200, data);
    } catch (error) {
      return jsonResponse(500);
    }
  }

  async create(dto: CreateExpenseDto) {
    try {
      const data = this.expenseRepo.create(dto);
      return jsonResponse(201, data);
    } catch (error) {
      console.log(error);
      return jsonResponse(500);
    }
  }

  async createDetail(dto: CreateExpenseDetailDto) {
    this.expenseRepo.createDetail(dto);
    return this.findOne(dto.expense_id);
  }

  deleteExpense(id: number) {
    try {
      const data = this.expenseRepo.deleteExpense(id);
      return jsonResponse(200, data);
    } catch (error) {
      return jsonResponse(500);
    }
  }

  deleteDetail(id: number) {
    return this.expenseRepo.deleteDetail(id);
  }

  getSummaryByCategories(year: number, month: number) {
    return this.expenseRepo.getSummaryByCategories(year, month);
  }
}
