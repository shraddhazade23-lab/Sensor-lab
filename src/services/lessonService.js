// Educational Lesson and Module Service for SensorLab

import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';
import { INITIAL_MODULES, INITIAL_LESSONS } from '../data/initialLessons.js';

export const lessonService = {
  async getModules(grade = null) {
    if (isFirebaseConfigured() && db) {
      try {
        const modulesRef = collection(db, 'learningModules');
        let q = query(modulesRef, where('published', '==', true), orderBy('sortOrder', 'asc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          let list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          if (grade) {
            list = list.filter(m => m.gradeLevels && m.gradeLevels.includes(Number(grade)));
          }
          return list;
        }
      } catch (err) {
        console.warn('Falling back to local modules data:', err.message);
      }
    }

    // Default static curriculum
    let modules = [...INITIAL_MODULES];
    if (grade) {
      modules = modules.filter(m => m.gradeLevels.includes(Number(grade)));
    }
    return modules;
  },

  async getLesson(lessonId) {
    if (isFirebaseConfigured() && db) {
      try {
        const lessonRef = doc(db, 'lessons', lessonId);
        const snapshot = await getDoc(lessonRef);
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() };
        }
      } catch (err) {
        console.warn('Falling back to local lesson data:', err.message);
      }
    }

    // Default static lessons
    return INITIAL_LESSONS.find(l => l.id === lessonId) || null;
  },

  async getLessonsByModule(moduleId) {
    if (isFirebaseConfigured() && db) {
      try {
        const lessonsRef = collection(db, 'lessons');
        const q = query(lessonsRef, where('moduleId', '==', moduleId), orderBy('sortOrder', 'asc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (err) {
        console.warn('Falling back to local module lessons:', err.message);
      }
    }

    return INITIAL_LESSONS.filter(l => l.moduleId === moduleId).sort((a, b) => a.sortOrder - b.sortOrder);
  }
};
