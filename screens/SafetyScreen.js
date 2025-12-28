import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";
import { AlertsContext } from "../contexts/AlertsContext";
import { colors } from "../theme/colors";

export default function SafetyScreen() {
  const { addAlert, updateTraffic } = useContext(AlertsContext);
  const [anonymous, setAnonymous] = useState(true);

  function handleReport(type) {
    const timestamp = new Date().toLocaleTimeString();

    if (type === "delay") {
      addAlert({
        id: Date.now().toString(),
        agency: "User Report",
        message: `Service delay reported${anonymous ? " (anonymous)" : ""}`,
        severity: "yellow",
        time: timestamp,
      });
      Alert.alert("Report Submitted", "Delay alert added to system.");
    } else if (type === "crowding") {
      updateTraffic("high");
      Alert.alert(
        "Crowding Reported",
        "System traffic level updated to HIGH."
      );
    } else {
      Alert.alert(
        "Report Submitted",
        `${type} issue reported${anonymous ? " anonymously" : ""}.`
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="shield-checkmark"
          size={28}
          color={colors.primary}
        />
        <Text style={styles.title}>Safety Reports</Text>
        <Text style={styles.subtitle}>
          Report issues to help improve safety for everyone
        </Text>
      </View>

      {/* Privacy Notice */}
      <Card style={styles.noticeCard}>
        <Ionicons name="lock-closed" size={18} color={colors.primary} />
        <Text style={styles.noticeText}>
          Reports are confidential. Anonymous reporting is supported.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Report an Issue</Text>

      {/* Report Options */}
      <View style={styles.grid}>
        <ReportCard
          icon="time-outline"
          title="Service Delay"
          subtitle="Late or stopped service"
          onPress={() => handleReport("delay")}
        />
        <ReportCard
          icon="people-outline"
          title="Crowding"
          subtitle="Too crowded to board"
          onPress={() => handleReport("crowding")}
        />
        <ReportCard
          icon="warning-outline"
          title="Harassment"
          subtitle="Unsafe behavior"
          onPress={() => handleReport("harassment")}
        />
        <ReportCard
          icon="alert-circle-outline"
          title="Unsafe Area"
          subtitle="Poor lighting, hazards"
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
          If you are in immediate danger, call 911 or local authorities.
        </Text>
      </Card>
    </ScrollView>
  );
}

/* ---------- Sub Component ---------- */

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
  container: { flex: 1, padding: 16, backgroundColor: colors.background },

  header: { alignItems: "center", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "700", marginTop: 6 },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    marginTop: 4,
  },

  noticeCard: { flexDirection: "row", gap: 10, marginBottom: 16 },
  noticeText: { fontSize: 13, flex: 1 },

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
  reportTitle: { fontWeight: "700", marginTop: 8 },
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
  toggleText: { fontWeight: "600" },

  emergencyCard: { flexDirection: "row", gap: 10 },
  emergencyText: { fontSize: 13, color: colors.danger, flex: 1 },
});
