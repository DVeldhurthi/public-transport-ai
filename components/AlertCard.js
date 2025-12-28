import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function AlertCard({ alert }) {
  const color =
    alert.severity === "red"
      ? colors.danger
      : alert.severity === "yellow"
      ? colors.warning
      : colors.success;

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.row}>
        <Ionicons name="alert-circle-outline" size={20} color={color} />
        <Text style={styles.title}>{alert.agency}</Text>
      </View>

      <Text>{alert.message}</Text>

      <Text style={styles.time}>Updated {alert.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 6,
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  title: { fontWeight: "700", marginLeft: 6 },
  time: { fontSize: 12, color: colors.muted, marginTop: 4 },
});