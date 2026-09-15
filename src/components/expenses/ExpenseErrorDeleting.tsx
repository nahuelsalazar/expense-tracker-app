export function ExpenseErrorDeleting({ content }: { content: string }) {
  return (
    <p className="alert mt-2 text-sm font-medium text-destructive">
      No se pudo eliminar: {content}
    </p>
  );
}
