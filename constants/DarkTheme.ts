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
