import { useExpense } from "../hooks/useExpense";
import { Button } from "@/components/ui/button";

import { ExpenseTable } from "../components/expenses/ExpenseTable";
import { ExpenseForm } from "../components/expenses/ExpenseForm";
import { ExpenseDetailModal } from "../components/expenses/ExpenseDetailModal";
import { ExpenseSearch } from "../components/expenses/ExpenseSearch";
import { AppTitle } from "../components/layout/AppTitle";
import { ExpenseErrorInitial } from "../components/expenses/ExpenseErrorInitial";
import { Separator } from "@/components/ui/separator";
import { ExpenseChart } from "@/components/expenses/ExpenseChart";

function HomePage() {
  const {
    expenses,
    createExpense,
    createExpenseDetail,
    removeExpense,
    removeExpenseDetail,
    getOneExpense,
    loadMockExpenses,
    initialLoadError,
    selectedExpense,
    clearSelectedExpense,
    loadExpenses,
    chartData,
    getSummaryByCategories,
  } = useExpense();

  return (
    <>
      <AppTitle />
      <div className="grid grid-cols-[60%_40%]">
        <div>
          {initialLoadError && (
            <ExpenseErrorInitial initialLoadError={initialLoadError} />
          )}

          <ExpenseForm onAddExpense={createExpense}></ExpenseForm>

          <Separator />

          <ExpenseSearch
            handleSearch={(year, month) => {
              loadExpenses(year, month);
              getSummaryByCategories(year, month);
            }}
          />

          {expenses.length === 0 && (
            <Button onClick={loadMockExpenses} className="my-3">
              Rellenar
            </Button>
          )}

          <ExpenseTable
            expenses={expenses}
            onRemove={removeExpense}
            onDetail={getOneExpense}
          />

          <ExpenseDetailModal
            expense={selectedExpense}
            open={!!selectedExpense}
            onAddDetail={createExpenseDetail}
            onRemoveDetail={removeExpenseDetail}
            onOpenChange={(open) => {
              if (!open) {
                clearSelectedExpense();
                loadExpenses();
              }
            }}
          />
        </div>
        <div>
          <ExpenseChart data={chartData} />
        </div>
      </div>
    </>
  );
}

export default HomePage;
