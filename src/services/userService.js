// User profile management service for SensorLab

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';

const DEMO_PROFILES_KEY = 'sensorlab_demo_profiles';

const getLocalProfiles = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_PROFILES_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveLocalProfiles = (profiles) => {
  localStorage.setItem(DEMO_PROFILES_KEY, JSON.stringify(profiles));
};

export const userService = {
  async createUserProfile(uid, profileData) {
    const payload = {
      displayName: profileData.displayName || 'Student',
      email: profileData.email || '',
      grade: profileData.grade !== undefined ? profileData.grade : 5,
      role: profileData.role || 'student',
      institution: profileData.institution || 'Greenwood STEM Academy',
      assignedGrades: profileData.assignedGrades || null,
      avatarId: profileData.avatarId || 'bot-1',
      onboardingCompleted: profileData.onboardingCompleted || false,
      preferredLanguage: profileData.preferredLanguage || 'English',
      themePreference: profileData.themePreference || 'light',
      isAdmin: Boolean(profileData.isAdmin || profileData.role === 'admin'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured() && db) {
      try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
        return payload;
      } catch (err) {
        console.error('Error creating Firestore user doc:', err);
      }
    }

    // Local fallback
    const profiles = getLocalProfiles();
    profiles[uid] = { ...payload, uid };
    saveLocalProfiles(profiles);
    return profiles[uid];
  },

  async getUserProfile(uid) {
    if (!uid) return null;

    if (isFirebaseConfigured() && db) {
      try {
        const userRef = doc(db, 'users', uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          return { uid, ...snapshot.data() };
        }
      } catch (err) {
        console.error('Error fetching Firestore user profile:', err);
      }
    }

    // Local fallback
    const profiles = getLocalProfiles();
    return profiles[uid] || {
      uid,
      displayName: 'Junior Maker',
      grade: 6,
      avatarId: 'bot-1',
      onboardingCompleted: true
    };
  },

  async updateUserProfile(uid, updates) {
    if (!uid) return null;

    if (isFirebaseConfigured() && db) {
      try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
          ...updates,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error('Error updating Firestore user profile:', err);
      }
    }

    // Local fallback update
    const profiles = getLocalProfiles();
    profiles[uid] = {
      ...(profiles[uid] || {}),
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveLocalProfiles(profiles);
    return profiles[uid];
  }
};
