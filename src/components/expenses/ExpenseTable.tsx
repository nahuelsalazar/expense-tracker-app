import { memo, useCallback, useState } from "react";
import { Expense } from "shared/interfaces/expense.interface";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney } from "@/lib/utils";
import { ExpenseError } from "@/interfaces/expense.interface";
import { ExpenseErrorDeleting } from "./ExpenseErrorDeleting";
import { ExpenseErrorDetail } from "./ExpenseErrorDetail";

interface ExpenseTableProps {
  expenses: Expense[];
  onRemove: (id: number) => Promise<any>;
  onDetail: (id: number) => Promise<any>;
}

export const ExpenseTable = memo(
  ({ expenses, onRemove, onDetail }: ExpenseTableProps) => {
    const [errors, setErrors] = useState<ExpenseError>({});

    const handleDelete = useCallback(
      async (id: number) => {
        const result = await onRemove(id);
        if (result.error) {
          setErrors((prev) => ({ ...prev, delete: result.error }));
        }
      },
      [onRemove],
    );

    const handleDetail = useCallback(
      async (id: number) => {
        const result = await onDetail(id);

        if (result.error) {
          setErrors((prev) => ({
            ...prev,
            detail: result.error,
          }));
        }
      },
      [onDetail],
    );

    return (
      <>
        <div className="rounded-md border border-border overflow-hidden">
          <Table className="caption-top">
            <TableCaption>Listado de gastos del mes actual</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-48 ">Opciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.description}</TableCell>
                  <TableCell className="text-right">
                    {formatMoney(e.value)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="secondary"
                        onClick={() => handleDetail(e.id)}
                      >
                        Detalle
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(e.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {errors.delete && <ExpenseErrorDeleting content={errors.delete} />}
        {errors.detail && <ExpenseErrorDetail content={errors.detail} />}
      </>
    );
  },
);
