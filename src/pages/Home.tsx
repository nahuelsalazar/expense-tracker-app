import { useCallback, useState } from "react";
import { useExpense } from "../hooks/useExpense";
import { ExpenseDetailModal } from "../components/expenses/ExpenseDetailModal";
import { toast } from "@/components/ui/toast";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { CreateExpenseDto } from "shared/interfaces/expense.interface";
import { ExpenseChart } from "@/components/expenses/ExpenseChart";
import { ExpenseGrid } from "@/components/expenses/ExpenseGrid";

export default function HomePage() {
  const currentYear = new Date().getFullYear().toString();
  const [month, setMonth] = useState<string | null>("");
  const [year, setYear] = useState<string>(currentYear);

  const {
    expenses,
    createExpenseDetail,
    removeExpense,
    removeExpenseDetail,
    getOneExpense,
    selectedExpense,
    clearSelectedExpense,
    loadExpenses,
    summaryData,
    getSummaryByCategories,
    createExpense,
  } = useExpense();

  const refreshCurrentPeriod = useCallback(async () => {
    const currentYear = Number(year) || new Date().getFullYear();
    const currentMonth = Number(month) || new Date().getMonth() + 1;

    await loadExpenses(currentYear, currentMonth);
    await getSummaryByCategories(currentYear, currentMonth);
  }, [loadExpenses, getSummaryByCategories, year, month]);

  const handleCreateExpense = async (expense: CreateExpenseDto) => {
    const result = await createExpense(expense);

    if (result.success) {
      await refreshCurrentPeriod();
    }

    return result;
  };

  const handleDetail = useCallback(
    async (id: number) => {
      const result = await getOneExpense(id);

      if (!result.success) {
        toast.add({
          type: "error",
          description: result.globalError,
          priority: "high",
        });
      }
    },
    [getOneExpense],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      const result = await removeExpense(id);
      if (!result.success) {
        toast.add({
          type: "error",
          description: result.globalError,
          priority: "high",
        });

        return;
      }

      await refreshCurrentPeriod();
    },
    [removeExpense, refreshCurrentPeriod],
  );

  /**
   * Recarga la grilla y redibuja el grafico con los datos filtrados.
   */
  const handleSearch = useCallback(
    async (year: number, month: number) => {
      await loadExpenses(year, month);
      await getSummaryByCategories(year, month);
    },
    [loadExpenses, getSummaryByCategories],
  );

  return (
    <>
      <div className="min-h-screen bg-neutral-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-6 md:p-10 font-geist">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mis Gastos</h1>
              <p className="text-muted-foreground text-sm">
                Gestiona tus finanzas de manera simple.
              </p>
            </div>
          </header>

          {/* Top Grid: Formulario y Gráfico */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda: Formulario de carga */}
            <ExpenseForm onCreateExpense={handleCreateExpense} />
            {/* Columna Derecha: Gráfico Nivo */}
            <ExpenseChart data={summaryData} />
          </div>

          {/* Sección Inferior: Filtros y Tabla */}
          <ExpenseGrid
            expenses={expenses}
            year={year}
            month={month}
            onYearChange={setYear}
            onMonthChange={setMonth}
            onSearch={handleSearch}
            onDetail={handleDetail}
            onDelete={handleDelete}
          />
        </div>
      </div>
      <ExpenseDetailModal
        expense={selectedExpense}
        open={!!selectedExpense}
        onAddDetail={createExpenseDetail}
        onRemoveDetail={removeExpenseDetail}
        onOpenChange={(open) => {
          if (!open) {
            clearSelectedExpense();
            refreshCurrentPeriod();
          }
        }}
      />
    </>
  );
}
