import { memo, useState, FormEvent } from "react";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategory } from "@/hooks/useCategory";
import {
  CreateExpenseDto,
  Expense,
  Result,
} from "shared/interfaces/expense.interface";
import { getSelectItems } from "@/lib/utils";

export interface ExpenseFormProps {
  onAddExpense: (expense: CreateExpenseDto) => Promise<Result<Expense>>;
}

const DEFAULT_VALUES = {
  category_id: null,
  value: "",
  description: "",
  expense_date: "",
};

export const ExpenseForm = memo(({ onAddExpense }: ExpenseFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [categoryId, setCategoryId] = useState<number | null>(
    DEFAULT_VALUES.category_id,
  );
  const [expenseValue, setExpenseValue] = useState("");
  const [expenseDate, setExpenseDate] = useState<string>(
    DEFAULT_VALUES.expense_date,
  );
  const [expenseDesc, setExpenseDesc] = useState<string>(
    DEFAULT_VALUES.description,
  );

  const { categories } = useCategory();
  const categorySelectItems = getSelectItems(categories, "category", "id");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const expense = {
      description: expenseDesc,
      value: Number(expenseValue),
      expense_date: expenseDate,
      category_id: categoryId,
    };

    const result = await onAddExpense(expense);

    if (!result.success) {
      setError(result.error);
      return;
    }

    resetForm();
    setError(undefined);
  };

  const resetForm = () => {
    setCategoryId(DEFAULT_VALUES.category_id);
    setExpenseDate(DEFAULT_VALUES.expense_date);
    setExpenseDesc(DEFAULT_VALUES.description);
    setExpenseValue(DEFAULT_VALUES.value);
  };

  return (
    <form onSubmit={handleSubmit} className="my-3">
      <div className="flex flex-col gap-1.5 my-3">
        <div className="leading-none font-medium">Nuevo gasto</div>
      </div>
      <FieldGroup className="grid  grid-cols-5">
        <Field>
          <Input
            onChange={(e) => setExpenseDesc(e.target.value)}
            value={expenseDesc}
            placeholder="Descripción"
            required
          />
        </Field>
        <Field>
          <Input
            onChange={(e) => setExpenseValue(e.target.value)}
            value={expenseValue}
            type="number"
            step="0.01"
            placeholder="Monto"
            required
          ></Input>
        </Field>
        <Field>
          <Input
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            type="date"
            required
          />
        </Field>
        <Field>
          <Select
            items={categorySelectItems}
            value={categoryId}
            name="category_id"
            onValueChange={(v) => setCategoryId(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categorias</SelectLabel>

                {categorySelectItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <Button type="submit">Guardar</Button>
        </Field>
      </FieldGroup>

      {/* Mostrar el error de creación justo debajo del formulario */}
      {error && (
        <p className="mt-2 text-sm font-medium text-destructive">{error}</p>
      )}
    </form>
  );
});
