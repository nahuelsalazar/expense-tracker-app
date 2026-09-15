import { useState } from "react";
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

export function ExpenseSearch({
  handleSearch,
}: {
  handleSearch: (year?: number, month?: number) => void;
}) {
  const currentYear = new Date().getFullYear().toString();
  const [month, setMonth] = useState<string | null>("");
  const [year, setYear] = useState<string>(currentYear);

  const months = [
    { label: "Seleccionar mes", value: "" },
    { label: "Enero", value: "01" },
    { label: "Febrero", value: "02" },
    { label: "Marzo", value: "03" },
    { label: "Abril", value: "04" },
    { label: "Mayo", value: "05" },
    { label: "Junio", value: "06" },
    { label: "Julio", value: "07" },
    { label: "Agosto", value: "08" },
    { label: "Septiembre", value: "09" },
    { label: "Octubre", value: "10" },
    { label: "Noviembre", value: "11" },
    { label: "Diciembre", value: "12" },
  ];

  const search = () => {
    if (!year || !month) return;
    handleSearch(Number(year), Number(month));
  };

  const clear = () => {
    setYear(currentYear);
    setMonth("");
    handleSearch();
  };

  return (
    <form className="my-3">
      <FieldGroup className="grid max-w-3xl grid-cols-4">
        <Field>
          <Input
            name="year"
            type="number"
            placeholder="Año"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </Field>

        <Field>
          <Select items={months} value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Meses</SelectLabel>

                {months.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <Button type="button" variant="secondary" onClick={clear}>
            Limpiar
          </Button>
        </Field>

        <Field>
          <Button type="button" onClick={search}>
            Buscar
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
