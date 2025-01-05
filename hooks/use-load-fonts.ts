import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";

export const useLoadFonts = () => {
  const [loaded, error] = useFonts({
    // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    // LatoBlack: require("../assets/fonts/Lato-Black.ttf"),
    // LatoBold: require("../assets/fonts/Lato-Bold.ttf"),
    // LatoRegular: require("../assets/fonts/Lato-Regular.ttf"),
    // LatoThin: require("../assets/fonts/Lato-Thin.ttf"),
    // Light: require("../assets/fonts/Lato-Light.ttf"),
    // NunitoSansBold: require("../assets/fonts/NunitoSans-Bold.ttf"),
    // NunitoSansRegular: require("../assets/fonts/NunitoSans-Regular.ttf"),
    // NunitoSansSemiBold: require("../assets/fonts/NunitoSans-SemiBold.ttf"),
    // NunitoSansMedium: require("../assets/fonts/NunitoSans-Medium.ttf"),
    // NunitoSansLight: require("../assets/fonts/NunitoSans-Light.ttf"),
    // NunitoSans: require("../assets/fonts/NunitoSans.ttf"),
    FigtreeBlack: require("../assets/fonts/Figtree-Black.ttf"),
    FigtreeBold: require("../assets/fonts/Figtree-Bold.ttf"),
    FigtreeExtraBold: require("../assets/fonts/Figtree-ExtraBold.ttf"),
    FigtreeLight: require("../assets/fonts/Figtree-Light.ttf"),
    FigtreeMedium: require("../assets/fonts/Figtree-Medium.ttf"),
    FigtreeRegular: require("../assets/fonts/Figtree-Regular.ttf"),
    FigtreeSemiBold: require("../assets/fonts/Figtree-SemiBold.ttf"),

    ...FontAwesome.font,
  });
  return { loaded, error };
};
