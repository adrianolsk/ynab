import { ptBR, enCA } from "date-fns/locale";
import { format, Locale } from "date-fns";
import i18n from "@/i18n";

const dateFnsLocales: Record<string, Locale> = {
  enCA,
  ptBR,
} as const;

export const formatWithLocale = (
  date: string | number | Date,
  formatString: string
) => {
  const locale = dateFnsLocales[i18n.language] || enCA; // Fallback to `enUS` if not found
  return format(date, formatString, { locale: locale });
};
