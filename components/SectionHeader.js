import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function SectionHeader({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 24, marginBottom: 8 },
  text: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.muted,
    letterSpacing: 0.5,
  },
});