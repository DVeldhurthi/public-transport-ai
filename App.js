import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AlertsProvider } from './contexts/AlertsContext';
import { colors } from './theme/colors';

import HomeScreen from './screens/HomeScreen';
import PlanRouteScreen from './screens/PlanRouteScreen';
import AlertsScreen from './screens/AlertsScreen';
import SafetyScreen from './screens/SafetyScreen';
import BuddyScreen from './screens/BuddyScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AlertsProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Plan Route') {
                iconName = focused ? 'map' : 'map-outline';
              } else if (route.name === 'Alerts') {
                iconName = focused ? 'notifications' : 'notifications-outline';
              } else if (route.name === 'Safety') {
                iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
              } else if (route.name === 'Buddy') {
                iconName = focused ? 'people' : 'people-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.muted,
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Plan Route" component={PlanRouteScreen} />
          <Tab.Screen name="Alerts" component={AlertsScreen} />
          <Tab.Screen name="Safety" component={SafetyScreen} />
          <Tab.Screen name="Buddy" component={BuddyScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AlertsProvider>
  );
}