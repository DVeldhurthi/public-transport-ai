import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SafetyContext = createContext();

export function SafetyProvider({ children }) {
  const [locationSharing, setLocationSharing] = useState(false);
  const [anonymousReporting, setAnonymousReporting] = useState(true);
  const [tripActive, setTripActive] = useState(false);
  const [tripStartTime, setTripStartTime] = useState(null);
  const [eventLog, setEventLog] = useState([]);

  // Load saved state
  useEffect(() => {
    AsyncStorage.getItem("safetyState").then((data) => {
      if (data) {
        const parsed = JSON.parse(data);
        setLocationSharing(parsed.locationSharing);
        setAnonymousReporting(parsed.anonymousReporting);
        setTripActive(parsed.tripActive);
        setTripStartTime(parsed.tripStartTime);
        setEventLog(parsed.eventLog || []);
      }
    });
  }, []);

  // Persist state
  useEffect(() => {
    AsyncStorage.setItem(
      "safetyState",
      JSON.stringify({
        locationSharing,
        anonymousReporting,
        tripActive,
        tripStartTime,
        eventLog,
      })
    );
  }, [locationSharing, anonymousReporting, tripActive, tripStartTime, eventLog]);

  const startTrip = () => {
    setTripActive(true);
    setTripStartTime(Date.now());
    setEventLog((prev) => [
      { type: "TRIP_STARTED", time: Date.now() },
      ...prev,
    ]);
  };

  const endTrip = () => {
    setTripActive(false);
    setTripStartTime(null);
    setEventLog((prev) => [
      { type: "TRIP_ENDED", time: Date.now() },
      ...prev,
    ]);
  };

  const sendEmergency = () => {
    setEventLog((prev) => [
      { type: "EMERGENCY_ALERT", time: Date.now() },
      ...prev,
    ]);
  };

  const shareLocationOnce = () => {
    setEventLog((prev) => [
      { type: "LOCATION_SHARED", time: Date.now() },
      ...prev,
    ]);
  };

  return (
    <SafetyContext.Provider
      value={{
        locationSharing,
        setLocationSharing,
        anonymousReporting,
        setAnonymousReporting,
        tripActive,
        tripStartTime,
        startTrip,
        endTrip,
        sendEmergency,
        shareLocationOnce,
        eventLog,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
}

export const useSafety = () => useContext(SafetyContext);