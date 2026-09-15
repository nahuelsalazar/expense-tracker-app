import { ResponsivePie } from "@nivo/pie";

export const ExpenseChart = ({ data }: { data: any[] }) => {
  function toPieData(items: { name: string; value: number }[]) {
    return items.map((item) => ({
      id: item.name,
      label: item.name,
      value: item.value.toFixed(2),
    }));
  }

  return (
    <ResponsivePie /* or Pie for fixed dimensions */
      data={toPieData(data)}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.6}
      cornerRadius={2}
      activeOuterRadiusOffset={8}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={4}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
      legends={[]}
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
  );
};
