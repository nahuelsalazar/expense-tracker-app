import { ipcMain } from "electron";
import { ExpenseService } from "../services/expense.service";
import {
  CreateExpenseDetailDto,
  CreateExpenseDto,
} from "../../../../shared/interfaces/expense.interface";

export class ExpenseController {
  private expenseService = new ExpenseService();

  getAll = async () => {
    try {
      return await this.expenseService.findAll();
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  getAllByPeriod = async (
    _event: Electron.IpcMainInvokeEvent,
    year: number,
    month: number,
  ) => {
    try {
      return this.expenseService.findAllByPeriod(year, month);
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  getOne = async (_event: Electron.IpcMainInvokeEvent, id: number) => {
    try {
      return this.expenseService.findOne(id);
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  create = async (
    _event: Electron.IpcMainInvokeEvent,
    expense: CreateExpenseDto,
  ) => {
    try {
      return this.expenseService.create(expense);
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  createDetail = async (
    _event: Electron.IpcMainInvokeEvent,
    detail: CreateExpenseDetailDto,
  ) => {
    try {
      return this.expenseService.createDetail(detail);
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  deleteExpense = (_event: Electron.IpcMainInvokeEvent, id: number) => {
    try {
      return this.expenseService.deleteExpense(id);
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  deleteDetail = (_event: Electron.IpcMainInvokeEvent, id: number) => {
    try {
      return this.expenseService.deleteDetail(id);
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  loadMock = () => {
    return this.expenseService.loadMock();
  };

  getSummaryByCategories = (
    _event: Electron.IpcMainInvokeEvent,
    year: number,
    month: number,
  ) => {
    return this.expenseService.getSummaryByCategories(year, month);
  };

  registerRoutes() {
    ipcMain.handle("expenses:get-all", this.getAll);
    ipcMain.handle("expenses:get-all-by-period", this.getAllByPeriod);
    ipcMain.handle("expenses:get-one", this.getOne);
    ipcMain.handle("expenses:create", this.create);
    ipcMain.handle("expenses:create-detail", this.createDetail);
    ipcMain.handle("expenses:remove-detail", this.deleteDetail);
    ipcMain.handle("expenses:remove", this.deleteExpense);
    ipcMain.handle("expenses:load-mock", this.loadMock);
    ipcMain.handle("expenses:summary-categories", this.getSummaryByCategories);
  }
}
