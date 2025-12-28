import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function Button({ label, onPress, variant = "primary" }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        variant === "secondary" && styles.secondary,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "secondary" && styles.secondaryText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondary: {
    backgroundColor: "#E5EDFF",
  },
  secondaryText: {
    color: colors.primary,
  },
});