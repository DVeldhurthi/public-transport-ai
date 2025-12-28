import { View, Text, StyleSheet, Switch, ScrollView, Pressable } from "react-native";
import Card from "../components/Card";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../theme/colors";

export default function BuddyScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Buddy Mode</Text>

      {/* Trip Status */}
      <SectionHeader title="Trip Status" />
      <Card>
        <Text style={{ fontWeight: "700", marginBottom: 6 }}>Current Trip</Text>
        <Text>🟢 Trip not started</Text>
        <Text style={styles.subText}>
          Buddy Mode shares live trip updates with trusted contacts once a trip begins.
        </Text>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Start Buddy Trip</Text>
        </Pressable>
      </Card>

      {/* Location Sharing */}
      <SectionHeader title="Live Safety Features" />
      <Card>
        <View style={styles.row}>
          <Text style={styles.rowTitle}>Live Location Sharing</Text>
          <Switch />
        </View>
        <Text style={styles.subText}>
          Share your real-time location with approved contacts during trips.
        </Text>

        <View style={styles.row}>
          <Text style={styles.rowTitle}>Automatic Arrival Check</Text>
          <Switch />
        </View>
        <Text style={styles.subText}>
          Sends an alert if you don’t arrive at your destination on time.
        </Text>
      </Card>

      {/* Emergency Tools */}
      <SectionHeader title="Emergency Tools" />
      <Card>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>Quick Actions</Text>

        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>🚨 Send Emergency Alert</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>📍 Share Current Location</Text>
        </Pressable>

        <Text style={styles.subText}>
          Emergency alerts immediately notify trusted contacts and flag nearby safety concerns.
        </Text>
      </Card>

      {/* Trusted Contacts */}
      <SectionHeader title="Trusted Contacts" />
      <Card>
        <Text style={{ fontWeight: "700" }}>Who can see your trip</Text>
        <Text style={styles.subText}>
          Add friends or family who can monitor your route and receive alerts.
        </Text>

        <Pressable style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>+ Add Trusted Contact</Text>
        </Pressable>
      </Card>

      {/* Safety Info */}
      <SectionHeader title="Privacy & Safety" />
      <Card>
        <Text style={styles.infoText}>
          • Location data is only shared during active trips  
        </Text>
        <Text style={styles.infoText}>
          • Trip data is automatically deleted after 7 days  
        </Text>
        <Text style={styles.infoText}>
          • You can disable Buddy Mode anytime
        </Text>
      </Card>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  subText: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  rowTitle: {
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  secondaryButtonText: {
    fontWeight: "600",
  },
  outlineButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  outlineButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
});
