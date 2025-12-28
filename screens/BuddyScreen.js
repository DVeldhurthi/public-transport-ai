import { View, Text, StyleSheet } from "react-native";
import Card from "../components/Card";
import { colors } from "../theme/colors";

export default function BuddyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buddy Mode</Text>

      <Card>
        <Text style={{ fontWeight: "700" }}>Trip Status</Text>
        <Text>🟢 Trip not started</Text>
        <Text style={{ fontSize: 12, color: colors.muted, marginTop: 6 }}>
          Buddy mode shares trip status only with approved contacts.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  status: { marginTop: 8, color: "#64748B" },
});