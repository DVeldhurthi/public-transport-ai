// ProfileBackend.js
// Backend service for Profile and Settings functionality

class ProfileBackend {
  constructor() {
    this.STORAGE_KEY = 'bayroute-profile-data';
    this.state = {
      user: null,
      locationSharing: false,
      anonymousReporting: true,
      darkMode: false,
      notifications: {
        tripAlerts: true,
        emergencyAlerts: true,
        routeUpdates: true,
        safetyReminders: true
      },
      preferences: {
        language: 'en',
        units: 'imperial', // or 'metric'
        mapStyle: 'default',
        autoStartTracking: false
      },
      appSettings: {
        soundEnabled: true,
        vibrationEnabled: true,
        batteryOptimization: false
      }
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
      console.log('No stored profile data found, using defaults');
      return this.state;
    }
  }

  // Save state to persistent storage
  async saveState() {
    try {
      await window.storage.set(this.STORAGE_KEY, JSON.stringify(this.state));
      return { success: true };
    } catch (error) {
      console.error('Failed to save profile state:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current state
  getState() {
    return { ...this.state };
  }

  // User Authentication
  async signIn(authData) {
    // Simulate authentication process
    // In a real app, this would call your authentication service
    
    if (!authData) {
      // Demo sign-in
      authData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        provider: 'google'
      };
    }

    const user = {
      id: Date.now(),
      name: authData.name,
      email: authData.email,
      provider: authData.provider || 'google',
      profilePicture: authData.profilePicture || null,
      signInDate: new Date().toISOString(),
      lastActiveDate: new Date().toISOString()
    };

    this.state.user = user;
    await this.saveState();

    // Sync user data from cloud (simulated)
    await this.syncUserData();

    return {
      success: true,
      user,
      message: 'Signed in successfully'
    };
  }

  async signOut() {
    if (!this.state.user) {
      return { success: false, error: 'No user signed in' };
    }

    const userName = this.state.user.name;

    // Optionally sync data before signing out
    await this.syncUserData();

    this.state.user = null;
    await this.saveState();

    return {
      success: true,
      message: `${userName} signed out successfully`
    };
  }

  getUser() {
    return this.state.user ? { ...this.state.user } : null;
  }

  isSignedIn() {
    return this.state.user !== null;
  }

  async updateUserProfile(updates) {
    if (!this.state.user) {
      return { success: false, error: 'No user signed in' };
    }

    this.state.user = {
      ...this.state.user,
      ...updates,
      lastActiveDate: new Date().toISOString()
    };

    await this.saveState();

    return {
      success: true,
      user: this.state.user,
      message: 'Profile updated successfully'
    };
  }

  // Privacy & Safety Settings
  async toggleLocationSharing(enabled) {
    this.state.locationSharing = enabled;
    await this.saveState();

    return {
      success: true,
      enabled,
      message: enabled 
        ? 'Location sharing enabled for Buddy Mode' 
        : 'Location sharing disabled'
    };
  }

  async toggleAnonymousReporting(enabled) {
    this.state.anonymousReporting = enabled;
    await this.saveState();

    return {
      success: true,
      enabled,
      message: enabled 
        ? 'Reports will be submitted anonymously' 
        : 'Reports will include your identity'
    };
  }

  getPrivacySettings() {
    return {
      locationSharing: this.state.locationSharing,
      anonymousReporting: this.state.anonymousReporting
    };
  }

  // Display Settings
  async toggleDarkMode(enabled) {
    this.state.darkMode = enabled;
    await this.saveState();

    // In a real app, this would trigger theme change
    document.body.classList.toggle('dark-mode', enabled);

    return {
      success: true,
      enabled,
      message: enabled ? 'Dark mode enabled' : 'Dark mode disabled'
    };
  }

  async updateMapStyle(style) {
    const validStyles = ['default', 'satellite', 'terrain', 'dark'];
    
    if (!validStyles.includes(style)) {
      return { success: false, error: 'Invalid map style' };
    }

    this.state.preferences.mapStyle = style;
    await this.saveState();

    return {
      success: true,
      style,
      message: `Map style changed to ${style}`
    };
  }

  // Notification Settings
  async updateNotificationSettings(settings) {
    this.state.notifications = {
      ...this.state.notifications,
      ...settings
    };

    await this.saveState();

    return {
      success: true,
      notifications: this.state.notifications,
      message: 'Notification settings updated'
    };
  }

  async toggleNotification(type, enabled) {
    if (!(type in this.state.notifications)) {
      return { success: false, error: 'Invalid notification type' };
    }

    this.state.notifications[type] = enabled;
    await this.saveState();

    return {
      success: true,
      type,
      enabled,
      message: `${type} notifications ${enabled ? 'enabled' : 'disabled'}`
    };
  }

  getNotificationSettings() {
    return { ...this.state.notifications };
  }

  // App Preferences
  async updatePreferences(preferences) {
    this.state.preferences = {
      ...this.state.preferences,
      ...preferences
    };

    await this.saveState();

    return {
      success: true,
      preferences: this.state.preferences,
      message: 'Preferences updated'
    };
  }

  async setLanguage(language) {
    const supportedLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ja'];
    
    if (!supportedLanguages.includes(language)) {
      return { success: false, error: 'Language not supported' };
    }

    this.state.preferences.language = language;
    await this.saveState();

    return {
      success: true,
      language,
      message: 'Language updated'
    };
  }

  async setUnits(units) {
    if (!['imperial', 'metric'].includes(units)) {
      return { success: false, error: 'Invalid unit system' };
    }

    this.state.preferences.units = units;
    await this.saveState();

    return {
      success: true,
      units,
      message: `Units changed to ${units}`
    };
  }

  getPreferences() {
    return { ...this.state.preferences };
  }

  // App Settings
  async updateAppSettings(settings) {
    this.state.appSettings = {
      ...this.state.appSettings,
      ...settings
    };

    await this.saveState();

    return {
      success: true,
      settings: this.state.appSettings,
      message: 'App settings updated'
    };
  }

  async toggleSound(enabled) {
    this.state.appSettings.soundEnabled = enabled;
    await this.saveState();

    return {
      success: true,
      enabled,
      message: `Sound ${enabled ? 'enabled' : 'disabled'}`
    };
  }

  async toggleVibration(enabled) {
    this.state.appSettings.vibrationEnabled = enabled;
    await this.saveState();

    return {
      success: true,
      enabled,
      message: `Vibration ${enabled ? 'enabled' : 'disabled'}`
    };
  }

  async toggleBatteryOptimization(enabled) {
    this.state.appSettings.batteryOptimization = enabled;
    await this.saveState();

    return {
      success: true,
      enabled,
      message: `Battery optimization ${enabled ? 'enabled' : 'disabled'}`
    };
  }

  getAppSettings() {
    return { ...this.state.appSettings };
  }

  // Data Management
  async exportUserData() {
    const data = {
      profile: this.state,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    // In a real app, this would create a downloadable file
    const dataStr = JSON.stringify(data, null, 2);
    
    return {
      success: true,
      data: dataStr,
      message: 'User data exported successfully'
    };
  }

  async importUserData(dataStr) {
    try {
      const data = JSON.parse(dataStr);
      
      if (!data.profile || !data.version) {
        return { success: false, error: 'Invalid data format' };
      }

      // Merge imported data with current state
      this.state = {
        ...this.state,
        ...data.profile
      };

      await this.saveState();

      return {
        success: true,
        message: 'User data imported successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse import data'
      };
    }
  }

  async syncUserData() {
    if (!this.state.user) {
      return { success: false, error: 'No user signed in' };
    }

    // Simulate cloud sync
    // In a real app, this would sync with your backend
    console.log('Syncing user data to cloud...');

    await this.saveState();

    return {
      success: true,
      message: 'User data synced successfully',
      syncedAt: new Date().toISOString()
    };
  }

  async clearUserData() {
    // Keep user info but reset settings to defaults
    const user = this.state.user;

    this.state = {
      user,
      locationSharing: false,
      anonymousReporting: true,
      darkMode: false,
      notifications: {
        tripAlerts: true,
        emergencyAlerts: true,
        routeUpdates: true,
        safetyReminders: true
      },
      preferences: {
        language: 'en',
        units: 'imperial',
        mapStyle: 'default',
        autoStartTracking: false
      },
      appSettings: {
        soundEnabled: true,
        vibrationEnabled: true,
        batteryOptimization: false
      }
    };

    await this.saveState();

    return {
      success: true,
      message: 'User settings reset to defaults'
    };
  }

  async deleteAccount() {
    if (!this.state.user) {
      return { success: false, error: 'No user signed in' };
    }

    const userName = this.state.user.name;

    // In a real app, this would call backend to delete account
    console.log('Deleting account:', userName);

    // Clear all profile data
    this.state = {
      user: null,
      locationSharing: false,
      anonymousReporting: true,
      darkMode: false,
      notifications: {
        tripAlerts: true,
        emergencyAlerts: true,
        routeUpdates: true,
        safetyReminders: true
      },
      preferences: {
        language: 'en',
        units: 'imperial',
        mapStyle: 'default',
        autoStartTracking: false
      },
      appSettings: {
        soundEnabled: true,
        vibrationEnabled: true,
        batteryOptimization: false
      }
    };

    await this.saveState();

    // Also clear buddy mode data
    try {
      await window.storage.delete('bayroute-buddy-data');
    } catch (error) {
      console.error('Failed to clear buddy data:', error);
    }

    return {
      success: true,
      message: `Account for ${userName} deleted successfully`
    };
  }

  // Usage Statistics (for future feature)
  async getUsageStats() {
    if (!this.state.user) {
      return { success: false, error: 'No user signed in' };
    }

    // In a real app, this would fetch from analytics
    const stats = {
      tripsCompleted: Math.floor(Math.random() * 100),
      totalDistance: Math.floor(Math.random() * 1000) + ' miles',
      safetyAlertsShared: Math.floor(Math.random() * 50),
      trustedContactsAdded: Math.floor(Math.random() * 10),
      accountAge: Math.floor(
        (new Date() - new Date(this.state.user.signInDate)) / (1000 * 60 * 60 * 24)
      ) + ' days'
    };

    return {
      success: true,
      stats
    };
  }
}

// Export singleton instance
const profileBackend = new ProfileBackend();
export default profileBackend;