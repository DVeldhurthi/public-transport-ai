import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import SectionHeader from "../components/SectionHeader";
import { colors } from "../theme/colors";
import AgencyBadge from "../components/AgencyBadge";
import { getAiRoute } from "services/aiApi";

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

export default function PlanRouteScreen({ navigation }) {
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [selectedPreference, setSelectedPreference] = useState("Fastest");
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [bookmarkedRoutes, setBookmarkedRoutes] = useState([]);

  useEffect(() => {
    loadSavedRoutes();
    loadBookmarkedRoutes();
  }, []);

  // Reload bookmarks when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => {
      loadBookmarkedRoutes();
    });
    return unsubscribe;
  }, [navigation]);

  // Debug: Log state changes
  useEffect(() => {
    console.log('Start Location State:', startLocation);
  }, [startLocation]);

  useEffect(() => {
    console.log('Destination State:', destination);
  }, [destination]);

  async function loadSavedRoutes() {
    try {
      const routesJson = await AsyncStorage.getItem('saved-routes');
      if (routesJson) {
        setSavedRoutes(JSON.parse(routesJson));
      }
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  }

  async function loadBookmarkedRoutes() {
    try {
      const bookmarksJson = await AsyncStorage.getItem('bookmarked-routes');
      if (bookmarksJson) {
        setBookmarkedRoutes(JSON.parse(bookmarksJson));
      } else {
        setBookmarkedRoutes([]);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setBookmarkedRoutes([]);
    }
  }

  async function handlePlanRoute() {
    if (!startLocation || !destination) {
      Alert.alert("Missing Information", "Please enter both start location and destination");
      return;
    }

    try {
      const aiRoute = await getAiRoute({
        startLocation,
        destination,
        departureTime,
        preference: selectedPreference,
      });

      const newRoute = {
        id: Date.now().toString(),
        ...aiRoute,
        startLocation,
        destination,
        preference: selectedPreference,
        createdAt: new Date().toLocaleString(),
      };

      const updatedRoutes = [newRoute, ...savedRoutes].slice(0, 20);
      await AsyncStorage.setItem("saved-routes", JSON.stringify(updatedRoutes));
      setSavedRoutes(updatedRoutes);

      Alert.alert("✓ AI Route Planned", "Your AI-optimized route is ready!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "AI route planning failed");
    }
  }


  function isRouteBookmarked(routeId) {
    if (!startLocation || !destination) {
      return false;
    }
    
    return bookmarkedRoutes.some(r => {
      // Check if the same route with same locations exists
      return r.routeId === routeId && 
             r.startLocation === startLocation && 
             r.destination === destination;
    });
  }

  async function handleBookmarkRoute(route) {
    console.log('=== BOOKMARK ATTEMPT ===');
    console.log('Route ID:', route.id);
    console.log('Start Location:', startLocation);
    console.log('Destination:', destination);
    
    // If no locations entered, use placeholder text
    const start = startLocation.trim() || "Start Location";
    const dest = destination.trim() || "Destination";
    
    if (!startLocation.trim() || !destination.trim()) {
      Alert.alert(
        "Missing Information", 
        "Please enter both start location and destination before bookmarking a route.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      // Reload bookmarks from storage to ensure we have latest data
      const currentBookmarksJson = await AsyncStorage.getItem('bookmarked-routes');
      const currentBookmarks = currentBookmarksJson ? JSON.parse(currentBookmarksJson) : [];
      
      console.log('Current bookmarks in storage:', currentBookmarks.length);
      
      // Check if this exact route is already bookmarked
      const alreadyBookmarked = currentBookmarks.some(r => {
        return r.routeId === route.id && 
               r.startLocation === start && 
               r.destination === dest;
      });
      
      if (alreadyBookmarked) {
        Alert.alert("Already Bookmarked", "This route is already in your bookmarks!");
        return;
      }

      const bookmarkedRoute = {
        id: `bookmark-${Date.now()}`, // Unique bookmark ID
        routeId: route.id, // Original route ID
        duration: route.duration,
        transfers: route.transfers,
        agencies: route.agencies,
        reliability: route.reliability,
        startLocation: start,
        destination: dest,
        departureTime: departureTime || "Flexible",
        preference: selectedPreference,
        bookmarkedAt: new Date().toLocaleString(),
      };
      
      console.log('New bookmark object:', bookmarkedRoute);
      
      const updatedBookmarks = [...currentBookmarks, bookmarkedRoute];
      
      console.log('Saving bookmarks. New total:', updatedBookmarks.length);
      
      await AsyncStorage.setItem('bookmarked-routes', JSON.stringify(updatedBookmarks));
      setBookmarkedRoutes(updatedBookmarks);
      
      console.log('✓ Bookmark saved successfully');
      
      Alert.alert(
        "✓ Route Bookmarked",
        "This route has been added to your favorites and will appear on your home page!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('!!! ERROR bookmarking route:', error);
      Alert.alert("Error", "Failed to bookmark route: " + error.message);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Plan Your Route</Text>

      <Input 
        placeholder="Start location" 
        value={startLocation}
        onChangeText={(text) => {
          console.log('Start location changed to:', text);
          setStartLocation(text);
        }}
      />
      <Input 
        placeholder="Destination" 
        value={destination}
        onChangeText={(text) => {
          console.log('Destination changed to:', text);
          setDestination(text);
        }}
      />
      <Input 
        placeholder="Departure time (optional)" 
        value={departureTime}
        onChangeText={(text) => {
          console.log('Departure time changed to:', text);
          setDepartureTime(text);
        }}
      />

      <SectionHeader title="Route Preferences" />
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        {["Fastest", "Safest", "Cheapest"].map((opt) => (
          <Pressable 
            key={opt} 
            style={[
              styles.pill,
              selectedPreference === opt && styles.pillSelected
            ]}
            onPress={() => setSelectedPreference(opt)}
          >
            <Text style={[
              styles.pillText,
              selectedPreference === opt && styles.pillTextSelected
            ]}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button label="Plan Route" onPress={handlePlanRoute} />

      <SectionHeader title="Route Options" />
      {routes.map((r) => {
        const isBookmarked = isRouteBookmarked(r.id);
        return (
          <Card key={r.id}>
            <Text style={styles.cardTitle}>{r.duration} • {r.transfers} transfer(s)</Text>
            <View style={{ flexDirection: "row", marginTop: 6 }}>
              {r.agencies.map((a) => <AgencyBadge key={a} name={a} />)}
            </View>
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 6 }}>
              AI-generated recommendation (mock data)
            </Text>
            <Text style={{ color: colors.success, marginTop: 4 }}>Reliability: {r.reliability}</Text>
            <Button 
              label={isBookmarked ? "✓ Bookmarked" : "Bookmark Route"} 
              onPress={() => handleBookmarkRoute(r)}
              variant={isBookmarked ? "secondary" : "primary"}
            />
          </Card>
        );
      })}

      {savedRoutes.length > 0 && (
        <>
          <SectionHeader title="Recent Searches" />
          {savedRoutes.slice(0, 3).map((route) => (
            <Card key={route.id}>
              <Text style={styles.cardTitle}>
                {route.startLocation} → {route.destination}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                {route.departureTime} • {route.preference} • {route.createdAt}
              </Text>
            </Card>
          ))}
        </>
      )}

      {bookmarkedRoutes.length > 0 && (
        <>
          <SectionHeader title="Bookmarked Routes" />
          <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
            {bookmarkedRoutes.length} route{bookmarkedRoutes.length !== 1 ? 's' : ''} saved
          </Text>
        </>
      )}
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
  pillSelected: {
    backgroundColor: colors.primary,
  },
  pillText: { 
    color: colors.primary, 
    fontWeight: "600" 
  },
  pillTextSelected: {
    color: "#fff",
  },
});