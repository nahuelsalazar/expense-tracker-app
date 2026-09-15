export function ExpenseErrorDetail({ content }: { content: string }) {
  return (
    <p className="alert mt-2 text-sm font-medium text-destructive">
      Error en detalle: {content}
    </p>
  );
}
