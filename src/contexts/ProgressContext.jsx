import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { progressService, BADGE_DEFINITIONS } from '../services/progressService.js';
import { useAuth } from './AuthContext.jsx';
import confetti from 'canvas-confetti';

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState({
    lessons: {},
    projects: {},
    circuits: {},
    quizzes: {},
    achievements: {},
    points: 0,
    activities: []
  });
  const [loadingProgress, setLoadingProgress] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!currentUser) {
      setProgress({
        lessons: {},
        projects: {},
        circuits: {},
        quizzes: {},
        achievements: {},
        points: 0,
        activities: []
      });
      setLoadingProgress(false);
      return;
    }

    setLoadingProgress(true);
    try {
      const data = await progressService.getStudentProgress(currentUser.uid);
      setProgress(data);
    } catch (e) {
      console.error('Error fetching progress:', e);
    } finally {
      setLoadingProgress(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Confetti is an enhancement, non-blocking if canvas isn't ready
    }
  };

  const markLessonDone = async (lessonId) => {
    if (!currentUser) return;
    const updated = await progressService.markLessonCompleted(currentUser.uid, lessonId);
    if (updated) {
      setProgress(updated);
      triggerCelebration();
    }
    return updated;
  };

  const markProjectDone = async (projectId) => {
    if (!currentUser) return;
    const updated = await progressService.markProjectCompleted(currentUser.uid, projectId);
    if (updated) {
      setProgress(updated);
      triggerCelebration();
    }
    return updated;
  };

  const recordQuiz = async (quizId, score, maxPoints, totalQuestions) => {
    if (!currentUser) return;
    const updated = await progressService.recordQuizResult(currentUser.uid, quizId, score, maxPoints, totalQuestions);
    if (updated) {
      setProgress(updated);
      if (score >= maxPoints * 0.7) {
        triggerCelebration();
      }
    }
    return updated;
  };

  const saveCircuitToAccount = async (name, circuitData, projectId) => {
    if (!currentUser) return;
    const saved = await progressService.saveCircuit(currentUser.uid, name, circuitData, projectId);
    await fetchProgress();
    return saved;
  };

  const deleteSavedCircuit = async (circuitId) => {
    if (!currentUser) return;
    await progressService.deleteSavedCircuit(currentUser.uid, circuitId);
    await fetchProgress();
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loadingProgress,
        refreshProgress: fetchProgress,
        markLessonDone,
        markProjectDone,
        recordQuiz,
        saveCircuitToAccount,
        deleteSavedCircuit,
        badgesCatalog: BADGE_DEFINITIONS
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
