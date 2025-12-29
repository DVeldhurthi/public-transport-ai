// BuddyBackend.js
// Backend service for Buddy Mode functionality

class BuddyBackend {
  constructor() {
    this.STORAGE_KEY = 'bayroute-buddy-data';
    this.state = {
      tripActive: false,
      tripStartTime: null,
      tripDestination: '',
      tripRoute: [],
      liveLocationSharing: false,
      automaticArrivalCheck: false,
      trustedContacts: [],
      emergencyAlerts: [],
      currentLocation: null
    };
  }

  // Initialize backend and load saved data
  async initialize() {
    try {
      const stored = await window.storage.get(this.STORAGE_KEY);
      if (stored) {
        this.state = JSON.parse(stored.value);
      }
      return this.state;
    } catch (error) {
      console.log('No stored buddy data found, using defaults');
      return this.state;
    }
  }

  // Save state to persistent storage
  async saveState() {
    try {
      await window.storage.set(this.STORAGE_KEY, JSON.stringify(this.state));
      return { success: true };
    } catch (error) {
      console.error('Failed to save buddy state:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current state
  getState() {
    return { ...this.state };
  }

  // Trip Management
  async startTrip(destination) {
    if (!destination || destination.trim() === '') {
      return { success: false, error: 'Destination is required' };
    }

    this.state.tripActive = true;
    this.state.tripStartTime = new Date().toISOString();
    this.state.tripDestination = destination;
    this.state.tripRoute = [];

    // Notify all trusted contacts
    const notifications = await this.notifyTrustedContacts(
      `Trip started to ${destination}`,
      'trip_start'
    );

    await this.saveState();

    return {
      success: true,
      trip: {
        destination,
        startTime: this.state.tripStartTime,
        notificationsSent: notifications.sent
      }
    };
  }

  async endTrip() {
    if (!this.state.tripActive) {
      return { success: false, error: 'No active trip to end' };
    }

    const tripDuration = new Date() - new Date(this.state.tripStartTime);
    const duration = Math.floor(tripDuration / 1000 / 60); // minutes

    // Notify contacts of safe arrival
    await this.notifyTrustedContacts(
      `Trip ended safely. Duration: ${duration} minutes`,
      'trip_end'
    );

    // Archive trip data
    const tripData = {
      destination: this.state.tripDestination,
      startTime: this.state.tripStartTime,
      endTime: new Date().toISOString(),
      duration,
      route: this.state.tripRoute
    };

    this.state.tripActive = false;
    this.state.tripStartTime = null;
    this.state.tripDestination = '';
    this.state.tripRoute = [];

    await this.saveState();

    return {
      success: true,
      tripData
    };
  }

  getTripStatus() {
    if (!this.state.tripActive) {
      return {
        active: false,
        message: 'No active trip'
      };
    }

    const elapsed = new Date() - new Date(this.state.tripStartTime);
    const minutes = Math.floor(elapsed / 1000 / 60);

    return {
      active: true,
      destination: this.state.tripDestination,
      startTime: this.state.tripStartTime,
      elapsedMinutes: minutes,
      contactsNotified: this.state.trustedContacts.length
    };
  }

  // Location Tracking
  async updateLocation(latitude, longitude) {
    this.state.currentLocation = {
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    };

    if (this.state.tripActive) {
      this.state.tripRoute.push(this.state.currentLocation);
    }

    if (this.state.liveLocationSharing && this.state.tripActive) {
      await this.shareLocationWithContacts();
    }

    await this.saveState();
    return { success: true, location: this.state.currentLocation };
  }

  async shareLocationWithContacts() {
    if (!this.state.currentLocation) {
      return { success: false, error: 'No location available' };
    }

    const locationData = {
      latitude: this.state.currentLocation.latitude,
      longitude: this.state.currentLocation.longitude,
      timestamp: this.state.currentLocation.timestamp,
      destination: this.state.tripDestination
    };

    // Send location to all contacts
    const notifications = await this.notifyTrustedContacts(
      `Location update: ${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}`,
      'location_update',
      locationData
    );

    return {
      success: true,
      contactsNotified: notifications.sent,
      location: locationData
    };
  }

  // Safety Features
  async toggleLiveLocationSharing(enabled) {
    this.state.liveLocationSharing = enabled;
    await this.saveState();

    return {
      success: true,
      enabled,
      message: enabled 
        ? 'Live location sharing enabled' 
        : 'Live location sharing disabled'
    };
  }

  async toggleAutomaticArrivalCheck(enabled) {
    this.state.automaticArrivalCheck = enabled;
    
    if (enabled && this.state.tripActive) {
      // Start monitoring arrival
      this.scheduleArrivalCheck();
    }

    await this.saveState();

    return {
      success: true,
      enabled,
      message: enabled 
        ? 'Automatic arrival check enabled' 
        : 'Automatic arrival check disabled'
    };
  }

  scheduleArrivalCheck() {
    // In a real app, this would use geolocation and estimated arrival time
    console.log('Arrival check scheduled for trip to:', this.state.tripDestination);
  }

  // Emergency Features
  async sendEmergencyAlert() {
    const alert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      location: this.state.currentLocation,
      destination: this.state.tripDestination,
      type: 'emergency'
    };

    this.state.emergencyAlerts.push(alert);

    // Send emergency notification to all contacts
    const notifications = await this.notifyTrustedContacts(
      '🚨 EMERGENCY ALERT - Immediate assistance needed!',
      'emergency',
      alert
    );

    await this.saveState();

    return {
      success: true,
      alert,
      contactsNotified: notifications.sent,
      message: 'Emergency alert sent to all trusted contacts'
    };
  }

  async shareCurrentLocation() {
    if (!this.state.currentLocation) {
      // Simulate getting current location
      this.state.currentLocation = {
        latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
        timestamp: new Date().toISOString()
      };
    }

    const result = await this.shareLocationWithContacts();

    return {
      success: true,
      location: this.state.currentLocation,
      contactsNotified: result.contactsNotified,
      message: 'Location shared with trusted contacts'
    };
  }

  // Trusted Contacts Management
  async addTrustedContact(contact) {
    if (!contact.name || !contact.phone) {
      return { success: false, error: 'Name and phone are required' };
    }

    const newContact = {
      id: Date.now(),
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      email: contact.email?.trim() || '',
      addedDate: new Date().toISOString(),
      notificationPreferences: {
        tripStart: true,
        tripEnd: true,
        emergencies: true,
        locationUpdates: contact.locationUpdates || false
      }
    };

    this.state.trustedContacts.push(newContact);
    await this.saveState();

    return {
      success: true,
      contact: newContact,
      message: `${contact.name} added as trusted contact`
    };
  }

  async removeTrustedContact(contactId) {
    const contact = this.state.trustedContacts.find(c => c.id === contactId);
    
    if (!contact) {
      return { success: false, error: 'Contact not found' };
    }

    this.state.trustedContacts = this.state.trustedContacts.filter(
      c => c.id !== contactId
    );
    
    await this.saveState();

    return {
      success: true,
      message: `${contact.name} removed from trusted contacts`
    };
  }

  async updateContactPreferences(contactId, preferences) {
    const contact = this.state.trustedContacts.find(c => c.id === contactId);
    
    if (!contact) {
      return { success: false, error: 'Contact not found' };
    }

    contact.notificationPreferences = {
      ...contact.notificationPreferences,
      ...preferences
    };

    await this.saveState();

    return {
      success: true,
      contact,
      message: 'Notification preferences updated'
    };
  }

  getTrustedContacts() {
    return [...this.state.trustedContacts];
  }

  // Notification System (simulated)
  async notifyTrustedContacts(message, type, data = null) {
    // In a real app, this would send SMS/push notifications
    const notifications = this.state.trustedContacts.map(contact => ({
      contactId: contact.id,
      contactName: contact.name,
      phone: contact.phone,
      message,
      type,
      data,
      timestamp: new Date().toISOString(),
      status: 'sent' // Would be 'sent', 'delivered', 'failed' in real app
    }));

    console.log(`Notifications sent to ${notifications.length} contacts:`, notifications);

    return {
      sent: notifications.length,
      notifications
    };
  }

  // Emergency Alert History
  getEmergencyAlerts() {
    return [...this.state.emergencyAlerts];
  }

  async clearEmergencyAlerts() {
    this.state.emergencyAlerts = [];
    await this.saveState();
    return { success: true, message: 'Emergency alerts cleared' };
  }

  // Trip History (for future feature)
  async getTripHistory() {
    try {
      const stored = await window.storage.get('bayroute-trip-history');
      return stored ? JSON.parse(stored.value) : [];
    } catch (error) {
      return [];
    }
  }

  // Clear all data
  async clearAllData() {
    this.state = {
      tripActive: false,
      tripStartTime: null,
      tripDestination: '',
      tripRoute: [],
      liveLocationSharing: false,
      automaticArrivalCheck: false,
      trustedContacts: [],
      emergencyAlerts: [],
      currentLocation: null
    };

    await this.saveState();

    return {
      success: true,
      message: 'All buddy mode data cleared'
    };
  }
}

// Export singleton instance
const buddyBackend = new BuddyBackend();
export default buddyBackend;