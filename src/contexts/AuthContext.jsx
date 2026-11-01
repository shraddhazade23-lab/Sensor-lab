import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { userService } from '../services/userService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await userService.getUserProfile(user.uid);
          setUserProfile(profile || {
            displayName: user.displayName || 'Student',
            grade: 5,
            avatarId: 'bot-1',
            onboardingCompleted: true
          });
        } catch (err) {
          console.error('Error fetching profile on auth change:', err);
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    const result = await authService.login(email, password);
    if (result.user) {
      setCurrentUser(result.user);
      const profile = await userService.getUserProfile(result.user.uid);
      setUserProfile(profile);
    }
    setIsLoading(false);
    return result;
  };

  const loginAsDemoStudent = async (grade = 6) => {
    setIsLoading(true);
    const result = await authService.loginAsDemoStudent(grade);
    if (result.user) {
      setCurrentUser(result.user);
      const profile = await userService.getUserProfile(result.user.uid);
      setUserProfile(profile);
    }
    setIsLoading(false);
    return result;
  };

  const loginAsDemoTeacher = async () => {
    setIsLoading(true);
    const result = await authService.loginAsDemoTeacher();
    if (result.user) {
      setCurrentUser(result.user);
      const profile = await userService.getUserProfile(result.user.uid);
      setUserProfile(profile);
    }
    setIsLoading(false);
    return result;
  };

  const register = async (email, password, displayName, grade) => {
    setIsLoading(true);
    const result = await authService.register(email, password, displayName, grade);
    if (result.user) {
      setCurrentUser(result.user);
      const profile = await userService.getUserProfile(result.user.uid);
      setUserProfile(profile);
    }
    setIsLoading(false);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateProfileData = async (updates) => {
    if (!currentUser) return null;
    const updated = await userService.updateUserProfile(currentUser.uid, updates);
    setUserProfile(prev => ({ ...prev, ...updated }));
    return updated;
  };

  const isTeacher = Boolean(
    userProfile?.role === 'teacher' ||
    userProfile?.role === 'admin' ||
    userProfile?.isAdmin === true
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isTeacher,
        isLoading,
        login,
        loginAsDemoStudent,
        loginAsDemoTeacher,
        register,
        logout,
        updateProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
