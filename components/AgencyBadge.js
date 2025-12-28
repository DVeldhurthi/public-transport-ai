import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function AgencyBadge({ name }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#E5EDFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  text: { color: colors.primary, fontWeight: "600", fontSize: 12 },
});