import React, { useContext, useState, useEffect } from "react";
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from "../components/Card";
import { AlertsContext } from "../contexts/AlertsContext";
import { colors } from "../theme/colors";

export default function SafetyScreen() {
  const { addAlert, updateTraffic } = useContext(AlertsContext);
  const [anonymous, setAnonymous] = useState(true);
  const [myReports, setMyReports] = useState([]);

  // Load saved reports on mount
  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const reportsJson = await AsyncStorage.getItem('safety-reports');
      if (reportsJson) {
        setMyReports(JSON.parse(reportsJson));
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setMyReports([]);
    }
  }

  async function saveReport(report) {
    try {
      const updatedReports = [report, ...myReports].slice(0, 50); // Keep last 50 reports
      await AsyncStorage.setItem('safety-reports', JSON.stringify(updatedReports));
      setMyReports(updatedReports);
    } catch (error) {
      console.error('Error saving report:', error);
      Alert.alert('Error', 'Failed to save report');
    }
  }

  function handleReport(type) {
    const timestamp = new Date().toLocaleTimeString();
    const date = new Date().toLocaleDateString();

    const report = {
      id: Date.now().toString(),
      type: type,
      timestamp: timestamp,
      date: date,
      anonymous: anonymous,
    };

    // Save to storage
    saveReport(report);

    if (type === "delay") {
      addAlert({
        id: Date.now().toString(),
        agency: "User Report",
        message: `Service delay reported${anonymous ? " (anonymous)" : ""}`,
        severity: "yellow",
        time: timestamp,
      });
      Alert.alert(
        "✓ Report Submitted",
        "Your delay report has been recorded and added to the alert system.",
        [{ text: "OK" }]
      );
    } else if (type === "crowding") {
      updateTraffic("high");
      Alert.alert(
        "✓ Report Submitted",
        "Your crowding report has been recorded. System traffic level updated to HIGH.",
        [{ text: "OK" }]
      );
    } else if (type === "harassment") {
      Alert.alert(
        "✓ Report Submitted",
        `Your harassment report has been recorded${anonymous ? " anonymously" : ""}. This helps authorities track unsafe behavior patterns.`,
        [{ text: "OK" }]
      );
    } else if (type === "unsafe") {
      Alert.alert(
        "✓ Report Submitted",
        `Your unsafe area report has been recorded${anonymous ? " anonymously" : ""}. This will help improve safety in that location.`,
        [{ text: "OK" }]
      );
    }
  }

  function getReportIcon(type) {
    switch (type) {
      case "delay": return "time-outline";
      case "crowding": return "people-outline";
      case "harassment": return "warning-outline";
      case "unsafe": return "alert-circle-outline";
      default: return "document-outline";
    }
  }

  function getReportLabel(type) {
    switch (type) {
      case "delay": return "Service Delay";
      case "crowding": return "Crowding";
      case "harassment": return "Harassment";
      case "unsafe": return "Unsafe Area";
      default: return "Report";
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

      {/* My Reports Section */}
      {myReports.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>My Recent Reports</Text>
          <Card>
            {myReports.slice(0, 5).map((report, index) => (
              <View 
                key={report.id} 
                style={[
                  styles.reportItem,
                  index === myReports.slice(0, 5).length - 1 && styles.lastReportItem
                ]}
              >
                <Ionicons
                  name={getReportIcon(report.type)}
                  size={20}
                  color={colors.primary}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reportItemTitle}>
                    {getReportLabel(report.type)}
                  </Text>
                  <Text style={styles.reportItemTime}>
                    {report.date} at {report.timestamp}
                    {report.anonymous && " • Anonymous"}
                  </Text>
                </View>
              </View>
            ))}
            {myReports.length > 5 && (
              <Text style={styles.moreReportsText}>
                + {myReports.length - 5} more reports
              </Text>
            )}
          </Card>
        </>
      )}

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

  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastReportItem: {
    borderBottomWidth: 0,
  },
  reportItemTitle: {
    fontWeight: "600",
    fontSize: 14,
  },
  reportItemTime: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  moreReportsText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    marginTop: 8,
  },

  emergencyCard: { flexDirection: "row", gap: 10, marginTop: 16 },
  emergencyText: { fontSize: 13, color: colors.danger, flex: 1 },
});