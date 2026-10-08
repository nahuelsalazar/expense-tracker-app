import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useCategory } from "../../hooks/useCategory";
import { getSelectItems } from "../../lib/utils";

import {
  CreateExpenseDto,
  Result,
  Expense,
} from "shared/interfaces/expense.interface";

interface ExpenseFormProps {
  onCreateExpense: (expense: CreateExpenseDto) => Promise<Result<Expense>>;
}

const DEFAULTS = {
  category_id: null,
  value: "",
  description: "",
  expense_date: "",
};

export function ExpenseForm({ onCreateExpense }: ExpenseFormProps) {
  const [categoryId, setCategoryId] = useState<number | null>(
    DEFAULTS.category_id,
  );
  const [expenseValue, setExpenseValue] = useState("");
  const [expenseDate, setExpenseDate] = useState(DEFAULTS.expense_date);
  const [expenseDesc, setExpenseDesc] = useState(DEFAULTS.description);

  const { categories } = useCategory();
  const categorySelectItems = getSelectItems(categories, "category", "id");

  const handleSubmit = async () => {
    const expense = {
      description: expenseDesc,
      value: Number(expenseValue),
      expense_date: expenseDate,
      category_id: categoryId,
    };

    const result = await onCreateExpense(expense);

    if (!result.success) {
      toast.add({
        type: "error",
        description: result.globalError,
        priority: "high",
      });

      return;
    }

    resetForm();
  };

  const resetForm = () => {
    setCategoryId(DEFAULTS.category_id);
    setExpenseDate(DEFAULTS.expense_date);
    setExpenseDesc(DEFAULTS.description);
    setExpenseValue(DEFAULTS.value);
  };

  return (
    <Card className="lg:col-span-1 shadow-sm border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg">Nuevo Gasto</CardTitle>
        <CardDescription>Registra una nueva transacción</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción</label>
          <Input
            placeholder="Ej. Supermercado"
            className="focus-visible:ring-zinc-900"
            onChange={(e) => setExpenseDesc(e.target.value)}
            value={expenseDesc}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Monto</label>
          <Input
            type="number"
            placeholder="$ 0.00"
            className="focus-visible:ring-zinc-900"
            onChange={(e) => setExpenseValue(e.target.value)}
            value={expenseValue}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha</label>
          <div className="relative">
            <Input
              type="date"
              className="focus-visible:ring-zinc-900 w-full"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoría</label>
          <Select
            items={categorySelectItems}
            value={categoryId}
            name="category_id"
            onValueChange={(v) => setCategoryId(v)}
          >
            <SelectTrigger className="w-full focus:ring-zinc-900">
              <SelectValue placeholder="Selecciona..." />
            </SelectTrigger>
            <SelectContent>
              {categorySelectItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          className="w-full mt-4 bg-zinc-900 hover:bg-zinc-800 text-white"
          onClick={handleSubmit}
          disabled={
            !expenseDesc || !expenseDate || !expenseValue || !categoryId
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Gasto
        </Button>
      </CardContent>
    </Card>
  );
}
