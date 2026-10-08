import { ExpenseDetailed, Result } from "shared/interfaces/expense.interface";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatMoney, formatDate, getSelectItems } from "@/lib/utils";
import { useState } from "react";
import { ExpenseError } from "@/interfaces/expense.interface";
import { ExpenseErrorDetail } from "./ExpenseErrorDetail";
import { useCategory } from "@/hooks/useCategory";

interface ExpenseDetailModalProps {
  expense: ExpenseDetailed | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDetail: (detail: any) => Promise<Result>;
  onRemoveDetail: (
    expense_id: number,
    detail_id: number,
  ) => Promise<Result<number>>;
}

export function ExpenseDetailModal({
  expense,
  open,
  onOpenChange,
  onAddDetail,
  onRemoveDetail,
}: ExpenseDetailModalProps) {
  const { categories } = useCategory();
  const [errors, setErrors] = useState<ExpenseError>({});

  const formatedDate = expense ? formatDate(expense.expense_date) : "";

  const categorySelectItems = getSelectItems(categories, "category", "id");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = await onAddDetail({
      expense_id: Number(formData.get("expense_id")),
      description: formData.get("description") as string,
      value: Number(formData.get("value")),
      category_id: formData.get("category_id") || null,
    });

    if (!result.success) {
      setErrors((prev) => ({ ...prev, createDetail: result.globalError }));
    } else {
      form.reset();
      setErrors((prev) => ({ ...prev, createDetail: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:w-[85vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] h-[auto] max-h-[90vh] overflow-y-auto p-4 sm:p-6px]">
        <DialogHeader>
          <DialogTitle>Detalle del gasto</DialogTitle>
        </DialogHeader>

        {expense && (
          <>
            <div className="space-y-2">
              <p>
                <strong>Descripción:</strong> {expense.description}
              </p>
              <p>
                <strong>Valor:</strong> {formatMoney(expense.value)}
              </p>
              <p>
                <strong>Fecha:</strong> {formatedDate}
              </p>
            </div>

            {/* Formulario para agregar detalle */}
            {/* Formulario para agregar detalle */}
            <form onSubmit={handleSubmit} className="my-3">
              <input type="hidden" name="expense_id" value={expense.id} />

              {/* grid-cols-1 para móvil, grid-cols-2 en sm, y grid-cols-4 en lg */}
              <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <Field>
                  <Input
                    name="description"
                    placeholder="Descripción"
                    required
                    className="w-full"
                  />
                </Field>

                <Field>
                  <Input
                    name="value"
                    type="number"
                    step="0.01"
                    placeholder="Monto"
                    required
                    className="w-full"
                  />
                </Field>

                <Field>
                  <Select items={categorySelectItems} name="category_id">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categorías</SelectLabel>
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
                  <Button type="submit" className="w-full">
                    Guardar
                  </Button>
                </Field>
              </FieldGroup>
            </form>

            {errors.createDetail && (
              <ExpenseErrorDetail content={errors.createDetail} />
            )}

            {expense.detail.length > 0 && (
              <Table className="caption-top">
                <TableCaption>Detalle</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right lg:max-w-[30px]">
                      Opciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expense.detail.map((d: any) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.description}</TableCell>
                      <TableCell className="text-right">
                        {formatMoney(d.value)}
                      </TableCell>
                      <TableCell className="text-right max-w-[30px]">
                        {!d.is_auto_generated && (
                          <Button
                            variant="destructive"
                            onClick={() => onRemoveDetail(expense.id, d.id)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
