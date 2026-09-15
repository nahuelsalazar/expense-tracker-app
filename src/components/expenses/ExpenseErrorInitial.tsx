export function ExpenseErrorInitial({
  initialLoadError,
}: {
  initialLoadError: string;
}) {
  return (
    <p className="alert mt-2 text-sm font-medium text-destructive">
      {initialLoadError}
    </p>
  );
}
