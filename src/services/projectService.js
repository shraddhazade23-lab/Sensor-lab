// Guided Project Service for SensorLab

import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';
import { INITIAL_PROJECTS } from '../data/initialProjects.js';

export const projectService = {
  async getProjects(filters = {}) {
    let list = [...INITIAL_PROJECTS];

    if (isFirebaseConfigured() && db) {
      try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, where('published', '==', true));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (err) {
        console.warn('Falling back to local project catalog:', err.message);
      }
    }

    // Apply filtering
    if (filters.grade) {
      const g = Number(filters.grade);
      list = list.filter(p => p.gradeLevels && p.gradeLevels.includes(g));
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
      list = list.filter(p => p.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
    }

    if (filters.search && filters.search.trim()) {
      const term = filters.search.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (p.topic && p.topic.toLowerCase().includes(term))
      );
    }

    return list;
  },

  async getProject(projectId) {
    if (isFirebaseConfigured() && db) {
      try {
        const projRef = doc(db, 'projects', projectId);
        const snapshot = await getDoc(projRef);
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() };
        }
      } catch (err) {
        console.warn('Falling back to local project detail:', err.message);
      }
    }

    return INITIAL_PROJECTS.find(p => p.id === projectId) || null;
  }
};
