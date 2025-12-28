import { View, Text, StyleSheet, Switch, Pressable, Alert } from "react-native";
import Card from "../components/Card";
import { useContext, useState } from "react";
import { colors } from "../theme/colors";
import { AlertsContext } from "../contexts/AlertsContext";

export default function SafetyScreen() {
  const { addAlert, updateTraffic } = useContext(AlertsContext);
  const [anonymous, setAnonymous] = useState(true);

  const handleReport = (type) => {
    if (type === "delay") {
      addAlert({
        id: Math.random().toString(),
        agency: "Student Report",
        message: "Delay reported by user" + (anonymous ? " (anonymous)" : ""),
        severity: "yellow",
        time: new Date().toLocaleTimeString(),
      });
      Alert.alert("Success", "Delay reported successfully!");
    } else if (type === "crowding") {
      updateTraffic("high");
      Alert.alert("Info", "System updated: High traffic / crowding.");
    } else {
      Alert.alert("Reported", `${type} issue reported${anonymous ? " anonymously" : ""}.`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report an Issue</Text>

      <View style={styles.buttonsRow}>
        {[
          { label: "⏱ Delay", type: "delay" },
          { label: "👥 Crowding", type: "crowding" },
          { label: "🚨 Harassment", type: "harassment" },
          { label: "⚠️ Unsafe", type: "unsafe" },
        ].map((btn) => (
          <Pressable
            key={btn.type}
            style={({ pressed }) => [
              styles.issueButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={() => handleReport(btn.type)}
          >
            <Text style={styles.issueText}>{btn.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Submit anonymously</Text>
        <Switch value={anonymous} onValueChange={setAnonymous} />
      </View>

      <Card style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "700" }}>Buddy Mode</Text>
        <Text>🟢 Trip not started</Text>
        <Text style={{ fontSize: 12, color: colors.muted, marginTop: 6 }}>
          Buddy mode shares your trip with trusted contacts only.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  buttonsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  issueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  issueText: { color: "#fff", fontWeight: "700" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  switchLabel: { fontWeight: "600" },
});