// Quiz Service for SensorLab Assessments

import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';
import { INITIAL_QUIZZES } from '../data/initialQuizzes.js';

export const quizService = {
  async getQuiz(quizId) {
    if (isFirebaseConfigured() && db) {
      try {
        const quizRef = doc(db, 'quizzes', quizId);
        const snapshot = await getDoc(quizRef);
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() };
        }
      } catch (err) {
        console.warn('Falling back to local quiz data:', err.message);
      }
    }

    return INITIAL_QUIZZES.find(q => q.id === quizId) || null;
  },

  async getQuizByLesson(lessonId) {
    return INITIAL_QUIZZES.find(q => q.lessonId === lessonId) || null;
  }
};
