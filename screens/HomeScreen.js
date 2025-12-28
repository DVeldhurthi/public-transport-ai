import { View, Text, StyleSheet, ScrollView } from "react-native";
import Card from "../components/Card";
import Button from "../components/Button";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";

const agencies = [
  { name: "BART", status: "On Time", color: colors.success },
  { name: "Muni", status: "Minor Delays", color: colors.warning },
  { name: "Caltrain", status: "Suspended", color: colors.danger },
];

const favoriteRoutes = [
  { name: "Home → School", time: "7:30 AM", agency: "BART" },
  { name: "School → Practice", time: "4:00 PM", agency: "Muni" },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>BayRoute</Text>
      <Text style={styles.subtitle}>
        Smarter. Safer. Faster student commuting across the Bay Area.
      </Text>

      <Button label="Plan a Route" onPress={() => navigation.navigate("Plan Route")} />

      <SectionHeader title="TODAY'S TRANSIT STATUS" />
      <View style={styles.row}>
        {agencies.map((a) => (
          <Card key={a.name}>
            <Ionicons name="train-outline" size={24} color={a.color} />
            <Text style={styles.cardTitle}>{a.name}</Text>
            <Text style={{ color: a.color, fontWeight: "600" }}>{a.status}</Text>
          </Card>
        ))}
      </View>

      <SectionHeader title="FAVORITE ROUTES" />
      {favoriteRoutes.map((route) => (
        <Card key={route.name}>
          <Text style={styles.cardTitle}>{route.name}</Text>
          <Text>{route.time}</Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>{route.agency}</Text>
          <Button label="View on Map" onPress={() => {}} />
        </Card>
      ))}

      <SectionHeader title="TRAFFIC STATISTICS" />
      <Card>
        <Text style={{ fontSize: 12, color: colors.muted }}>Daily student commute traffic</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={{ color: colors.muted }}>📊 Chart goes here</Text>
        </View>
      </Card>

      <SectionHeader title="MAP PREVIEW" />
      <Card>
        <View style={styles.mapPlaceholder}>
          <Text style={{ color: colors.muted }}>🗺️ Mock Map Preview</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: colors.background },
  title: { fontSize: 32, fontWeight: "800" },
  subtitle: { color: colors.muted, marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  cardTitle: { fontWeight: "700", marginTop: 6 },
  mapPlaceholder: {
    height: 160,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  chartPlaceholder: {
    height: 120,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
});