import { useState } from "react";
import { useCategory } from "@/hooks/useCategory";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
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
  const [error, setError] = useState<string | undefined>("");

  const validate = () => {
    if (category.length < 4) {
      return "La categoria debe tener como minimo 4 caracteres";
    }

    return null;
  };

  const handleSubmit = async () => {
    const validation = validate();

    if (validation) {
      setError(validation);
      return null;
    }

    const result = await createCategory({ category });
    if (!result.success) {
      setError(result.error);
      return;
    }

    setError("");
    setCategory("");
  };

  const onDelete = async (categoryId: number) => {
    const result = await removeCategory(categoryId);
    console.log(result);
    if (!result.success) {
      toast.add({
        type: "error",
        description: result.error,
        priority: "high",
      });
    }
  };

  return (
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
        </Field>
        <Field>
          <Button type="button" onClick={handleSubmit}>
            Guardar
          </Button>
        </Field>
        {error && <p className="text-red-500">{error}</p>}
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
  );
}

export default CategoriesPage;
