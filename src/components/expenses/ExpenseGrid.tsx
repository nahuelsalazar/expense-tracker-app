import { Trash2, Eye, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate, getMonths } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Expense } from "shared/interfaces/expense.interface";

interface ExpenseGridProps {
  expenses: Expense[];
  year: string;
  month: string | null;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string | null) => void;
  onSearch: (year: number, month: number) => Promise<void>;
  onDetail: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const months = getMonths();

export function ExpenseGrid({
  expenses,
  year,
  month,
  onYearChange,
  onMonthChange,
  onSearch,
  onDetail,
  onDelete,
}: ExpenseGridProps) {
  const search = async () => {
    if (!month) return;
    await onSearch(Number(year), Number(month));
  };

  return (
    <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <CardTitle className="text-lg">Historial de Transacciones</CardTitle>
          <CardDescription>Tus movimientos recientes</CardDescription>
        </div>

        {/* Filtros reubicados en la cabecera de la tabla */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-zinc-500 mr-1" />
          <Input
            className="w-[120px]"
            name="year"
            type="number"
            placeholder="Año"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            required
          />
          <Select items={months} value={month} onValueChange={onMonthChange}>
            <SelectTrigger className="w-[120px] focus:ring-zinc-900">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
              {/* ... */}
            </SelectContent>
          </Select>
          <Button
            className="bg-zinc-900 hover:bg-zinc-700 text-white"
            onClick={search}
          >
            <Search />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
              <TableHead className="font-semibold text-zinc-900 dark:text-zinc-100">
                Descripción
              </TableHead>
              <TableHead className="font-semibold text-zinc-900 dark:text-zinc-100">
                Fecha
              </TableHead>
              <TableHead className="font-semibold text-right text-zinc-900 dark:text-zinc-100">
                Valor
              </TableHead>
              <TableHead className="text-right font-semibold text-zinc-900 dark:text-zinc-100">
                Opciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Fila de ejemplo */}
            {expenses.map((e) => (
              <TableRow
                key={e.id}
                className="border-zinc-100 dark:border-zinc-800/50"
              >
                <TableCell className="font-medium">{e.description}</TableCell>
                <TableCell className="text-zinc-500">
                  {formatDate(e.expense_date)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  $ {e.value}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                      onClick={() => onDetail(e.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(e.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
