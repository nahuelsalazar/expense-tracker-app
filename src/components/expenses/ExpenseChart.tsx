import { ResponsivePie } from "@nivo/pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export function ExpenseChart({ data }: { data: any }) {
  function toPieData(items: { name: string; value: number }[]) {
    return items.map((item) => ({
      id: item.name,
      label: item.name,
      value: item.value.toFixed(2),
    }));
  }
  return (
    <Card className="lg:col-span-2 shadow-sm border-zinc-200 dark:border-zinc-800 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Resumen de Categorías</CardTitle>
        <CardDescription>Distribución de tus gastos este mes</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        {/* Gráfico monocromático usando la paleta de Tailwind Neutrals */}
        <ResponsivePie
          data={toPieData(data)}
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
          arcLabelsTextColor={(datum) => getContrastTextColor(datum.color)}
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
  );
}
