export function ZodErrors({ error }: { error: string[] }) {
  if (!error) return null;
  return error.map((err: string, index: number) => (
    <div className="text-sm text-red-500 mt-1" key={index}>
      {err}
    </div>
  ));
}
