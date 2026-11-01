// Authentication Service supporting both Firebase Auth and Local Demo Mode

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase.js';
import { userService } from './userService.js';

const DEMO_USER_STORAGE_KEY = 'sensorlab_demo_user';

export const mapAuthError = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please log in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Your password should be at least 6 characters long.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please wait a moment before trying again.';
    default:
      return 'Authentication could not be completed. Please check your details.';
  }
};

export const authService = {
  async register(email, password, displayName, grade = 5) {
    if (isFirebaseConfigured() && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });

        // Create user document in Firestore
        await userService.createUserProfile(userCredential.user.uid, {
          email,
          displayName,
          grade: Number(grade),
          avatarId: 'bot-1',
          onboardingCompleted: false
        });

        return { user: userCredential.user, error: null };
      } catch (error) {
        return { user: null, error: mapAuthError(error.code) };
      }
    } else {
      // Local Demo Mode persistence
      const mockUid = `demo_user_${Date.now()}`;
      const demoUser = {
        uid: mockUid,
        email,
        displayName: displayName || 'Junior Inventor',
        grade: Number(grade),
        avatarId: 'bot-1',
        onboardingCompleted: false,
        isDemo: true
      };

      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
      await userService.createUserProfile(mockUid, demoUser);
      return { user: demoUser, error: null };
    }
  },

  async login(email, password) {
    if (isFirebaseConfigured() && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
      } catch (error) {
        return { user: null, error: mapAuthError(error.code) };
      }
    } else {
      // Demo Mode login
      let demoUser = null;
      const saved = localStorage.getItem(DEMO_USER_STORAGE_KEY);
      if (saved) {
        demoUser = JSON.parse(saved);
        if (email && email !== demoUser.email) {
          demoUser.email = email;
          localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
        }
      } else {
        demoUser = {
          uid: 'demo_student_42',
          email: email || 'student@sensorlab.edu',
          displayName: 'Aarav Sharma',
          grade: 6,
          avatarId: 'bot-2',
          onboardingCompleted: true,
          isDemo: true
        };
        localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
        await userService.createUserProfile(demoUser.uid, demoUser);
      }
      return { user: demoUser, error: null };
    }
  },

  async loginAsDemoStudent(grade = 6) {
    const demoUser = {
      uid: 'demo_student_quickstart',
      email: 'student.demo@sensorlab.edu',
      displayName: 'Maya Patel',
      grade: Number(grade),
      role: 'student',
      avatarId: 'bot-3',
      onboardingCompleted: true,
      isDemo: true
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    await userService.createUserProfile(demoUser.uid, demoUser);
    return { user: demoUser, error: null };
  },

  async loginAsDemoTeacher() {
    const demoTeacher = {
      uid: 'demo_teacher_faculty',
      email: 'priya.rao@sensorlab.edu',
      displayName: 'Dr. Priya Rao',
      role: 'teacher',
      grade: null,
      assignedGrades: [5, 6, 7, 8, 9, 10],
      institution: 'Greenwood STEM Academy',
      avatarId: 'bot-teacher',
      onboardingCompleted: true,
      isDemo: true
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoTeacher));
    await userService.createUserProfile(demoTeacher.uid, demoTeacher);
    return { user: demoTeacher, error: null };
  },

  async logout() {
    if (isFirebaseConfigured() && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    return { success: true };
  },

  async resetPassword(email) {
    if (isFirebaseConfigured() && auth) {
      try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: mapAuthError(error.code) };
      }
    } else {
      return {
        success: true,
        message: 'In Demo Mode: Password reset link simulated for ' + email
      };
    }
  },

  onAuthStateChanged(callback) {
    if (isFirebaseConfigured() && auth) {
      return onAuthStateChanged(auth, callback);
    } else {
      // Local session check
      const saved = localStorage.getItem(DEMO_USER_STORAGE_KEY);
      if (saved) {
        try {
          callback(JSON.parse(saved));
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
      return () => {};
    }
  }
};
