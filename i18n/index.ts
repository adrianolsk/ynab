import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./locales/en-CA/translation.json";
import translationPt from "./locales/pt-BR/translation.json";

const resources = {
  "pt-BR": { translation: translationPt },
  "en-CA": { translation: translationEn },
};

const initI18n = async () => {
  let savedLanguage = (await AsyncStorage.getItem("language")) ?? undefined;

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageCode ?? undefined;
  }

  //   i18n.use(initReactI18next).init({
  //     // compatibilityJSON: "v3",
  //     resources,
  //     lng: savedLanguage,
  //     fallbackLng: "pt-BR",
  //     interpolation: {
  //       escapeValue: false,
  //     },
  //   });

  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      // the translations
      // (tip move them in a JSON file and import them,
      // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
      resources,
      // : {
      //   en: {
      //     translation: {
      //       "Welcome to React": "Welcome to React and react-i18next"
      //     }
      //   }
      // },
      lng: savedLanguage,
      //   lng: "pt-BR", // if you're using a language detector, do not define the lng option
      fallbackLng: "en-CA",

      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });
};

initI18n();

export default i18n;
