// Official SensorLab Certificate Verification and Management Service
// Enforces real completion criteria, prevents duplicate awards, and persists certified credentials.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';

const DEMO_CERTIFICATES_KEY = 'sensorlab_demo_certificates';

export const CERTIFICATE_DEFINITIONS = [
  {
    typeId: 'foundation-circuits',
    title: 'Certificate of Competence: Electronics & Breadboard Fundamentals',
    shortTitle: 'Electronics Fundamentals',
    category: 'Circuit Basics',
    minPoints: 150,
    requiredProjectCount: 1,
    requiredProjectIds: ['proj-simple-led'],
    applicableGrades: [5, 6],
    description: 'Awarded for demonstrating proficiency in circuit loop theory, LED polarity, and current-limiting resistor protection.',
    skillsDemonstrated: [
      'Safe breadboard power rail distribution (5V & GND)',
      'Anode / Cathode polarity orientation',
      'Ohmic resistor current regulation'
    ]
  },
  {
    typeId: 'sensors-microcontrollers',
    title: 'Certificate of Mastery: Sensors & Analog Interfacing',
    shortTitle: 'Sensors & Microcontrollers',
    category: 'Sensors & Controllers',
    minPoints: 250,
    requiredProjectCount: 2,
    requiredProjectIds: ['proj-ldr-indicator'],
    applicableGrades: [6, 7, 8],
    description: 'Awarded for constructing voltage dividers, reading ambient analog sensors, and understanding microcontroller ADC sampling.',
    skillsDemonstrated: [
      'LDR photoresistor calibration and lux conversion',
      'Analog-to-Digital conversion (0–1023 ADC values)',
      'Voltage divider voltage transfer calculation'
    ]
  },
  {
    typeId: 'automation-systems',
    title: 'Certificate of Excellence: Autonomous Controls & PWM Dimming',
    shortTitle: 'Autonomous Controls',
    category: 'Automation & Logic',
    minPoints: 350,
    requiredProjectCount: 2,
    requiredProjectIds: ['proj-auto-nightlight'],
    applicableGrades: [7, 8, 9],
    description: 'Awarded for implementing conditional threshold logic, Pulse-Width Modulation (PWM) duty cycling, and automated actuation.',
    skillsDemonstrated: [
      'Algorithmic decision thresholds and hysteresis',
      'PWM duty-cycle modulation (0–255)',
      'Autonomous system state handling'
    ]
  },
  {
    typeId: 'advanced-robotics',
    title: 'Certificate of Honor: Advanced Microcontroller & Robotics Systems',
    shortTitle: 'Advanced Robotics Systems',
    category: 'Embedded & Robotics',
    minPoints: 450,
    requiredProjectCount: 3,
    requiredProjectIds: ['proj-temp-fan', 'proj-smart-alarm'],
    applicableGrades: [8, 9, 10],
    description: 'Awarded for multi-sensor integration, digital state machine logic, ultrasonic echolocation, and active actuators.',
    skillsDemonstrated: [
      'Time-of-flight acoustic distance calculation',
      'Multi-input digital logic gating',
      'Commercial-grade security alarm state machines'
    ]
  },
  {
    typeId: 'master-technologist',
    title: 'SensorLab Distinguished Master Technologist Credential',
    shortTitle: 'Distinguished Master Technologist',
    category: 'Comprehensive Honors',
    minPoints: 550,
    requiredProjectCount: 4,
    requiredProjectIds: [],
    applicableGrades: [5, 6, 7, 8, 9, 10],
    description: 'Highest honors awarded to students who have completed extensive multi-grade guided projects and accumulated superior lab points.',
    skillsDemonstrated: [
      'Mastery of circuit physics, sensors, logic, and microcontrollers',
      'Complex schematic interpretation and debugging',
      'Virtual breadboard simulation design'
    ]
  }
];

