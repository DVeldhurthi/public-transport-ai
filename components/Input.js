import { TextInput, StyleSheet } from "react-native";

export default function Input(props) {
  return <TextInput {...props} style={[styles.input, props.style]} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
    fontSize: 16,
  },
});