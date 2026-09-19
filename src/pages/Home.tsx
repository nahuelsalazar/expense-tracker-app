import { ResponsivePie } from "@nivo/pie";
import { Trash2, Eye, Plus, Filter } from "lucide-react";

// Importaciones simuladas de shadcn/ui (asumiendo que están en tu alias @/components/ui)
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useState } from "react";
import { useCategory } from "../hooks/useCategory";
import { formatDate, getSelectItems } from "../lib/utils";
import { useExpense } from "../hooks/useExpense";
import { ExpenseError } from "../interfaces/expense.interface";
import { ExpenseDetailModal } from "../components/expenses/ExpenseDetailModal";

// Datos de prueba para el gráfico de Nivo
const mockData = [
  { id: "Comida", label: "Comida", value: 450 },
  { id: "Transporte", label: "Transporte", value: 150 },
  { id: "Servicios", label: "Servicios", value: 300 },
  { id: "Ocio", label: "Ocio", value: 200 },
];

const DEFAULTS = {
  category_id: null,
  value: "",
  description: "",
  expense_date: "",
};

const zincPalette = [
  "#18181b", // zinc-900 (Oscuro)
  "#d4d4d8", // zinc-300 (Gris claro)
  "#3f3f46", // zinc-700 (Medio-oscuro)
  "#f4f4f5", // zinc-100 (Muy claro)
  "#09090b", // zinc-950 (Muy oscuro)
  "#a1a1aa", // zinc-400 (Gris claro-medio)
  "#27272a", // zinc-800 (Gris muy oscuro)
  "#e4e4e7", // zinc-200 (Gris claro)
  "#52525b", // zinc-600 (Gris medio)
  "#fafafa", // zinc-50 (Ultra claro/blanco)
  "#71717a", // zinc-500 (Gris medio)
  "#09090b", // zinc-950 (Repetido intencionalmente para la 12a rebanada)
];

const getContrastTextColor = (hexColor: string) => {
  // Eliminamos el '#' si existe
  const cleanHex = hexColor.replace("#", "");

  // Convertimos a valores RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Ecuación estándar para la percepción humana del brillo
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Si el brillo es mayor a 128, el fondo es claro (usamos texto oscuro)
  // Si es menor, el fondo es oscuro (usamos texto blanco)
  return brightness > 128 ? "#18181b" : "#ffffff";
};

export default function HomePage() {
  const [categoryId, setCategoryId] = useState<number | null>(
    DEFAULTS.category_id,
  );
  const [expenseValue, setExpenseValue] = useState("");
  const [expenseDate, setExpenseDate] = useState(DEFAULTS.expense_date);
  const [expenseDesc, setExpenseDesc] = useState(DEFAULTS.description);

  const { categories } = useCategory();
  const categorySelectItems = getSelectItems(categories, "category", "id");

  const [error, setError] = useState<string | undefined>("");
  const [errors, setErrors] = useState<ExpenseError>({});
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
    summaryData,
    getSummaryByCategories,
  } = useExpense();

  const handleSubmit = async () => {
    const expense = {
      description: expenseDesc,
      value: Number(expenseValue),
      expense_date: expenseDate,
      category_id: categoryId,
    };

    const result = await createExpense(expense);

    if (!result.success) {
      setError(result.error);
      return;
    }

    resetForm();
    setError(undefined);
  };

  const resetForm = () => {
    setCategoryId(DEFAULTS.category_id);
    setExpenseDate(DEFAULTS.expense_date);
    setExpenseDesc(DEFAULTS.description);
    setExpenseValue(DEFAULTS.value);
  };

  const handleDetail = useCallback(
    async (id: number) => {
      const result = await getOneExpense(id);

      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          detail: result.error,
        }));
      }
    },
    [getOneExpense],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      const result = await removeExpense(id);
      if (!result.success) {
        setErrors((prev) => ({ ...prev, delete: result.error }));
      }
    },
    [removeExpense],
  );

  function toPieData(items: { name: string; value: number }[]) {
    return items.map((item) => ({
      id: item.name,
      label: item.name,
      value: item.value.toFixed(2),
    }));
  }

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
            {/* Columna Izquierda: Formulario */}
            <Card className="lg:col-span-1 shadow-sm border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">Nuevo Gasto</CardTitle>
                <CardDescription>
                  Registra una nueva transacción
                </CardDescription>
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
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Gasto
                </Button>
              </CardContent>
            </Card>

            {/* Columna Derecha: Gráfico Nivo */}
            <Card className="lg:col-span-2 shadow-sm border-zinc-200 dark:border-zinc-800 flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Categorías</CardTitle>
                <CardDescription>
                  Distribución de tus gastos este mes
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-[300px]">
                {/* Gráfico monocromático usando la paleta de Tailwind Neutrals */}
                <ResponsivePie
                  data={toPieData(summaryData)}
                  margin={{ top: 20, right: 80, bottom: 40, left: 80 }}
                  innerRadius={0.6}
                  padAngle={1}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={zincPalette} // Paleta blanco/negro/gris
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  enableArcLinkLabels={true}
                  arcLinkLabelsColor="#71717a"
                  arcLinkLabelsThickness={2}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={(datum) =>
                    getContrastTextColor(datum.color)
                  }
                  theme={{
                    labels: {
                      text: {
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: "var(--font-sans)",
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sección Inferior: Filtros y Tabla */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="text-lg">
                  Historial de Transacciones
                </CardTitle>
                <CardDescription>Tus movimientos recientes</CardDescription>
              </div>

              {/* Filtros reubicados en la cabecera de la tabla */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-zinc-500 mr-1" />
                <Select>
                  <SelectTrigger className="w-[120px] focus:ring-zinc-900">
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[120px] focus:ring-zinc-900">
                    <SelectValue placeholder="Mes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Enero</SelectItem>
                    <SelectItem value="2">Febrero</SelectItem>
                    {/* ... */}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                    <TableHead className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Descripción
                    </TableHead>
                    {/* <TableHead className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Categoría
                  </TableHead> */}
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
                      <TableCell className="font-medium">
                        {e.description}
                      </TableCell>
                      {/* <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                        {e.category_id}
                      </span>
                    </TableCell> */}
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
                            onClick={() => handleDetail(e.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(e.id)}
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
            loadExpenses();
          }
        }}
      />
    </>
  );
}
