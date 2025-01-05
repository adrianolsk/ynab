import { FONT_FAMILIES } from "@/utils/constants";
import { Theme } from "@react-navigation/native";
import { Platform } from "react-native";

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: "#0A84FF",
    background: "#04070B",
    card: "#0C1722",
    text: "#E5E5E7",
    border: "#272729",
    notification: "#FF453A",
  },
  fonts: Platform.select({
    ios: {
      regular: {
        fontFamily: FONT_FAMILIES.Regular,
        fontWeight: "400",
      },
      medium: {
        fontFamily: FONT_FAMILIES.Medium,
        fontWeight: "500",
      },
      bold: {
        fontFamily: FONT_FAMILIES.Bold,
        fontWeight: "600",
      },
      heavy: {
        fontFamily: FONT_FAMILIES.Bold,
        fontWeight: "700",
      },
    },
    default: {
      regular: {
        fontFamily: FONT_FAMILIES.Regular,
        fontWeight: "400",
      },
      medium: {
        fontFamily: FONT_FAMILIES.Medium,
        fontWeight: "500",
      },
      bold: {
        fontFamily: FONT_FAMILIES.Bold,
        fontWeight: "600",
      },
      heavy: {
        fontFamily: FONT_FAMILIES.Bold,
        fontWeight: "700",
      },
    },
  }),
};
