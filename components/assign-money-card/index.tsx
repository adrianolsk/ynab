import { formatCurrency } from "@/utils/financials";
import { FontAwesome } from "@expo/vector-icons";
import { useMemo } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "@/components/Themed";

interface AssignMoneyCardProps {
  value: number;
}

type AssignType = "positive" | "assigned" | "negative";

export const AssignMoneyCard = ({ value }: AssignMoneyCardProps) => {
  const type = useMemo<AssignType>(() => {
    if (value > 0) {
      return "positive";
    } else if (value === 0) {
      return "assigned";
    } else {
      return "negative";
    }
  }, [value]);

  const formattedValue = formatCurrency(value);
  const cardStyle =
    value > 0
      ? styles.positive
      : value === 0
      ? styles.assigned
      : styles.negative;

  const onAssign = () => {
    alert("🍎 Assign");
  };
  const onFix = () => {
    alert("🍎 Fix");
  };

  if (type === "positive") {
    return <ReadyToAssign value={value} onPress={onAssign} />;
  }

  if (type === "negative") {
    return <OverAssigned value={value} onPress={onFix} />;
  }

  return <Assigned value={value} onPress={onAssign} />;
};

interface ReadyToAssignProps {
  value: number;
  onPress: () => void;
}

const ReadyToAssign = ({ value, onPress }: ReadyToAssignProps) => {
  const formattedValue = formatCurrency(value);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.container, styles.positive]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.money} lightColor="#FFF">
            {formattedValue}
          </Text>
          <Text style={styles.text} lightColor="#FFF">
            Ready to Assign
          </Text>
        </View>

        <View style={styles.positiveButton}>
          <Text style={styles.text} lightColor="#FFF">
            Assign Money
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const OverAssigned = ({ value, onPress }: ReadyToAssignProps) => {
  const formattedValue = formatCurrency(value);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.container, styles.negative]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.money} lightColor="#FFF">
            {formattedValue}
          </Text>
          <Text style={styles.text} lightColor="#FFF">
            You assigned more than you have
          </Text>
        </View>

        <View style={styles.negativeButton}>
          <Text style={styles.text} lightColor="#FFF">
            Let's fix that
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Assigned = ({ value, onPress }: ReadyToAssignProps) => {
  const formattedValue = formatCurrency(value);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.container, styles.assigned]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.text} lightColor="#FFF">
            All Money Assigned
          </Text>
        </View>

        <View style={styles.assignedButton}>
          <FontAwesome name="chevron-right" size={12} color="#ddd" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 6,
    padding: 16,
    overflow: "hidden",
    flexDirection: "row",
    marginVertical: 4,
  },
  text: {
    fontSize: 12,
  },
  money: {
    fontFamily: "NunitoSansBold",
  },
  positive: {
    backgroundColor: "#386B11",
  },
  positiveButton: {
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "#4D9119",
    borderRadius: 6,
    paddingHorizontal: 16,
  },
  negative: {
    backgroundColor: "#C72C1E",
  },
  negativeButton: {
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "#F14839",
    borderRadius: 6,
    paddingHorizontal: 16,
  },
  assigned: {
    backgroundColor: "#4B6278",
  },
  assignedButton: {
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "#4B6278",
    borderRadius: 6,
    paddingHorizontal: 16,
  },
});
