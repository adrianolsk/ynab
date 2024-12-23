import Decimal from "decimal.js";

export function formatCurrency(numericValue: number | null | undefined) {
  if (numericValue === null || numericValue === undefined) {
    return "";
  }
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
  return formattedValue;
}

export function parseCurrencyToDecimal(currency: string) {
  const numericString = currency?.replace(/[^\d-]/g, "");
  const parsed = parseFloat(numericString);
  if (Number.isNaN(parsed)) return 0;

  const value = new Decimal(numericString).dividedBy(100);

  return value.toNumber();
}
