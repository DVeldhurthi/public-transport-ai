import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from "../components/Card";
import Button from "../components/Button";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import AgencyBadge from "../components/AgencyBadge";

const agencies = [
  { name: "BART", status: "On Time", color: colors.success },
  { name: "Muni", status: "Minor Delays", color: colors.warning },
  { name: "Caltrain", status: "Suspended", color: colors.danger },
];

export default function HomeScreen({ navigation }) {
  const [bookmarkedRoutes, setBookmarkedRoutes] = useState([]);

  useEffect(() => {
    // Load bookmarked routes when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadBookmarkedRoutes();
    });

    // Initial load
    loadBookmarkedRoutes();

    return unsubscribe;
  }, [navigation]);

  async function loadBookmarkedRoutes() {
    try {
      const bookmarksJson = await AsyncStorage.getItem('bookmarked-routes');
      if (bookmarksJson) {
        const bookmarks = JSON.parse(bookmarksJson);
        setBookmarkedRoutes(bookmarks);
        console.log('Loaded bookmarks:', bookmarks.length);
      } else {
        setBookmarkedRoutes([]);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setBookmarkedRoutes([]);
    }
  }

  async function handleRemoveBookmark(routeId) {
    try {
      console.log('Attempting to remove bookmark with ID:', routeId);
      console.log('Current bookmarks:', bookmarkedRoutes.map(r => r.id));
      
      // Filter out the route with the matching ID
      const updatedBookmarks = bookmarkedRoutes.filter(route => route.id !== routeId);
      
      console.log('Updated bookmarks count:', updatedBookmarks.length);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('bookmarked-routes', JSON.stringify(updatedBookmarks));
      
      // Update local state immediately
      setBookmarkedRoutes(updatedBookmarks);
      
      Alert.alert("✓ Removed", "Route has been removed from your favorites");
    } catch (error) {
      console.error('Error removing bookmark:', error);
      Alert.alert("Error", "Failed to remove bookmark. Please try again.");
    }
  }

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
      {bookmarkedRoutes.length === 0 ? (
        <Card>
          <Text style={{ color: colors.muted, textAlign: "center" }}>
            No bookmarked routes yet. Plan a route and bookmark it to see it here!
          </Text>
        </Card>
      ) : (
        bookmarkedRoutes.map((route) => (
          <Card key={route.id}>
            <View style={styles.routeHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>
                  {route.startLocation} → {route.destination}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                  {route.departureTime} • {route.preference}
                </Text>
              </View>
              <Pressable 
                onPress={() => handleRemoveBookmark(route.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </Pressable>
            </View>

            <View style={{ flexDirection: "row", marginTop: 8, marginBottom: 8, flexWrap: "wrap" }}>
              {route.agencies.map((a) => <AgencyBadge key={a} name={a} />)}
            </View>

            <View style={styles.routeDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color={colors.muted} />
                <Text style={styles.detailText}>{route.duration}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="swap-horizontal-outline" size={16} color={colors.muted} />
                <Text style={styles.detailText}>{route.transfers} transfer(s)</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
                <Text style={[styles.detailText, { color: colors.success }]}>
                  {route.reliability}
                </Text>
              </View>
            </View>

            <Button label="View on Map" onPress={() => {}} />
          </Card>
        ))
      )}

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
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  deleteButton: {
    padding: 4,
  },
  routeDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.muted,
  },
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