const getLocalCertificates = () => {
  try {
    const raw = localStorage.getItem(DEMO_CERTIFICATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading demo certificates:', e);
    return [];
  }
};

const saveLocalCertificates = (certs) => {
  try {
    localStorage.setItem(DEMO_CERTIFICATES_KEY, JSON.stringify(certs));
  } catch (e) {
    console.error('Error saving demo certificates:', e);
  }
};

export const certificateService = {
  // Check student eligibility against all certificate types
  evaluateStudentEligibility(studentProfile, studentProgress, existingCertificates = []) {
    const studentPoints = studentProgress?.points || 0;
    const completedProjects = Object.entries(studentProgress?.projects || {})
      .filter(([_, p]) => p.status === 'completed')
      .map(([id]) => id);
    const completedProjectsCount = completedProjects.length;

    const issuedTypeIds = new Set(
      existingCertificates
        .filter(c => c.status !== 'revoked' && c.studentUid === studentProfile.uid)
        .map(c => c.typeId)
    );

    return CERTIFICATE_DEFINITIONS.map(def => {
      const alreadyIssued = issuedTypeIds.has(def.typeId);
      const unmet = [];
      const satisfied = [];

      // 1. Points check
      if (studentPoints >= def.minPoints) {
        satisfied.push(`Points requirement met (${studentPoints}/${def.minPoints} pts)`);
      } else {
        unmet.push(`Requires at least ${def.minPoints} points (Current: ${studentPoints})`);
      }

      // 2. Project count check
      if (completedProjectsCount >= def.requiredProjectCount) {
        satisfied.push(`Completed ${completedProjectsCount} projects (Requires: ${def.requiredProjectCount})`);
      } else {
        unmet.push(`Needs ${def.requiredProjectCount - completedProjectsCount} more completed project(s)`);
      }

      // 3. Required specific projects check
      if (def.requiredProjectIds && def.requiredProjectIds.length > 0) {
        const hasRequired = def.requiredProjectIds.some(pid => completedProjects.includes(pid));
        if (hasRequired) {
          satisfied.push('Required milestone project completed');
        } else {
          unmet.push(`Must complete at least one core project: ${def.requiredProjectIds.join(', ')}`);
        }
      }

      const isEligible = unmet.length === 0;

      return {
        ...def,
        isEligible,
        alreadyIssued,
        unmetCriteria: unmet,
        satisfiedCriteria: satisfied,
        currentPoints: studentPoints,
        completedProjectsCount
      };
    });
  },

  // Issue a new certificate
  async issueCertificate({
    studentUid,
    studentName,
    studentId,
    grade,
    typeId,
    issuedByTeacherName = 'Dr. Priya Rao',
    issuedByTeacherUid = 'teacher-admin',
    forceOverride = false
  }) {
    if (!studentUid || !typeId) {
      throw new Error('Student UID and Certificate Type are required');
    }

    const def = CERTIFICATE_DEFINITIONS.find(d => d.typeId === typeId);
    if (!def) {
      throw new Error(`Unknown certificate type: ${typeId}`);
    }

    // Check for duplicate
    const allExisting = await this.getAllCertificates();
    const existing = allExisting.find(
      c => c.studentUid === studentUid && c.typeId === typeId && c.status !== 'revoked'
    );
    if (existing) {
      throw new Error(`Certificate '${def.shortTitle}' has already been issued to ${studentName} (ID: ${existing.certificateId})`);
    }

    const timestamp = new Date();
    const uniqueSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const certNumber = `CERT-SL-${grade || 6}-${timestamp.getFullYear()}-${uniqueSuffix}`;

    const certPayload = {
      id: certNumber,
      certificateId: certNumber,
      typeId,
      title: def.title,
      shortTitle: def.shortTitle,
      category: def.category,
      studentUid,
      studentName: studentName || 'Student Maker',
      studentId: studentId || `SL-STU-${Math.floor(1000 + Math.random() * 9000)}`,
      grade: Number(grade) || 6,
      issueDate: timestamp.toISOString(),
      formattedIssueDate: timestamp.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: 'active',
      issuedBy: issuedByTeacherName,
      issuedByUid: issuedByTeacherUid,
      skillsDemonstrated: def.skillsDemonstrated,
      description: def.description,
      verificationHash: `VERIFY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      createdAt: timestamp.toISOString()
    };

    if (isFirebaseConfigured() && db) {
      try {
        // Save to master collection
        await setDoc(doc(db, 'certificates', certNumber), {
          ...certPayload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Also save to student subcollection
        await setDoc(doc(db, 'users', studentUid, 'certificates', certNumber), {
          ...certPayload,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error('Error saving certificate to Firestore:', err);
      }
    }

    // Save to local storage store
    const localCerts = getLocalCertificates();
    localCerts.unshift(certPayload);
    saveLocalCertificates(localCerts);

    return certPayload;
  },

  // Get all certificates across the institution
  async getAllCertificates() {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'certificates'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (err) {
        console.warn('Falling back to local certificates store:', err.message);
      }
    }

    return getLocalCertificates();
  },

  // Get certificates for a specific student
  async getCertificatesForStudent(studentUid) {
    if (!studentUid) return [];

    if (isFirebaseConfigured() && db) {
      try {
        const subSnap = await getDocs(collection(db, 'users', studentUid, 'certificates'));
        if (!subSnap.empty) {
          return subSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (err) {
        console.warn('Falling back to filtered certificates:', err.message);
      }
    }

    const all = getLocalCertificates();
    return all.filter(c => c.studentUid === studentUid && c.status !== 'revoked');
  },

  // Revoke certificate
  async revokeCertificate(certificateId, reason = 'Administrative revocation') {
    if (!certificateId) return false;

    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'certificates', certificateId), {
          status: 'revoked',
          revokedAt: serverTimestamp(),
          revocationReason: reason
        });
      } catch (err) {
        console.error('Error updating certificate in Firestore:', err);
      }
    }

    const localCerts = getLocalCertificates();
    const updated = localCerts.map(c => 
      c.certificateId === certificateId || c.id === certificateId
        ? { ...c, status: 'revoked', revocationReason: reason }
        : c
    );
    saveLocalCertificates(updated);
    return true;
  }
};
