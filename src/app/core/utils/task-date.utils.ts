// dueDate se almacena como 'YYYY-MM-DD' (formato nativo del input date de Signal Forms),
// por lo que comparar como string funciona correctamente sin problemas de timezone.

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isOverdue(dueDate: string | null): boolean {
  return dueDate !== null && dueDate < todayIsoDate();
}

export function isDueToday(dueDate: string | null): boolean {
  return dueDate !== null && dueDate === todayIsoDate();
}

export function isUpcoming(dueDate: string | null): boolean {
  return dueDate !== null && dueDate > todayIsoDate();
}