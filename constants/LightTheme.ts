import { Theme } from "@react-navigation/native";
import { Platform } from "react-native";

export const LightTheme: Theme = {
  dark: false,
  colors: {
    primary: "#007AFF",
    background: "#F2F2F2",
    card: "#FFFFFF",
    text: "#1C1C1E",
    border: "#D8D8D8",
    notification: "#FF3B30",
  },
  fonts: Platform.select({
    ios: {
      regular: {
        // fontFamily: "System",
        fontFamily: "NunitoSansRegular",
        fontWeight: "400",
      },
      medium: {
        // fontFamily: "System",
        fontFamily: "NunitoSansMedium",
        fontWeight: "500",
      },
      bold: {
        // fontFamily: "System",
        fontFamily: "NunitoSansBold",
        fontWeight: "600",
      },
      heavy: {
        // fontFamily: "System",
        fontFamily: "NunitoSansBold",
        fontWeight: "700",
      },
    },
    default: {
      regular: {
        fontFamily: "NunitoSansRegular",
        fontWeight: "400",
      },
      medium: {
        fontFamily: "NunitoSansMedium",
        fontWeight: "500",
      },
      bold: {
        fontFamily: "NunitoSansBold",
        fontWeight: "600",
      },
      heavy: {
        fontFamily: "NunitoSansBold",
        fontWeight: "700",
      },
    },
  }),
};
