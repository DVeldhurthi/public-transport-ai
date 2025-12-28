import { View, Text, StyleSheet, Switch } from "react-native";
import Card from "../components/Card";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../theme/colors";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile & Settings</Text>

      <SectionHeader title="Privacy Controls" />
      <Card>
        <Text>Location Sharing</Text>
        <Switch />
      </Card>
      <Card>
        <Text>Anonymous Reporting (default)</Text>
        <Switch />
      </Card>

      <SectionHeader title="Data Usage" />
      <Card>
        <Text style={{ fontSize: 12, color: colors.muted }}>
          BayRoute complies with student data protection standards. No data is sold. Only improves safety recommendations.
        </Text>
      </Card>

      <SectionHeader title="Display" />
      <Card>
        <Text>Light / Dark Mode</Text>
        <Switch />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
});