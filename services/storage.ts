import AsyncStorage from "@react-native-async-storage/async-storage";

const getBudgetUuid = async () => {
  const budgetUuid = await AsyncStorage.getItem("budget_uuid");
  return budgetUuid;
};

const setBudgetUuid = async (budgetUuid: string) => {
  await AsyncStorage.setItem("budget_uuid", budgetUuid);
};

export { getBudgetUuid, setBudgetUuid };
