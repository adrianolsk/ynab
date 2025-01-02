import { ptBR, enCA } from "date-fns/locale";
import { format, Locale, parse } from "date-fns";
import i18n from "@/i18n";

const dateFnsLocales: Record<string, Locale> = {
  enCA,
  ptBR,
} as const;

export const formatWithLocale = (
  date: string | number | Date,
  formatString: string
) => {
  const locale = dateFnsLocales[i18n.language] || enCA;

  if (typeof date === "string") {
    const parsedDate = parse(date, "yyyy-MM", new Date());
    return format(parsedDate, formatString, { locale: locale });
  } else {
    return format(date, formatString, { locale: locale });
  }
};
