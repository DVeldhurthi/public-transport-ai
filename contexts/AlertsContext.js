// contexts/AlertsContext.js
import { createContext, useState } from "react";

export const AlertsContext = createContext();

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState([
    { id: "1", agency: "BART", message: "Minor delays on Yellow Line", severity: "yellow", time: "4:39 PM" },
    { id: "2", agency: "Muni", message: "Service suspended at Civic Center", severity: "red", time: "4:15 PM" },
    { id: "3", agency: "Caltrain", message: "On time", severity: "green", time: "4:20 PM" },
  ]);
  
  const [trafficLevel, setTrafficLevel] = useState("normal");

  const addAlert = (alert) => {
    setAlerts((prev) => [alert, ...prev]);
  };

  const updateTraffic = (level) => {
    setTrafficLevel(level);
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, trafficLevel, updateTraffic }}>
      {children}
    </AlertsContext.Provider>
  );
}