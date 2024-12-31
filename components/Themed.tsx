/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from "react-native";
import { TextInput as DefaultTextInput } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import React from "react";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export const Text = React.forwardRef(function Text(props: TextProps, ref: any) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} ref={ref} />;
});

export const TextInput = (props: TextInputProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundContent = useThemeColor({}, "backgroundContent");
  const borderColor = useThemeColor({}, "borderColor");

  return (
    <DefaultTextInput
      placeholderTextColor={color}
      style={[
        {
          color,
          backgroundColor: backgroundContent,
          borderColor,
          borderRadius: 6,
        },
        style,
      ]}
      {...otherProps}
    />
  );
};

export function View(props: ViewProps) {
  const {
    style,
    // lightColor, darkColor,
    ...otherProps
  } = props;
  // const backgroundColor = useThemeColor(
  //   { light: lightColor, dark: darkColor },
  //   "background"
  // );

  return (
    <DefaultView
      style={[
        {
          //transparent by default
          // backgroundColor,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function ViewContent(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundContent"
  );

  return (
    <DefaultView
      style={[
        {
          backgroundColor,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
