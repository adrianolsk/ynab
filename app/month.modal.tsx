import { MonthModal } from "@/components/mont-modal";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Modal() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MonthModal
        onChange={function (month: string): void {
          router.dismissTo({
            pathname: "/(tabs)",
            params: {
              currentMonth: month,
            },
          });
        }}
        isVisible={false}
        onDismiss={function (): void {
          router.dismissTo("/(tabs)");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flex: 1,
    alignItems: "center",
    alignContent: "center",
  },
});
