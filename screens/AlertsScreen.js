import { FlatList, View, StyleSheet } from "react-native";
import { useContext } from "react";
import AlertCard from "../components/AlertCard";
import SectionHeader from "../components/SectionHeader";
import { AlertsContext } from "../contexts/AlertsContext";

export default function AlertsScreen() {
  const { alerts } = useContext(AlertsContext);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <SectionHeader title="Live Alerts" />
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AlertCard alert={item} />}
      />
    </View>
  );
}