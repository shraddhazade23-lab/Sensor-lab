// Comprehensive Progress, Scoring, Achievements, and Circuit Persistence Service

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';
import { INITIAL_PROJECTS } from '../data/initialProjects.js';
import { INITIAL_LESSONS } from '../data/initialLessons.js';

const DEMO_PROGRESS_PREFIX = 'sensorlab_progress_';

const getLocalProgressStore = (uid) => {
  try {
    const raw = localStorage.getItem(`${DEMO_PROGRESS_PREFIX}${uid}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading demo progress:', e);
  }
  return {
    lessons: {},
    projects: {},
    circuits: {},
    quizzes: {},
    achievements: {},
    points: 0,
    activities: []
  };
};

const saveLocalProgressStore = (uid, store) => {
  try {
    localStorage.setItem(`${DEMO_PROGRESS_PREFIX}${uid}`, JSON.stringify(store));
  } catch (e) {
    console.error('Error saving demo progress:', e);
  }
};

export const BADGE_DEFINITIONS = {
  'first-lesson': {
    id: 'first-lesson',
    title: 'First Step in Tech',
    description: 'Completed your very first interactive electronics lesson!',
    icon: '🚀',
    category: 'Learning'
  },
  'circuit-explorer': {
    id: 'circuit-explorer',
    title: 'Circuit Explorer',
    description: 'Constructed and simulated your first complete virtual project!',
    icon: '⚡',
    category: 'Lab'
  },
  'sensor-master': {
    id: 'sensor-master',
    title: 'Sensor Sensei',
    description: 'Mastered light sensors and automated threshold detectors!',
    icon: '📡',
    category: 'Sensors'
  },
  'quiz-achiever': {
    id: 'quiz-achiever',
    title: 'Knowledge Ace',
    description: 'Scored 100% on a middle school electronics quiz!',
    icon: '🏆',
    category: 'Assessment'
  },
  'debug-star': {
    id: 'debug-star',
    title: 'Debugging Star',
    description: 'Validated circuits and resolved wiring feedback in the virtual lab!',
    icon: '🌟',
    category: 'Engineering'
  }
};

export const progressService = {
  async getStudentProgress(uid) {
    if (!uid) return getLocalProgressStore('guest');

    if (isFirebaseConfigured() && db) {
      try {
        const userDocRef = doc(db, 'users', uid);
        const [lessonsSnap, projectsSnap, circuitsSnap, achievementsSnap] = await Promise.all([
          getDocs(collection(userDocRef, 'lessonProgress')),
          getDocs(collection(userDocRef, 'projectProgress')),
          getDocs(collection(userDocRef, 'savedCircuits')),
          getDocs(collection(userDocRef, 'achievements'))
        ]);

        const lessons = {};
        lessonsSnap.forEach(d => { lessons[d.id] = d.data(); });

        const projects = {};
        projectsSnap.forEach(d => { projects[d.id] = d.data(); });

        const circuits = {};
        circuitsSnap.forEach(d => { circuits[d.id] = { id: d.id, ...d.data() }; });

        const achievements = {};
        achievementsSnap.forEach(d => { achievements[d.id] = d.data(); });

        // Calculate points based on completed items
        const lessonPoints = Object.values(lessons).filter(l => l.status === 'completed').length * 50;
        const projectPoints = Object.values(projects).filter(p => p.status === 'completed').length * 100;
        const quizPoints = Object.keys(achievements).length * 30;

        return {
          lessons,
          projects,
          circuits,
          achievements,
          points: lessonPoints + projectPoints + quizPoints
        };
      } catch (err) {
        console.warn('Falling back to local progress store:', err.message);
      }
    }

    return getLocalProgressStore(uid);
  },

  async markLessonCompleted(uid, lessonId) {
    if (!uid || !lessonId) return null;

    const completedAt = new Date().toISOString();
    const lesson = INITIAL_LESSONS.find(l => l.id === lessonId);
    const title = lesson ? lesson.title : lessonId;

    if (isFirebaseConfigured() && db) {
      try {
        const lessonRef = doc(db, 'users', uid, 'lessonProgress', lessonId);
        await setDoc(lessonRef, {
          lessonId,
          status: 'completed',
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error('Error saving lesson progress in Firestore:', err);
      }
    }

    // Local state update
    const store = getLocalProgressStore(uid);
    if (!store.lessons[lessonId] || store.lessons[lessonId].status !== 'completed') {
      store.lessons[lessonId] = {
        lessonId,
        status: 'completed',
        completedAt
      };
      store.points = (store.points || 0) + 50;
      store.activities.unshift({
        id: Math.random().toString(36).substr(2, 6),
        type: 'lesson',
        title: `Finished Lesson: ${title}`,
        timestamp: completedAt,
        pointsAwarded: 50
      });

      // Award First Lesson Badge if eligible
      if (!store.achievements['first-lesson']) {
        store.achievements['first-lesson'] = {
          ...BADGE_DEFINITIONS['first-lesson'],
          earnedAt: completedAt
        };
      }
      saveLocalProgressStore(uid, store);
    }

    return store;
  },

  async markProjectCompleted(uid, projectId) {
    if (!uid || !projectId) return null;

    const completedAt = new Date().toISOString();
    const proj = INITIAL_PROJECTS.find(p => p.id === projectId);
    const title = proj ? proj.title : projectId;

    if (isFirebaseConfigured() && db) {
      try {
        const projRef = doc(db, 'users', uid, 'projectProgress', projectId);
        await setDoc(projRef, {
          projectId,
          status: 'completed',
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error('Error saving project progress in Firestore:', err);
      }
    }

    // Local state update
    const store = getLocalProgressStore(uid);
    if (!store.projects[projectId] || store.projects[projectId].status !== 'completed') {
      store.projects[projectId] = {
        projectId,
        status: 'completed',
        completedAt
      };
      store.points = (store.points || 0) + 100;
      store.activities.unshift({
        id: Math.random().toString(36).substr(2, 6),
        type: 'project',
        title: `Built & Simulated: ${title}`,
        timestamp: completedAt,
        pointsAwarded: 100
      });

      // Check badges
      if (!store.achievements['circuit-explorer']) {
        store.achievements['circuit-explorer'] = {
          ...BADGE_DEFINITIONS['circuit-explorer'],
          earnedAt: completedAt
        };
      }

      if ((projectId.includes('ldr') || projectId.includes('auto')) && !store.achievements['sensor-master']) {
        store.achievements['sensor-master'] = {
          ...BADGE_DEFINITIONS['sensor-master'],
          earnedAt: completedAt
        };
      }

      saveLocalProgressStore(uid, store);
    }

    return store;
  },

  async recordQuizResult(uid, quizId, score, maxPoints, totalQuestions) {
    const passed = score >= (maxPoints * 0.7);
    const earnedAt = new Date().toISOString();

    const store = getLocalProgressStore(uid);
    store.quizzes[quizId] = {
      quizId,
      score,
      maxPoints,
      passed,
      attemptedAt: earnedAt
    };

    if (passed && (!store.quizzes[quizId] || !store.quizzes[quizId].passedPreviously)) {
      store.points = (store.points || 0) + 30;
      store.quizzes[quizId].passedPreviously = true;
    }

    if (score === maxPoints && !store.achievements['quiz-achiever']) {
      store.achievements['quiz-achiever'] = {
        ...BADGE_DEFINITIONS['quiz-achiever'],
        earnedAt
      };
    }

    store.activities.unshift({
      id: Math.random().toString(36).substr(2, 6),
      type: 'quiz',
      title: `Completed Quiz (${score}/${maxPoints} pts)`,
      timestamp: earnedAt,
      pointsAwarded: passed ? 30 : 0
    });

    saveLocalProgressStore(uid, store);
    return store;
  },

  async saveCircuit(uid, name, circuitData, projectId = null) {
    const circuitId = `circ_${Date.now().toString(36)}`;
    const payload = {
      id: circuitId,
      name: name || 'Custom Breadboard Circuit',
      projectId: projectId || null,
      circuitSchemaVersion: '1.0',
      components: circuitData.components || [],
      connections: circuitData.connections || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured() && db && uid) {
      try {
        const circRef = doc(db, 'users', uid, 'savedCircuits', circuitId);
        await setDoc(circRef, payload);
      } catch (err) {
        console.error('Error saving circuit in Firestore:', err);
      }
    }

    const store = getLocalProgressStore(uid);
    store.circuits[circuitId] = payload;
    store.activities.unshift({
      id: Math.random().toString(36).substr(2, 6),
      type: 'circuit',
      title: `Saved Circuit: ${payload.name}`,
      timestamp: new Date().toISOString(),
      pointsAwarded: 20
    });
    store.points = (store.points || 0) + 20;

    if (!store.achievements['debug-star']) {
      store.achievements['debug-star'] = {
        ...BADGE_DEFINITIONS['debug-star'],
        earnedAt: new Date().toISOString()
      };
    }

    saveLocalProgressStore(uid, store);
    return payload;
  },

  async getSavedCircuits(uid) {
    if (!uid) return [];
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'users', uid, 'savedCircuits'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (err) {
        console.warn('Falling back to local saved circuits:', err.message);
      }
    }

    const store = getLocalProgressStore(uid);
    return Object.values(store.circuits || {});
  },

  async deleteSavedCircuit(uid, circuitId) {
    if (isFirebaseConfigured() && db && uid) {
      try {
        await deleteDoc(doc(db, 'users', uid, 'savedCircuits', circuitId));
      } catch (err) {
        console.error('Error deleting circuit in Firestore:', err);
      }
    }

    const store = getLocalProgressStore(uid);
    delete store.circuits[circuitId];
    saveLocalProgressStore(uid, store);
    return true;
  }
};
