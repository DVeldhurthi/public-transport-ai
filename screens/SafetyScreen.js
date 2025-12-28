import { View, Text, StyleSheet, Pressable, Switch, Alert } from "react-native";
import Card from "../components/Card";
import { useContext, useState } from "react";
import { colors } from "../theme/colors";
import { AlertsContext } from "../contexts/AlertsContext";
import { Ionicons } from "@expo/vector-icons";

export default function SafetyScreen() {
  const { addAlert, updateTraffic } = useContext(AlertsContext);
  const [anonymous, setAnonymous] = useState(true);

  const handleReport = (type) => {
    if (type === "delay") {
      addAlert({
        id: Math.random().toString(),
        agency: "User Report",
        message: `Service delay reported${anonymous ? " (anonymous)" : ""}`,
        severity: "yellow",
        time: new Date().toLocaleTimeString(),
      });
      Alert.alert("Report Submitted", "Delay has been reported.");
    } else if (type === "crowding") {
      updateTraffic("high");
      Alert.alert("System Updated", "High crowding reported.");
    } else {
      Alert.alert(
        "Report Submitted",
        `${type} issue reported${anonymous ? " anonymously" : ""}.`
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
        <Text style={styles.title}>Safety Reports</Text>
        <Text style={styles.subtitle}>
          Help keep our community safe by reporting issues
        </Text>
      </View>

      {/* Privacy Banner */}
      <Card style={styles.privacyCard}>
        <Ionicons name="lock-closed" size={18} color={colors.primary} />
        <Text style={styles.privacyText}>
          All reports are confidential. You may submit anonymously.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>What would you like to report?</Text>

      {/* Report Grid */}
      <View style={styles.grid}>
        <ReportCard
          icon="time-outline"
          title="Service Delay"
          subtitle="Unexpected delays or schedule issues"
          onPress={() => handleReport("delay")}
        />
        <ReportCard
          icon="people-outline"
          title="Overcrowding"
          subtitle="Crowded vehicles or stations"
          onPress={() => handleReport("crowding")}
        />
        <ReportCard
          icon="warning-outline"
          title="Harassment"
          subtitle="Inappropriate behavior"
          onPress={() => handleReport("harassment")}
        />
        <ReportCard
          icon="shield-outline"
          title="Safety Concern"
          subtitle="Unsafe conditions"
          onPress={() => handleReport("unsafe")}
        />
      </View>

      {/* Anonymous Toggle */}
      <Card style={styles.toggleCard}>
        <Text style={styles.toggleText}>Submit Anonymously</Text>
        <Switch value={anonymous} onValueChange={setAnonymous} />
      </Card>

      {/* Emergency Notice */}
      <Card style={styles.emergencyCard}>
        <Ionicons name="alert" size={18} color={colors.danger} />
        <Text style={styles.emergencyText}>
          Emergency situations require immediate help. Call 911 if you are in
          danger.
        </Text>
      </Card>
    </View>
  );
}

/* ---------- Components ---------- */

function ReportCard({ icon, title, subtitle, onPress }) {
  return (
    <Pressable style={styles.reportCard} onPress={onPress}>
      <Ionicons name={icon} size={26} color={colors.primary} />
      <Text style={styles.reportTitle}>{title}</Text>
      <Text style={styles.reportSub}>{subtitle}</Text>
    </Pressable>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },

  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    marginTop: 4,
  },

  privacyCard: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  privacyText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },

  reportCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  reportTitle: {
    fontWeight: "700",
    marginTop: 8,
  },
  reportSub: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    marginTop: 4,
  },

  toggleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleText: {
    fontWeight: "600",
  },

  emergencyCard: {
    flexDirection: "row",
    gap: 10,
  },
  emergencyText: {
    fontSize: 13,
    color: colors.danger,
    flex: 1,
  },
});
