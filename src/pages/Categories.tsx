import { useState } from "react";
import { useCategory } from "@/hooks/useCategory";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { toast } from "@/components/ui/toast";

function CategoriesPage() {
  const { createCategory, categories, removeCategory } = useCategory();
  const [category, setCategory] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async () => {
    const result = await createCategory({ category });

    if (result.success) {
      setFieldErrors({});
      setCategory("");
    } else {
      setFieldErrors(result.fieldErrors);
      toast.add({
        type: "error",
        description: result.globalError,
        priority: "high",
      });
    }
  };

  const onDelete = async (categoryId: number) => {
    const result = await removeCategory(categoryId);
    if (!result.success) {
      toast.add({
        type: "error",
        description: result.globalError,
        priority: "high",
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-6 md:p-10 font-geist">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-6">
          <form className="w-[250px]  flex flex-col gap-2">
            <Field>
              <FieldLabel htmlFor="category">Categoría</FieldLabel>
              <Input
                id="category"
                type="text"
                placeholder="Ingresa la categoría"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              {fieldErrors.category && (
                <FieldError>{fieldErrors.category[0]}</FieldError>
              )}
            </Field>
            <Field>
              <Button type="button" onClick={handleSubmit}>
                Guardar
              </Button>
            </Field>
          </form>
          <div className="flex w-full max-w-md flex-col gap-2">
            {categories.map((c) => (
              <Item variant="outline" key={c.id}>
                <ItemContent>
                  <ItemTitle>{c.category}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(c.id)}
                  >
                    Eliminar
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
