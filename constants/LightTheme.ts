import { FONT_FAMILIES } from "@/utils/constants";
import { Theme } from "@react-navigation/native";
import { Platform } from "react-native";

export const LightTheme: Theme = {
  dark: false,
  colors: {
    primary: "#007AFF",
    background: "#EDF1F5",
    card: "#FFFFFF",
    text: "#1C1C1E",
    border: "#D8D8D8",
    notification: "#FF3B30",
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
