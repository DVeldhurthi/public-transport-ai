import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../theme/colors";
import AgencyBadge from "../components/AgencyBadge";

const routes = [
  {
    id: "1",
    duration: "42 min",
    transfers: 1,
    agencies: ["BART", "Muni"],
    reliability: "High",
  },
  {
    id: "2",
    duration: "50 min",
    transfers: 0,
    agencies: ["Caltrain"],
    reliability: "Medium",
  },
];

export default function PlanRouteScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Plan Your Route</Text>

      <Input placeholder="Start location" />
      <Input placeholder="Destination" />
      <Input placeholder="Departure time" />

      <SectionHeader title="Route Preferences" />
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        {["Fastest", "Safest", "Cheapest"].map((opt) => (
          <Pressable key={opt} style={styles.pill}>
            <Text style={styles.pillText}>{opt}</Text>
          </Pressable>
        ))}
      </View>

      <Button label="Plan Route" onPress={() => {}} />

      <SectionHeader title="Route Options" />
      {routes.map((r) => (
        <Card key={r.id}>
          <Text style={styles.cardTitle}>{r.duration} • {r.transfers} transfer(s)</Text>
          <View style={{ flexDirection: "row", marginTop: 6 }}>
            {r.agencies.map((a) => <AgencyBadge key={a} name={a} />)}
          </View>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 6 }}>
            AI-generated recommendation (mock data)
          </Text>
          <Text style={{ color: colors.success, marginTop: 4 }}>Reliability: {r.reliability}</Text>
          <Button label="Bookmark Route" onPress={() => {}} />
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  cardTitle: { fontWeight: "700", marginBottom: 4 },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#E5EDFF",
    borderRadius: 20,
    marginRight: 8,
  },
  pillText: { color: colors.primary, fontWeight: "600" },
});