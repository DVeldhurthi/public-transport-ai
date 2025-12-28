import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../theme/colors";

export default function ProfileScreen() {
  const [locationSharing, setLocationSharing] = useState(false);
  const [anonymousReporting, setAnonymousReporting] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle" size={72} color={colors.primary} />
        <Text style={styles.name}>Guest User</Text>
        <Text style={styles.sub}>
          Sign in to sync preferences across devices
        </Text>
      </View>

      {/* Account */}
      <SectionHeader title="Account" />
      <Card>
        <Text style={styles.cardTitle}>Sign in with Google</Text>
        <Text style={styles.cardSub}>
          Save routes, safety settings, and trusted contacts.
        </Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            Alert.alert("Sign In", "Authentication coming soon")
          }
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </Pressable>
      </Card>

      {/* Privacy */}
      <SectionHeader title="Privacy & Safety" />
      <Card>
        <SettingRow
          icon="location-outline"
          title="Location Sharing"
          subtitle="Enable Buddy Mode trip sharing"
          value={locationSharing}
          onToggle={setLocationSharing}
        />
        <SettingRow
          icon="eye-off-outline"
          title="Anonymous Reporting"
          subtitle="Hide identity when reporting issues"
          value={anonymousReporting}
          onToggle={setAnonymousReporting}
        />
      </Card>

      {/* Display */}
      <SectionHeader title="Display" />
      <Card>
        <SettingRow
          icon="moon-outline"
          title="Dark Mode"
          subtitle="Reduce brightness in low light"
          value={darkMode}
          onToggle={setDarkMode}
        />
      </Card>

      {/* Data */}
      <SectionHeader title="Data & Privacy" />
      <Card>
        <InfoRow text="No personal data is sold or shared." />
        <InfoRow text="Location is only used when Buddy Mode is enabled." />
      </Card>

      {/* About */}
      <SectionHeader title="About BayRoute" />
      <Card>
        <LinkRow title="About" />
        <LinkRow title="Privacy Policy" />
        <LinkRow title="Terms of Service" />
        <LinkRow title="Help & Support" />
      </Card>

      <Text style={styles.version}>BayRoute v1.0.0</Text>
    </ScrollView>
  );
}

/* ---------- Sub Components ---------- */

function SettingRow({ icon, title, subtitle, value, onToggle }) {
  return (
    <View style={styles.settingRow}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSub}>{subtitle}</Text>
      </View>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
}

function InfoRow({ text }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name="shield-checkmark"
        size={18}
        color={colors.primary}
      />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function LinkRow({ title }) {
  return (
    <Pressable style={styles.linkRow}>
      <Text>{title}</Text>
      <Ionicons name="chevron-forward" color={colors.muted} />
    </Pressable>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },

  header: { alignItems: "center", marginBottom: 16 },
  name: { fontSize: 20, fontWeight: "700" },
  sub: { fontSize: 13, color: colors.muted },

  cardTitle: { fontWeight: "700", fontSize: 16 },
  cardSub: { fontSize: 13, color: colors.muted, marginVertical: 6 },

  primaryButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 10,
  },
  settingTitle: { fontWeight: "600" },
  settingSub: { fontSize: 12, color: colors.muted },

  infoRow: { flexDirection: "row", gap: 10, marginVertical: 6 },
  infoText: { fontSize: 13, flex: 1 },

  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  version: {
    textAlign: "center",
    color: colors.muted,
    marginVertical: 16,
  },
});


