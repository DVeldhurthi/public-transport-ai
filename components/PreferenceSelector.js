import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const options = ["Fastest", "Safest", "Cheapest"];

export default function PreferenceSelector() {
  return (
    <View style={styles.row}>
      {options.map((opt) => (
        <Pressable key={opt} style={styles.pill}>
          <Text style={styles.text}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginVertical: 10 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#E5EDFF",
    borderRadius: 20,
    marginRight: 8,
  },
  text: {
    color: colors.primary,
    fontWeight: "600",
  },
});