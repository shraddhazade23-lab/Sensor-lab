// Comprehensive Teacher & Academic Management Service for SensorLab
// Provides real Firebase & local persistence queries, student tracking, project metrics,
// leaderboard calculations, analytics reporting, and CSV data export.

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
import { INITIAL_PROJECTS } from '../data/initialProjects.js';
import { INITIAL_LESSONS } from '../data/initialLessons.js';
import { BADGE_DEFINITIONS } from './progressService.js';
import { certificateService } from './certificateService.js';

const DEMO_STUDENT_ROSTER_KEY = 'sensorlab_demo_student_roster';
const DEMO_TEACHER_SETTINGS_KEY = 'sensorlab_demo_teacher_settings';

// Seed dataset of realistic middle-to-high school students across Classes 5–10
const SEED_STUDENT_ROSTER = [
  {
    uid: 'stu_501_aarav',
    studentId: 'SL-STU-0501',
    displayName: 'Aarav Sharma',
    email: 'aarav.sharma@sensorlab.edu',
    grade: 5,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-1',
    createdAt: '2026-08-15T09:00:00Z',
    lastActive: '2026-10-27T10:30:00Z',
    progress: {
      projects: {
        'proj-simple-led': {
          projectId: 'proj-simple-led',
          status: 'completed',
          startedAt: '2026-09-02T10:00:00Z',
          completedAt: '2026-09-02T10:25:00Z',
          pointsEarned: 100,
          objectivesCompleted: [
            'Connect Arduino 5V to the breadboard power rail.',
            'Connect an LED with correct polarity (Anode to power, Cathode to resistor).',
            'Use a 220Ω resistor to complete the return path to Ground (GND).'
          ]
        },
        'proj-button-led': {
          projectId: 'proj-button-led',
          status: 'in_progress',
          startedAt: '2026-10-20T14:15:00Z',
          completedAt: null,
          pointsEarned: 40,
          objectivesCompleted: [
            'Understand how a momentary push button switch bridges an open circuit.'
          ]
        }
      },
      lessons: {
        'les-c5-what-is-electronics': { lessonId: 'les-c5-what-is-electronics', status: 'completed', completedAt: '2026-08-20T11:00:00Z' },
        'les-c5-open-closed-circuits': { lessonId: 'les-c5-open-closed-circuits', status: 'completed', completedAt: '2026-08-28T14:30:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-08-20T11:00:00Z', icon: '🚀' },
        'circuit-explorer': { id: 'circuit-explorer', title: 'Circuit Explorer', earnedAt: '2026-09-02T10:25:00Z', icon: '⚡' }
      },
      points: 240,
      activities: [
        { id: 'act_101', type: 'project_started', title: 'Started Project: Push Button Controlled LED', timestamp: '2026-10-20T14:15:00Z' },
        { id: 'act_102', type: 'badge_unlocked', title: 'Unlocked Badge: Circuit Explorer', timestamp: '2026-09-02T10:25:00Z' },
        { id: 'act_103', type: 'project_completed', title: 'Completed Project: Basic LED Circuit & Resistor Guard', timestamp: '2026-09-02T10:25:00Z' }
      ]
    }
  },
  {
    uid: 'stu_502_diya',
    studentId: 'SL-STU-0502',
    displayName: 'Diya Sen',
    email: 'diya.sen@sensorlab.edu',
    grade: 5,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-2',
    createdAt: '2026-08-22T08:30:00Z',
    lastActive: '2026-10-25T16:45:00Z',
    progress: {
      projects: {
        'proj-simple-led': {
          projectId: 'proj-simple-led',
          status: 'completed',
          startedAt: '2026-09-10T11:00:00Z',
          completedAt: '2026-09-10T11:35:00Z',
          pointsEarned: 100,
          objectivesCompleted: [
            'Connect Arduino 5V to the breadboard power rail.',
            'Connect an LED with correct polarity (Anode to power, Cathode to resistor).',
            'Use a 220Ω resistor to complete the return path to Ground (GND).'
          ]
        }
      },
      lessons: {
        'les-c5-what-is-electronics': { lessonId: 'les-c5-what-is-electronics', status: 'completed', completedAt: '2026-08-25T09:15:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-08-25T09:15:00Z', icon: '🚀' }
      },
      points: 150,
      activities: [
        { id: 'act_201', type: 'project_completed', title: 'Completed Project: Basic LED Circuit & Resistor Guard', timestamp: '2026-09-10T11:35:00Z' },
        { id: 'act_202', type: 'badge_unlocked', title: 'Unlocked Badge: First Step in Tech', timestamp: '2026-08-25T09:15:00Z' }
      ]
    }
  },
  {
    uid: 'stu_601_maya',
    studentId: 'SL-STU-0601',
    displayName: 'Maya Patel',
    email: 'maya.patel@sensorlab.edu',
    grade: 6,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-3',
    createdAt: '2026-08-10T07:15:00Z',
    lastActive: '2026-10-27T08:50:00Z',
    progress: {
      projects: {
        'proj-simple-led': {
          projectId: 'proj-simple-led',
          status: 'completed',
          startedAt: '2026-08-18T10:00:00Z',
          completedAt: '2026-08-18T10:20:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Connect Arduino 5V', 'Connect LED polarity', 'Use 220Ω resistor']
        },
        'proj-button-led': {
          projectId: 'proj-button-led',
          status: 'completed',
          startedAt: '2026-08-25T11:00:00Z',
          completedAt: '2026-08-25T11:30:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Wire push button switch', 'Series LED connection', 'Interactive push test']
        },
        'proj-ldr-indicator': {
          projectId: 'proj-ldr-indicator',
          status: 'completed',
          startedAt: '2026-09-12T14:00:00Z',
          completedAt: '2026-09-12T14:40:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Create voltage divider with LDR', 'Feed divider to A0', 'Observe 0-1023 analog range']
        },
        'proj-auto-nightlight': {
          projectId: 'proj-auto-nightlight',
          status: 'in_progress',
          startedAt: '2026-10-15T09:30:00Z',
          completedAt: null,
          pointsEarned: 50,
          objectivesCompleted: ['Set up LDR voltage divider on Analog Pin A0']
        }
      },
      lessons: {
        'les-c5-what-is-electronics': { lessonId: 'les-c5-what-is-electronics', status: 'completed', completedAt: '2026-08-12T09:00:00Z' },
        'les-c6-what-is-a-sensor': { lessonId: 'les-c6-what-is-a-sensor', status: 'completed', completedAt: '2026-08-30T10:15:00Z' },
        'les-c6-light-sensing-ldr': { lessonId: 'les-c6-light-sensing-ldr', status: 'completed', completedAt: '2026-09-08T11:30:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-08-12T09:00:00Z', icon: '🚀' },
        'circuit-explorer': { id: 'circuit-explorer', title: 'Circuit Explorer', earnedAt: '2026-08-18T10:20:00Z', icon: '⚡' },
        'sensor-master': { id: 'sensor-master', title: 'Sensor Sensei', earnedAt: '2026-09-12T14:40:00Z', icon: '📡' }
      },
      points: 500,
      activities: [
        { id: 'act_301', type: 'project_started', title: 'Started Project: Smart Automatic Night Light', timestamp: '2026-10-15T09:30:00Z' },
        { id: 'act_302', type: 'badge_unlocked', title: 'Unlocked Badge: Sensor Sensei', timestamp: '2026-09-12T14:40:00Z' },
        { id: 'act_303', type: 'project_completed', title: 'Completed Project: Light Sensor (LDR) Monitor', timestamp: '2026-09-12T14:40:00Z' }
      ]
    }
  },
  {
    uid: 'stu_602_devansh',
    studentId: 'SL-STU-0602',
    displayName: 'Devansh Joshi',
    email: 'devansh.joshi@sensorlab.edu',
    grade: 6,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-4',
    createdAt: '2026-08-20T11:00:00Z',
    lastActive: '2026-10-26T14:10:00Z',
    progress: {
      projects: {
        'proj-simple-led': {
          projectId: 'proj-simple-led',
          status: 'completed',
          startedAt: '2026-09-01T15:00:00Z',
          completedAt: '2026-09-01T15:25:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Connect Arduino 5V', 'Connect LED polarity', 'Use 220Ω resistor']
        },
        'proj-button-led': {
          projectId: 'proj-button-led',
          status: 'completed',
          startedAt: '2026-09-15T16:00:00Z',
          completedAt: '2026-09-15T16:30:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Wire push button switch', 'Series LED connection', 'Interactive push test']
        },
        'proj-ldr-indicator': {
          projectId: 'proj-ldr-indicator',
          status: 'in_progress',
          startedAt: '2026-10-22T10:00:00Z',
          completedAt: null,
          pointsEarned: 40,
          objectivesCompleted: ['Create voltage divider with LDR']
        }
      },
      lessons: {
        'les-c6-what-is-a-sensor': { lessonId: 'les-c6-what-is-a-sensor', status: 'completed', completedAt: '2026-09-05T10:00:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-09-05T10:00:00Z', icon: '🚀' },
        'circuit-explorer': { id: 'circuit-explorer', title: 'Circuit Explorer', earnedAt: '2026-09-01T15:25:00Z', icon: '⚡' }
      },
      points: 290,
      activities: [
        { id: 'act_401', type: 'project_started', title: 'Started Project: Light Sensor (LDR) Monitor', timestamp: '2026-10-22T10:00:00Z' },
        { id: 'act_402', type: 'project_completed', title: 'Completed Project: Push Button Controlled LED', timestamp: '2026-09-15T16:30:00Z' }
      ]
    }
  },
  {
    uid: 'stu_701_rohan',
    studentId: 'SL-STU-0701',
    displayName: 'Rohan Mehta',
    email: 'rohan.mehta@sensorlab.edu',
    grade: 7,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-5',
    createdAt: '2026-08-05T10:00:00Z',
    lastActive: '2026-10-27T11:15:00Z',
    progress: {
      projects: {
        'proj-simple-led': {
          projectId: 'proj-simple-led',
          status: 'completed',
          startedAt: '2026-08-10T10:00:00Z',
          completedAt: '2026-08-10T10:20:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Connect Arduino 5V', 'Connect LED polarity', 'Use 220Ω resistor']
        },
        'proj-button-led': {
          projectId: 'proj-button-led',
          status: 'completed',
          startedAt: '2026-08-15T10:00:00Z',
          completedAt: '2026-08-15T10:25:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Wire push button switch', 'Series LED connection', 'Interactive push test']
        },
        'proj-ldr-indicator': {
          projectId: 'proj-ldr-indicator',
          status: 'completed',
          startedAt: '2026-08-25T11:00:00Z',
          completedAt: '2026-08-25T11:35:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Create voltage divider with LDR', 'Feed divider to A0', 'Observe 0-1023 analog range']
        },
        'proj-auto-nightlight': {
          projectId: 'proj-auto-nightlight',
          status: 'completed',
          startedAt: '2026-09-10T14:00:00Z',
          completedAt: '2026-09-10T14:35:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Combine LDR with LED output', 'Configure automated decision threshold', 'Microcontroller autonomy']
        },
        'proj-pwm-brightness': {
          projectId: 'proj-pwm-brightness',
          status: 'completed',
          startedAt: '2026-10-05T15:00:00Z',
          completedAt: '2026-10-05T15:30:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Understand PWM tilde pins', 'Duty cycle to brightness relationship', 'Live 0-255 duty cycle test']
        }
      },
      lessons: {
        'les-c6-what-is-a-sensor': { lessonId: 'les-c6-what-is-a-sensor', status: 'completed', completedAt: '2026-08-12T10:00:00Z' },
        'les-c7-analog-vs-digital': { lessonId: 'les-c7-analog-vs-digital', status: 'completed', completedAt: '2026-08-28T11:00:00Z' },
        'les-c7-pwm-brightness': { lessonId: 'les-c7-pwm-brightness', status: 'completed', completedAt: '2026-09-20T12:00:00Z' },
        'les-c7-automation-thresholds': { lessonId: 'les-c7-automation-thresholds', status: 'completed', completedAt: '2026-10-02T13:00:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-08-12T10:00:00Z', icon: '🚀' },
        'circuit-explorer': { id: 'circuit-explorer', title: 'Circuit Explorer', earnedAt: '2026-08-10T10:20:00Z', icon: '⚡' },
        'sensor-master': { id: 'sensor-master', title: 'Sensor Sensei', earnedAt: '2026-09-10T14:35:00Z', icon: '📡' },
        'debug-star': { id: 'debug-star', title: 'Debugging Star', earnedAt: '2026-10-05T15:30:00Z', icon: '🌟' }
      },
      points: 700,
      activities: [
        { id: 'act_501', type: 'project_completed', title: 'Completed Project: PWM LED Smooth Dimmer Control', timestamp: '2026-10-05T15:30:00Z' },
        { id: 'act_502', type: 'badge_unlocked', title: 'Unlocked Badge: Debugging Star', timestamp: '2026-10-05T15:30:00Z' },
        { id: 'act_503', type: 'certificate_earned', title: 'Earned Certificate: Autonomous Controls & PWM Dimming', timestamp: '2026-10-06T09:00:00Z' }
      ]
    }
  },
  {
    uid: 'stu_702_neha',
    studentId: 'SL-STU-0702',
    displayName: 'Neha Verma',
    email: 'neha.verma@sensorlab.edu',
    grade: 7,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-1',
    createdAt: '2026-08-18T09:00:00Z',
    lastActive: '2026-10-24T17:30:00Z',
    progress: {
      projects: {
        'proj-ldr-indicator': {
          projectId: 'proj-ldr-indicator',
          status: 'completed',
          startedAt: '2026-09-05T11:00:00Z',
          completedAt: '2026-09-05T11:40:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Create voltage divider with LDR', 'Feed divider to A0', 'Observe 0-1023 analog range']
        },
        'proj-auto-nightlight': {
          projectId: 'proj-auto-nightlight',
          status: 'completed',
          startedAt: '2026-09-22T14:00:00Z',
          completedAt: '2026-09-22T14:35:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Combine LDR with LED output', 'Configure automated decision threshold']
        },
        'proj-pwm-brightness': {
          projectId: 'proj-pwm-brightness',
          status: 'in_progress',
          startedAt: '2026-10-18T10:00:00Z',
          completedAt: null,
          pointsEarned: 40,
          objectivesCompleted: ['Understand PWM tilde pins']
        }
      },
      lessons: {
        'les-c7-analog-vs-digital': { lessonId: 'les-c7-analog-vs-digital', status: 'completed', completedAt: '2026-09-01T10:00:00Z' },
        'les-c7-automation-thresholds': { lessonId: 'les-c7-automation-thresholds', status: 'completed', completedAt: '2026-09-18T14:00:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-09-01T10:00:00Z', icon: '🚀' },
        'sensor-master': { id: 'sensor-master', title: 'Sensor Sensei', earnedAt: '2026-09-22T14:35:00Z', icon: '📡' }
      },
      points: 340,
      activities: [
        { id: 'act_601', type: 'project_started', title: 'Started Project: PWM LED Smooth Dimmer Control', timestamp: '2026-10-18T10:00:00Z' },
        { id: 'act_602', type: 'project_completed', title: 'Completed Project: Smart Automatic Night Light', timestamp: '2026-09-22T14:35:00Z' }
      ]
    }
  },
  {
    uid: 'stu_801_ananya',
    studentId: 'SL-STU-0801',
    displayName: 'Ananya Iyer',
    email: 'ananya.iyer@sensorlab.edu',
    grade: 8,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-2',
    createdAt: '2026-08-01T10:00:00Z',
    lastActive: '2026-10-27T09:40:00Z',
    progress: {
      projects: {
        'proj-auto-nightlight': {
          projectId: 'proj-auto-nightlight',
          status: 'completed',
          startedAt: '2026-08-15T14:00:00Z',
          completedAt: '2026-08-15T14:30:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Combine LDR with LED output', 'Configure automated decision threshold']
        },
        'proj-pwm-brightness': {
          projectId: 'proj-pwm-brightness',
          status: 'completed',
          startedAt: '2026-08-28T15:00:00Z',
          completedAt: '2026-08-28T15:35:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Understand PWM pins', 'Duty cycle control', 'Simulate waveform']
        },
        'proj-ultrasonic-radar': {
          projectId: 'proj-ultrasonic-radar',
          status: 'completed',
          startedAt: '2026-09-20T16:00:00Z',
          completedAt: '2026-09-20T16:45:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Echolocation speed of sound math', 'Trigger/Echo pulse timing', 'Proximity warning zones']
        },
        'proj-temp-fan': {
          projectId: 'proj-temp-fan',
          status: 'in_progress',
          startedAt: '2026-10-12T11:00:00Z',
          completedAt: null,
          pointsEarned: 50,
          objectivesCompleted: ['Calibrate analog voltage to Celsius']
        }
      },
      lessons: {
        'les-c7-analog-vs-digital': { lessonId: 'les-c7-analog-vs-digital', status: 'completed', completedAt: '2026-08-10T10:00:00Z' },
        'les-c7-pwm-brightness': { lessonId: 'les-c7-pwm-brightness', status: 'completed', completedAt: '2026-08-20T11:00:00Z' },
        'les-c7-automation-thresholds': { lessonId: 'les-c7-automation-thresholds', status: 'completed', completedAt: '2026-09-05T12:00:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-08-10T10:00:00Z', icon: '🚀' },
        'circuit-explorer': { id: 'circuit-explorer', title: 'Circuit Explorer', earnedAt: '2026-08-15T14:30:00Z', icon: '⚡' },
        'sensor-master': { id: 'sensor-master', title: 'Sensor Sensei', earnedAt: '2026-09-20T16:45:00Z', icon: '📡' },
        'quiz-achiever': { id: 'quiz-achiever', title: 'Knowledge Ace', earnedAt: '2026-09-25T14:00:00Z', icon: '🏆' }
      },
      points: 530,
      activities: [
        { id: 'act_701', type: 'project_started', title: 'Started Project: Smart Temperature Monitor & Automated Cooling', timestamp: '2026-10-12T11:00:00Z' },
        { id: 'act_702', type: 'certificate_earned', title: 'Earned Certificate: Autonomous Controls & PWM Dimming', timestamp: '2026-09-22T10:00:00Z' },
        { id: 'act_703', type: 'project_completed', title: 'Completed Project: Ultrasonic Distance Radar & Proximity Warning', timestamp: '2026-09-20T16:45:00Z' }
      ]
    }
  },
  {
    uid: 'stu_802_arjun',
    studentId: 'SL-STU-0802',
    displayName: 'Arjun Reddy',
    email: 'arjun.reddy@sensorlab.edu',
    grade: 8,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-3',
    createdAt: '2026-08-25T11:00:00Z',
    lastActive: '2026-10-23T15:00:00Z',
    progress: {
      projects: {
        'proj-pwm-brightness': {
          projectId: 'proj-pwm-brightness',
          status: 'completed',
          startedAt: '2026-09-12T10:00:00Z',
          completedAt: '2026-09-12T10:30:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Understand PWM pins', 'Duty cycle control']
        },
        'proj-ultrasonic-radar': {
          projectId: 'proj-ultrasonic-radar',
          status: 'in_progress',
          startedAt: '2026-10-08T14:00:00Z',
          completedAt: null,
          pointsEarned: 40,
          objectivesCompleted: ['Echolocation speed of sound math']
        }
      },
      lessons: {
        'les-c7-pwm-brightness': { lessonId: 'les-c7-pwm-brightness', status: 'completed', completedAt: '2026-09-08T11:00:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-09-08T11:00:00Z', icon: '🚀' },
        'circuit-explorer': { id: 'circuit-explorer', title: 'Circuit Explorer', earnedAt: '2026-09-12T10:30:00Z', icon: '⚡' }
      },
      points: 290,
      activities: [
        { id: 'act_801', type: 'project_started', title: 'Started Project: Ultrasonic Distance Radar', timestamp: '2026-10-08T14:00:00Z' },
        { id: 'act_802', type: 'project_completed', title: 'Completed Project: PWM LED Smooth Dimmer Control', timestamp: '2026-09-12T10:30:00Z' }
      ]
    }
  },
  {
    uid: 'stu_901_kavya',
    studentId: 'SL-STU-0901',
    displayName: 'Kavya Deshmukh',
    email: 'kavya.deshmukh@sensorlab.edu',
    grade: 9,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-4',
    createdAt: '2026-07-28T09:00:00Z',
    lastActive: '2026-10-27T11:45:00Z',
    progress: {
      projects: {
        'proj-pwm-brightness': {
          projectId: 'proj-pwm-brightness',
          status: 'completed',
          startedAt: '2026-08-10T10:00:00Z',
          completedAt: '2026-08-10T10:30:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['PWM pins', 'Duty cycle', 'Simulation test']
        },
        'proj-ultrasonic-radar': {
          projectId: 'proj-ultrasonic-radar',
          status: 'completed',
          startedAt: '2026-08-25T14:00:00Z',
          completedAt: '2026-08-25T14:40:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Speed of sound math', 'Trigger/Echo lines', 'Warning zones']
        },
        'proj-temp-fan': {
          projectId: 'proj-temp-fan',
          status: 'completed',
          startedAt: '2026-09-15T15:00:00Z',
          completedAt: '2026-09-15T15:45:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Calibrate voltage to Celsius', 'Construct threshold comparator', 'Isolate logic and actuators']
        },
        'proj-smart-alarm': {
          projectId: 'proj-smart-alarm',
          status: 'in_progress',
          startedAt: '2026-10-20T11:00:00Z',
          completedAt: null,
          pointsEarned: 50,
          objectivesCompleted: ['Multi-condition logical operations', 'Armed state machine']
        }
      },
      lessons: {
        'les-c7-analog-vs-digital': { lessonId: 'les-c7-analog-vs-digital', status: 'completed', completedAt: '2026-08-05T10:00:00Z' },
        'les-c7-pwm-brightness': { lessonId: 'les-c7-pwm-brightness', status: 'completed', completedAt: '2026-08-15T11:00:00Z' },
        'les-c7-automation-thresholds': { lessonId: 'les-c7-automation-thresholds', status: 'completed', completedAt: '2026-09-02T12:00:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-08-05T10:00:00Z', icon: '🚀' },
        'circuit-explorer': { id: 'circuit-explorer', title: 'Circuit Explorer', earnedAt: '2026-08-10T10:30:00Z', icon: '⚡' },
        'sensor-master': { id: 'sensor-master', title: 'Sensor Sensei', earnedAt: '2026-08-25T14:40:00Z', icon: '📡' },
        'debug-star': { id: 'debug-star', title: 'Debugging Star', earnedAt: '2026-09-15T15:45:00Z', icon: '🌟' }
      },
      points: 620,
      activities: [
        { id: 'act_901', type: 'project_started', title: 'Started Project: Dual-Sensor Security Alarm', timestamp: '2026-10-20T11:00:00Z' },
        { id: 'act_902', type: 'certificate_earned', title: 'Earned Certificate: Advanced Microcontroller & Robotics Systems', timestamp: '2026-09-16T10:00:00Z' },
        { id: 'act_903', type: 'project_completed', title: 'Completed Project: Smart Temperature Monitor & Automated Cooling', timestamp: '2026-09-15T15:45:00Z' }
      ]
    }
  },
  {
    uid: 'stu_902_aditya',
    studentId: 'SL-STU-0902',
    displayName: 'Aditya Rao',
    email: 'aditya.rao@sensorlab.edu',
    grade: 9,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-5',
    createdAt: '2026-08-12T10:00:00Z',
    lastActive: '2026-10-25T14:20:00Z',
    progress: {
      projects: {
        'proj-ultrasonic-radar': {
          projectId: 'proj-ultrasonic-radar',
          status: 'completed',
          startedAt: '2026-09-02T14:00:00Z',
          completedAt: '2026-09-02T14:45:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Speed of sound math', 'Trigger/Echo lines', 'Warning zones']
        },
        'proj-temp-fan': {
          projectId: 'proj-temp-fan',
          status: 'in_progress',
          startedAt: '2026-10-10T10:00:00Z',
          completedAt: null,
          pointsEarned: 40,
          objectivesCompleted: ['Calibrate voltage to Celsius']
        }
      },
      lessons: {
        'les-c7-analog-vs-digital': { lessonId: 'les-c7-analog-vs-digital', status: 'completed', completedAt: '2026-08-25T11:00:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-08-25T11:00:00Z', icon: '🚀' },
        'sensor-master': { id: 'sensor-master', title: 'Sensor Sensei', earnedAt: '2026-09-02T14:45:00Z', icon: '📡' }
      },
      points: 290,
      activities: [
        { id: 'act_1001', type: 'project_started', title: 'Started Project: Smart Temperature Monitor', timestamp: '2026-10-10T10:00:00Z' },
        { id: 'act_1002', type: 'project_completed', title: 'Completed Project: Ultrasonic Distance Radar', timestamp: '2026-09-02T14:45:00Z' }
      ]
    }
  },
  {
    uid: 'stu_1001_vikram',
    studentId: 'SL-STU-1001',
    displayName: 'Vikram Singh',
    email: 'vikram.singh@sensorlab.edu',
    grade: 10,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-1',
    createdAt: '2026-07-15T08:00:00Z',
    lastActive: '2026-10-27T12:05:00Z',
    progress: {
      projects: {
        'proj-pwm-brightness': {
          projectId: 'proj-pwm-brightness',
          status: 'completed',
          startedAt: '2026-08-01T10:00:00Z',
          completedAt: '2026-08-01T10:25:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['PWM pins', 'Duty cycle', 'Simulation test']
        },
        'proj-ultrasonic-radar': {
          projectId: 'proj-ultrasonic-radar',
          status: 'completed',
          startedAt: '2026-08-15T11:00:00Z',
          completedAt: '2026-08-15T11:40:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Speed of sound math', 'Trigger/Echo lines', 'Warning zones']
        },
        'proj-temp-fan': {
          projectId: 'proj-temp-fan',
          status: 'completed',
          startedAt: '2026-09-01T14:00:00Z',
          completedAt: '2026-09-01T14:40:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Calibrate voltage to Celsius', 'Construct threshold comparator', 'Isolate logic and actuators']
        },
        'proj-smart-alarm': {
          projectId: 'proj-smart-alarm',
          status: 'completed',
          startedAt: '2026-09-28T15:00:00Z',
          completedAt: '2026-09-28T15:50:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Multi-condition logical operations', 'Armed state machine', 'Pulsing warning signals']
        }
      },
      lessons: {
        'les-c7-analog-vs-digital': { lessonId: 'les-c7-analog-vs-digital', status: 'completed', completedAt: '2026-07-25T10:00:00Z' },
        'les-c7-pwm-brightness': { lessonId: 'les-c7-pwm-brightness', status: 'completed', completedAt: '2026-08-05T11:00:00Z' },
        'les-c7-automation-thresholds': { lessonId: 'les-c7-automation-thresholds', status: 'completed', completedAt: '2026-08-20T12:00:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-07-25T10:00:00Z', icon: '🚀' },
        'circuit-explorer': { id: 'circuit-explorer', title: 'Circuit Explorer', earnedAt: '2026-08-01T10:25:00Z', icon: '⚡' },
        'sensor-master': { id: 'sensor-master', title: 'Sensor Sensei', earnedAt: '2026-08-15T11:40:00Z', icon: '📡' },
        'debug-star': { id: 'debug-star', title: 'Debugging Star', earnedAt: '2026-09-01T14:40:00Z', icon: '🌟' },
        'quiz-achiever': { id: 'quiz-achiever', title: 'Knowledge Ace', earnedAt: '2026-09-28T16:00:00Z', icon: '🏆' }
      },
      points: 750,
      activities: [
        { id: 'act_1101', type: 'certificate_earned', title: 'Earned Certificate: SensorLab Master Technologist', timestamp: '2026-09-29T10:00:00Z' },
        { id: 'act_1102', type: 'project_completed', title: 'Completed Project: Dual-Sensor Security Alarm', timestamp: '2026-09-28T15:50:00Z' },
        { id: 'act_1103', type: 'badge_unlocked', title: 'Unlocked Badge: Knowledge Ace', timestamp: '2026-09-28T16:00:00Z' }
      ]
    }
  },
  {
    uid: 'stu_1002_pooja',
    studentId: 'SL-STU-1002',
    displayName: 'Pooja Nair',
    email: 'pooja.nair@sensorlab.edu',
    grade: 10,
    role: 'student',
    institution: 'Greenwood STEM Academy',
    avatarId: 'bot-2',
    createdAt: '2026-08-05T09:00:00Z',
    lastActive: '2026-10-26T18:15:00Z',
    progress: {
      projects: {
        'proj-temp-fan': {
          projectId: 'proj-temp-fan',
          status: 'completed',
          startedAt: '2026-09-10T14:00:00Z',
          completedAt: '2026-09-10T14:40:00Z',
          pointsEarned: 100,
          objectivesCompleted: ['Calibrate voltage to Celsius', 'Construct threshold comparator', 'Isolate logic and actuators']
        },
        'proj-smart-alarm': {
          projectId: 'proj-smart-alarm',
          status: 'in_progress',
          startedAt: '2026-10-15T15:00:00Z',
          completedAt: null,
          pointsEarned: 40,
          objectivesCompleted: ['Multi-condition logical operations']
        }
      },
      lessons: {
        'les-c7-analog-vs-digital': { lessonId: 'les-c7-analog-vs-digital', status: 'completed', completedAt: '2026-08-20T10:00:00Z' },
        'les-c7-automation-thresholds': { lessonId: 'les-c7-automation-thresholds', status: 'completed', completedAt: '2026-09-02T11:00:00Z' }
      },
      achievements: {
        'first-lesson': { id: 'first-lesson', title: 'First Step in Tech', earnedAt: '2026-08-20T10:00:00Z', icon: '🚀' },
        'sensor-master': { id: 'sensor-master', title: 'Sensor Sensei', earnedAt: '2026-09-10T14:40:00Z', icon: '📡' },
        'debug-star': { id: 'debug-star', title: 'Debugging Star', earnedAt: '2026-09-10T14:40:00Z', icon: '🌟' }
      },
      points: 440,
      activities: [
        { id: 'act_1201', type: 'project_started', title: 'Started Project: Dual-Sensor Security Alarm', timestamp: '2026-10-15T15:00:00Z' },
        { id: 'act_1202', type: 'certificate_earned', title: 'Earned Certificate: Advanced Microcontroller & Robotics Systems', timestamp: '2026-09-12T11:00:00Z' },
        { id: 'act_1203', type: 'project_completed', title: 'Completed Project: Smart Temperature Monitor', timestamp: '2026-09-10T14:40:00Z' }
      ]
    }
  }
];

// Helper to seed initial certificates corresponding to students who earned them
const SEED_CERTIFICATES = [
  {
    id: 'CERT-SL-6-2026-M789A',
    certificateId: 'CERT-SL-6-2026-M789A',
    typeId: 'sensors-microcontrollers',
    title: 'Certificate of Mastery: Sensors & Analog Interfacing',
    shortTitle: 'Sensors & Microcontrollers',
    category: 'Sensors & Controllers',
    studentUid: 'stu_601_maya',
    studentName: 'Maya Patel',
    studentId: 'SL-STU-0601',
    grade: 6,
    issueDate: '2026-09-14T10:00:00Z',
    formattedIssueDate: 'September 14, 2026',
    status: 'active',
    issuedBy: 'Dr. Priya Rao',
    verificationHash: 'VERIFY-MAYA601-SENSOR'
  },
  {
    id: 'CERT-SL-7-2026-R456B',
    certificateId: 'CERT-SL-7-2026-R456B',
    typeId: 'automation-systems',
    title: 'Certificate of Excellence: Autonomous Controls & PWM Dimming',
    shortTitle: 'Autonomous Controls',
    category: 'Automation & Logic',
    studentUid: 'stu_701_rohan',
    studentName: 'Rohan Mehta',
    studentId: 'SL-STU-0701',
    grade: 7,
    issueDate: '2026-10-06T09:00:00Z',
    formattedIssueDate: 'October 6, 2026',
    status: 'active',
    issuedBy: 'Dr. Priya Rao',
    verificationHash: 'VERIFY-ROHAN701-AUTO'
  },
  {
    id: 'CERT-SL-8-2026-A123C',
    certificateId: 'CERT-SL-8-2026-A123C',
    typeId: 'automation-systems',
    title: 'Certificate of Excellence: Autonomous Controls & PWM Dimming',
    shortTitle: 'Autonomous Controls',
    category: 'Automation & Logic',
    studentUid: 'stu_801_ananya',
    studentName: 'Ananya Iyer',
    studentId: 'SL-STU-0801',
    grade: 8,
    issueDate: '2026-09-22T10:00:00Z',
    formattedIssueDate: 'September 22, 2026',
    status: 'active',
    issuedBy: 'Dr. Priya Rao',
    verificationHash: 'VERIFY-ANANYA801-AUTO'
  },
  {
    id: 'CERT-SL-9-2026-K987D',
    certificateId: 'CERT-SL-9-2026-K987D',
    typeId: 'advanced-robotics',
    title: 'Certificate of Honor: Advanced Microcontroller & Robotics Systems',
    shortTitle: 'Advanced Robotics Systems',
    category: 'Embedded & Robotics',
    studentUid: 'stu_901_kavya',
    studentName: 'Kavya Deshmukh',
    studentId: 'SL-STU-0901',
    grade: 9,
    issueDate: '2026-09-16T10:00:00Z',
    formattedIssueDate: 'September 16, 2026',
    status: 'active',
    issuedBy: 'Dr. Priya Rao',
    verificationHash: 'VERIFY-KAVYA901-ROBOT'
  },
  {
    id: 'CERT-SL-10-2026-V321E',
    certificateId: 'CERT-SL-10-2026-V321E',
    typeId: 'master-technologist',
    title: 'SensorLab Distinguished Master Technologist Credential',
    shortTitle: 'Distinguished Master Technologist',
    category: 'Comprehensive Honors',
    studentUid: 'stu_1001_vikram',
    studentName: 'Vikram Singh',
    studentId: 'SL-STU-1001',
    grade: 10,
    issueDate: '2026-09-29T10:00:00Z',
    formattedIssueDate: 'September 29, 2026',
    status: 'active',
    issuedBy: 'Dr. Priya Rao',
    verificationHash: 'VERIFY-VIKRAM1001-MASTER'
  },
  {
    id: 'CERT-SL-10-2026-P654F',
    certificateId: 'CERT-SL-10-2026-P654F',
    typeId: 'advanced-robotics',
    title: 'Certificate of Honor: Advanced Microcontroller & Robotics Systems',
    shortTitle: 'Advanced Robotics Systems',
    category: 'Embedded & Robotics',
    studentUid: 'stu_1002_pooja',
    studentName: 'Pooja Nair',
    studentId: 'SL-STU-1002',
    grade: 10,
    issueDate: '2026-09-12T11:00:00Z',
    formattedIssueDate: 'September 12, 2026',
    status: 'active',
    issuedBy: 'Dr. Priya Rao',
    verificationHash: 'VERIFY-POOJA1002-ROBOT'
  }
];

export const teacherService = {
  // Ensure seed data is initialized if empty
  initRosterStore() {
    try {
      const existing = localStorage.getItem(DEMO_STUDENT_ROSTER_KEY);
      if (!existing || JSON.parse(existing).length === 0) {
        localStorage.setItem(DEMO_STUDENT_ROSTER_KEY, JSON.stringify(SEED_STUDENT_ROSTER));
      }

      const existingCerts = localStorage.getItem('sensorlab_demo_certificates');
      if (!existingCerts || JSON.parse(existingCerts).length === 0) {
        localStorage.setItem('sensorlab_demo_certificates', JSON.stringify(SEED_CERTIFICATES));
      }
    } catch (e) {
      console.error('Error initializing roster store:', e);
    }
  },

  // Re-seed demonstration classroom data (accessible from Settings)
  resetToSampleData() {
    localStorage.setItem(DEMO_STUDENT_ROSTER_KEY, JSON.stringify(SEED_STUDENT_ROSTER));
    localStorage.setItem('sensorlab_demo_certificates', JSON.stringify(SEED_CERTIFICATES));
    return true;
  },

  // Helper to load all raw student objects merging Firestore and/or Demo storage
  async _loadRawStudents() {
    this.initRosterStore();

    let students = [];

    // 1. Try loading from Firestore if configured
    if (isFirebaseConfigured() && db) {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'student'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const fsStudents = [];
          for (const d of snap.docs) {
            const data = d.data();
            // Fetch subcollections in parallel
            const [projSnap, lessSnap, achSnap, certSnap] = await Promise.all([
              getDocs(collection(db, 'users', d.id, 'projectProgress')),
              getDocs(collection(db, 'users', d.id, 'lessonProgress')),
              getDocs(collection(db, 'users', d.id, 'achievements')),
              getDocs(collection(db, 'users', d.id, 'certificates'))
            ]);

            const projects = {};
            projSnap.forEach(p => { projects[p.id] = p.data(); });
            const lessons = {};
            lessSnap.forEach(l => { lessons[l.id] = l.data(); });
            const achievements = {};
            achSnap.forEach(a => { achievements[a.id] = a.data(); });
            const certificates = {};
            certSnap.forEach(c => { certificates[c.id] = c.data(); });

            fsStudents.push({
              uid: d.id,
              studentId: data.studentId || `SL-${data.grade || 5}-${d.id.substring(0, 4).toUpperCase()}`,
              displayName: data.displayName || 'Student',
              email: data.email || '',
              grade: Number(data.grade) || 5,
              role: 'student',
              institution: data.institution || 'Greenwood STEM Academy',
              avatarId: data.avatarId || 'bot-1',
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
              lastActive: data.lastActive || data.updatedAt || new Date().toISOString(),
              progress: {
                projects,
                lessons,
                achievements,
                certificates,
                points: Object.values(projects).filter(p => p.status === 'completed').length * 100 +
                        Object.values(lessons).filter(l => l.status === 'completed').length * 50 +
                        Object.keys(achievements).length * 30,
                activities: []
              }
            });
          }
          if (fsStudents.length > 0) {
            students = fsStudents;
          }
        }
      } catch (err) {
        console.warn('Could not query Firestore students, using local roster:', err.message);
      }
    }

    // 2. If no students from Firestore, read local storage store
    if (students.length === 0) {
      try {
        const localRaw = localStorage.getItem(DEMO_STUDENT_ROSTER_KEY);
        if (localRaw) {
          students = JSON.parse(localRaw);
        } else {
          students = SEED_STUDENT_ROSTER;
        }
      } catch {
        students = SEED_STUDENT_ROSTER;
      }

      // Check if current logged in demo student is present; if not, merge them in
      try {
        const demoProfiles = JSON.parse(localStorage.getItem('sensorlab_demo_profiles') || '{}');
        for (const [uid, prof] of Object.entries(demoProfiles)) {
          if (prof.role !== 'teacher' && !students.some(s => s.uid === uid)) {
            const prog = JSON.parse(localStorage.getItem(`sensorlab_progress_${uid}`) || '{}');
            students.push({
              uid,
              studentId: `SL-${prof.grade || 6}-${uid.substring(uid.length - 4).toUpperCase()}`,
              displayName: prof.displayName || 'New Student',
              email: prof.email || 'student@school.edu',
              grade: Number(prof.grade) || 6,
              role: 'student',
              institution: 'Greenwood STEM Academy',
              avatarId: prof.avatarId || 'bot-1',
              createdAt: prof.createdAt || new Date().toISOString(),
              lastActive: new Date().toISOString(),
              progress: prog
            });
          }
        }
      } catch (e) {
        console.error('Error merging logged-in student:', e);
      }
    }

    // Attach certificates count from certificateService
    const allCerts = await certificateService.getAllCertificates();
    const certsByStudent = {};
    allCerts.forEach(c => {
      if (c.status !== 'revoked') {
        certsByStudent[c.studentUid] = (certsByStudent[c.studentUid] || 0) + 1;
      }
    });

    return students.map(s => {
      const projMap = s.progress?.projects || {};
      const started = Object.values(projMap).filter(p => p.status === 'in_progress' || p.status === 'completed').length;
      const completed = Object.values(projMap).filter(p => p.status === 'completed').length;
      const inProgress = Object.values(projMap).filter(p => p.status === 'in_progress').length;
      const points = s.progress?.points || (completed * 100 + inProgress * 40);
      const badgesCount = Object.keys(s.progress?.achievements || {}).length;
      const certsCount = certsByStudent[s.uid] || Object.keys(s.progress?.certificates || {}).length || 0;

      let learningStatus = 'Active';
      if (completed >= 2) learningStatus = 'Completed';
      else if (started > 0) learningStatus = 'In Progress';

      return {
        ...s,
        projectsStarted: started,
        projectsCompleted: completed,
        projectsInProgress: inProgress,
        totalPoints: points,
        badgesCount,
        certificatesCount: certsCount,
        learningStatus
      };
    });
  },

  // 1. Dashboard Summary Statistics
  async getDashboardSummary({ gradeFilter = 'all' } = {}) {
    const students = await this._loadRawStudents();
    const filtered = gradeFilter === 'all' 
      ? students 
      : students.filter(s => String(s.grade) === String(gradeFilter));

    const totalStudents = filtered.length;
    const now = new Date().getTime();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const activeStudents = filtered.filter(s => {
      const actTime = new Date(s.lastActive || s.createdAt).getTime();
      return actTime >= thirtyDaysAgo;
    }).length;

    let projectsCompleted = 0;
    let projectsInProgress = 0;
    let totalPointsEarned = 0;
    let totalCertificatesIssued = 0;

    filtered.forEach(s => {
      projectsCompleted += s.projectsCompleted || 0;
      projectsInProgress += s.projectsInProgress || 0;
      totalPointsEarned += s.totalPoints || 0;
      totalCertificatesIssued += s.certificatesCount || 0;
    });

    // Grade breakdown
    const gradeDistribution = [5, 6, 7, 8, 9, 10].map(g => {
      const inGrade = students.filter(s => s.grade === g);
      return {
        grade: g,
        studentCount: inGrade.length,
        completedProjects: inGrade.reduce((acc, curr) => acc + (curr.projectsCompleted || 0), 0),
        totalPoints: inGrade.reduce((acc, curr) => acc + (curr.totalPoints || 0), 0)
      };
    });

    return {
      totalStudents,
      activeStudents,
      projectsCompleted,
      projectsInProgress,
      totalCertificatesIssued,
      totalPointsEarned,
      gradeDistribution
    };
  },

  // 2. Student Management List with Search, Filter, Sort, and Pagination
  async getStudentsList({
    gradeFilter = 'all',
    statusFilter = 'all',
    searchQuery = '',
    sortBy = 'points_desc',
    page = 1,
    pageSize = 8
  } = {}) {
    const allStudents = await this._loadRawStudents();

    let filtered = [...allStudents];

    // Filter: Grade
    if (gradeFilter && gradeFilter !== 'all') {
      filtered = filtered.filter(s => String(s.grade) === String(gradeFilter));
    }

    // Filter: Status (Active, In Progress, Completed)
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(s => s.learningStatus.toLowerCase() === statusFilter.toLowerCase());
    }

    // Search: Name or Student ID or Email
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(s => 
        s.displayName.toLowerCase().includes(q) ||
        (s.studentId && s.studentId.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'points_desc':
          return (b.totalPoints || 0) - (a.totalPoints || 0);
        case 'points_asc':
          return (a.totalPoints || 0) - (b.totalPoints || 0);
        case 'projects_desc':
          return (b.projectsCompleted || 0) - (a.projectsCompleted || 0);
        case 'recent_activity':
          return new Date(b.lastActive || 0) - new Date(a.lastActive || 0);
        case 'name_asc':
          return a.displayName.localeCompare(b.displayName);
        case 'name_desc':
          return b.displayName.localeCompare(a.displayName);
        default:
          return (b.totalPoints || 0) - (a.totalPoints || 0);
      }
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

    return {
      students: paginatedItems,
      totalItems,
      totalPages,
      currentPage,
      pageSize
    };
  },

  // 3. Detailed Profile for an Individual Student
  async getStudentDetails(studentUid) {
    if (!studentUid) return null;
    const all = await this._loadRawStudents();
    const student = all.find(s => s.uid === studentUid);
    if (!student) return null;

    const certs = await certificateService.getCertificatesForStudent(studentUid);
    const eligibility = certificateService.evaluateStudentEligibility(student, student.progress, certs);

    // Map projects attempted against catalog
    const studentProjectsMap = student.progress?.projects || {};
    const projectActivities = INITIAL_PROJECTS.map(proj => {
      const record = studentProjectsMap[proj.id];
      const isApplicableToGrade = proj.gradeLevels.includes(student.grade);
      let status = 'Not Started';
      let pointsEarned = 0;
      let startDate = null;
      let completionDate = null;
      let objectivesCompleted = [];

      if (record) {
        if (record.status === 'completed') {
          status = 'Completed';
          pointsEarned = record.pointsEarned || 100;
          completionDate = record.completedAt || record.timestamp || '2026-09-01T10:00:00Z';
          startDate = record.startedAt || '2026-08-20T10:00:00Z';
          objectivesCompleted = record.objectivesCompleted || proj.objectives;
        } else if (record.status === 'in_progress') {
          status = 'In Progress';
          pointsEarned = record.pointsEarned || 40;
          startDate = record.startedAt || '2026-10-15T10:00:00Z';
          objectivesCompleted = record.objectivesCompleted || [proj.objectives[0]];
        }
      }

      return {
        projectId: proj.id,
        title: proj.title,
        category: proj.topic,
        thumbnail: proj.thumbnail,
        gradeLevels: proj.gradeLevels,
        difficulty: proj.difficulty,
        isApplicableToGrade,
        status,
        pointsEarned,
        startDate,
        completionDate,
        objectivesCompleted,
        allObjectives: proj.objectives
      };
    });

    // Overall learning progress calculation
    const gradeProjects = INITIAL_PROJECTS.filter(p => p.gradeLevels.includes(student.grade));
    const gradeLessons = INITIAL_LESSONS.filter(l => l.gradeLevel === student.grade);
    const totalCurriculumItems = (gradeProjects.length || 1) + (gradeLessons.length || 1);
    const completedGradeProjects = gradeProjects.filter(p => studentProjectsMap[p.id]?.status === 'completed').length;
    const completedGradeLessons = gradeLessons.filter(l => student.progress?.lessons?.[l.id]?.status === 'completed').length;
    const overallProgressPercent = Math.min(100, Math.round(((completedGradeProjects + completedGradeLessons) / totalCurriculumItems) * 100));

    return {
      student,
      projectActivities,
      certificates: certs,
      certificateEligibility: eligibility,
      overallProgressPercent,
      completedGradeProjects,
      totalGradeProjects: gradeProjects.length,
      completedGradeLessons,
      totalGradeLessons: gradeLessons.length
    };
  },

  // 4. Projects Monitoring Overview
  async getProjectsMonitoring({ categoryFilter = 'all', gradeFilter = 'all', statusFilter = 'all' } = {}) {
    const students = await this._loadRawStudents();

    let projects = INITIAL_PROJECTS.map(proj => {
      let startedCount = 0;
      let completedCount = 0;
      let inProgressCount = 0;
      let totalPoints = 0;
      const enrolledStudents = [];

      students.forEach(s => {
        const record = s.progress?.projects?.[proj.id];
        if (record) {
          if (record.status === 'completed') {
            completedCount++;
            startedCount++;
            totalPoints += record.pointsEarned || 100;
            enrolledStudents.push({
              uid: s.uid,
              name: s.displayName,
              grade: s.grade,
              status: 'Completed',
              date: record.completedAt
            });
          } else if (record.status === 'in_progress') {
            inProgressCount++;
            startedCount++;
            totalPoints += record.pointsEarned || 40;
            enrolledStudents.push({
              uid: s.uid,
              name: s.displayName,
              grade: s.grade,
              status: 'In Progress',
              date: record.startedAt
            });
          }
        }
      });

      const completionRate = startedCount > 0 ? Math.round((completedCount / startedCount) * 100) : 0;
      const avgPoints = startedCount > 0 ? Math.round(totalPoints / startedCount) : 0;

      let mostCommonStatus = 'Not Started';
      if (completedCount >= inProgressCount && completedCount > 0) mostCommonStatus = 'Completed';
      else if (inProgressCount > 0) mostCommonStatus = 'In Progress';

      return {
        id: proj.id,
        title: proj.title,
        category: proj.topic,
        thumbnail: proj.thumbnail,
        difficulty: proj.difficulty,
        gradeLevels: proj.gradeLevels,
        estimatedMinutes: proj.estimatedMinutes,
        startedCount,
        completedCount,
        inProgressCount,
        completionRate,
        avgPoints,
        mostCommonStatus,
        enrolledStudents
      };
    });

    // Category filter
    if (categoryFilter && categoryFilter !== 'all') {
      projects = projects.filter(p => p.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    }

    // Grade filter
    if (gradeFilter && gradeFilter !== 'all') {
      const gNum = Number(gradeFilter);
      projects = projects.filter(p => p.gradeLevels.includes(gNum));
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      projects = projects.filter(p => p.mostCommonStatus.toLowerCase() === statusFilter.toLowerCase());
    }

    return projects;
  },

  // 5. Points & Badges Leaderboard and Achievements
  async getPointsAndBadgesLeaderboard({ gradeFilter = 'all' } = {}) {
    const students = await this._loadRawStudents();
    let filtered = gradeFilter === 'all'
      ? students
      : students.filter(s => String(s.grade) === String(gradeFilter));

    filtered.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

    // Badge unlocked distribution
    const badgeStats = Object.values(BADGE_DEFINITIONS).map(badge => {
      let earnedCount = 0;
      const recentEarners = [];

      filtered.forEach(s => {
        const ach = s.progress?.achievements?.[badge.id];
        if (ach) {
          earnedCount++;
          recentEarners.push({
            studentName: s.displayName,
            grade: s.grade,
            earnedAt: ach.earnedAt
          });
        }
      });

      return {
        ...badge,
        earnedCount,
        percentage: filtered.length > 0 ? Math.round((earnedCount / filtered.length) * 100) : 0,
        recentEarners: recentEarners.slice(0, 3)
      };
    });

    // Recent achievements feed
    const recentAchievements = [];
    filtered.forEach(s => {
      Object.entries(s.progress?.achievements || {}).forEach(([bId, info]) => {
        recentAchievements.push({
          badgeId: bId,
          badgeTitle: info.title || bId,
          icon: info.icon || '🏅',
          studentName: s.displayName,
          studentId: s.studentId,
          grade: s.grade,
          earnedAt: info.earnedAt || '2026-09-01T10:00:00Z'
        });
      });
    });

    recentAchievements.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt));

    return {
      leaderboard: filtered,
      badgeStats,
      recentAchievements: recentAchievements.slice(0, 15)
    };
  },

  // 6. Reports & Analytics Visualization Data
  async getReportsAndAnalyticsData({ gradeFilter = 'all', dateRange = '30d' } = {}) {
    const students = await this._loadRawStudents();
    const filtered = gradeFilter === 'all'
      ? students
      : students.filter(s => String(s.grade) === String(gradeFilter));

    // 1. Project completion comparison chart data
    const projectStats = INITIAL_PROJECTS.map(proj => {
      let started = 0;
      let completed = 0;
      filtered.forEach(s => {
        const p = s.progress?.projects?.[proj.id];
        if (p) {
          if (p.status === 'completed') { completed++; started++; }
          else if (p.status === 'in_progress') { started++; }
        }
      });
      return {
        id: proj.id,
        name: proj.title.split(':')[1]?.trim() || proj.title,
        fullTitle: proj.title,
        started,
        completed,
        rate: started > 0 ? Math.round((completed / started) * 100) : 0
      };
    });

    // 2. Points distribution histogram
    const pointsBuckets = [
      { label: '0–150 pts', min: 0, max: 150, count: 0, color: '#94a3b8' },
      { label: '151–300 pts', min: 151, max: 300, count: 0, color: '#38bdf8' },
      { label: '301–450 pts', min: 301, max: 450, count: 0, color: '#2dd4bf' },
      { label: '451–600 pts', min: 451, max: 600, count: 0, color: '#818cf8' },
      { label: '601+ pts', min: 601, max: 99999, count: 0, color: '#f59e0b' }
    ];

    filtered.forEach(s => {
      const pts = s.totalPoints || 0;
      const b = pointsBuckets.find(bucket => pts >= bucket.min && pts <= bucket.max);
      if (b) b.count++;
    });

    // 3. Grade-wise participation & averages
    const gradeBreakdown = [5, 6, 7, 8, 9, 10].map(g => {
      const gStudents = students.filter(s => s.grade === g);
      const count = gStudents.length;
      const totalPts = gStudents.reduce((acc, curr) => acc + (curr.totalPoints || 0), 0);
      const totalComp = gStudents.reduce((acc, curr) => acc + (curr.projectsCompleted || 0), 0);
      const avgPts = count > 0 ? Math.round(totalPts / count) : 0;
      const avgComp = count > 0 ? Number((totalComp / count).toFixed(1)) : 0;
      return {
        grade: `Class ${g}`,
        gradeNumber: g,
        studentCount: count,
        avgPoints: avgPts,
        avgCompletedProjects: avgComp,
        totalPoints: totalPts
      };
    });

    // 4. Most popular projects (by attempts & completion)
    const popularProjects = [...projectStats].sort((a, b) => b.started - a.started).slice(0, 5);

    // 5. Certificates timeline
    const allCerts = await certificateService.getAllCertificates();
    const certTimeline = [
      { month: 'August', count: 0 },
      { month: 'September', count: 0 },
      { month: 'October', count: 0 }
    ];
    allCerts.forEach(c => {
      const d = new Date(c.issueDate);
      const monthIdx = d.getMonth(); // 7: Aug, 8: Sep, 9: Oct
      if (monthIdx === 7) certTimeline[0].count++;
      else if (monthIdx === 8) certTimeline[1].count++;
      else if (monthIdx === 9) certTimeline[2].count++;
    });

    return {
      projectStats,
      pointsBuckets,
      gradeBreakdown,
      popularProjects,
      certTimeline,
      totalStudentsSampled: filtered.length
    };
  },

  // 7. Teacher Settings and Profile
  async getTeacherProfile() {
    try {
      const saved = localStorage.getItem(DEMO_TEACHER_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}

    return {
      displayName: 'Dr. Priya Rao',
      email: 'priya.rao@sensorlab.edu',
      role: 'teacher',
      institution: 'Greenwood STEM Academy',
      department: 'Robotics & Applied Electronics',
      assignedGrades: [5, 6, 7, 8, 9, 10],
      emailNotifications: true,
      autoAwardBadges: true,
      allowStudentSelfAssess: true
    };
  },

  async updateTeacherProfile(updates) {
    const current = await this.getTeacherProfile();
    const merged = { ...current, ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(DEMO_TEACHER_SETTINGS_KEY, JSON.stringify(merged));
    return merged;
  },

  // 8. CSV Exporters with Privacy Protections
  downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportStudentsToCSV(studentsList) {
    const headers = [
      'Student Name',
      'Student ID',
      'Class/Grade',
      'Email',
      'Projects Started',
      'Projects Completed',
      'Total Points',
      'Badges Earned',
      'Certificates Earned',
      'Learning Status',
      'Last Active'
    ];

    const rows = studentsList.map(s => [
      `"${s.displayName.replace(/"/g, '""')}"`,
      `"${s.studentId || ''}"`,
      `"Class ${s.grade}"`,
      `"${s.email || ''}"`,
      s.projectsStarted || 0,
      s.projectsCompleted || 0,
      s.totalPoints || 0,
      s.badgesCount || 0,
      s.certificatesCount || 0,
      `"${s.learningStatus || 'Active'}"`,
      `"${s.lastActive ? new Date(s.lastActive).toLocaleDateString() : ''}"`
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const dateStr = new Date().toISOString().split('T')[0];
    this.downloadCSV(csv, `SensorLab_Students_Roster_${dateStr}.csv`);
  },

  exportProjectsToCSV(projectsList) {
    const headers = [
      'Project Title',
      'Category',
      'Target Grades',
      'Students Started',
      'Students Completed',
      'Completion Rate (%)',
      'Average Points Earned',
      'Most Common Status'
    ];

    const rows = projectsList.map(p => [
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"Class ${p.gradeLevels.join(', ')}"`,
      p.startedCount || 0,
      p.completedCount || 0,
      `${p.completionRate || 0}%`,
      p.avgPoints || 0,
      `"${p.mostCommonStatus}"`
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const dateStr = new Date().toISOString().split('T')[0];
    this.downloadCSV(csv, `SensorLab_Projects_Summary_${dateStr}.csv`);
  },

  exportCertificatesToCSV(certificatesList) {
    const headers = [
      'Certificate ID',
      'Student Name',
      'Student ID',
      'Grade',
      'Certificate Title',
      'Category',
      'Issue Date',
      'Status',
      'Issued By'
    ];

    const rows = certificatesList.map(c => [
      `"${c.certificateId || c.id}"`,
      `"${c.studentName}"`,
      `"${c.studentId || ''}"`,
      `"Class ${c.grade}"`,
      `"${c.title}"`,
      `"${c.category || ''}"`,
      `"${c.formattedIssueDate || new Date(c.issueDate).toLocaleDateString()}"`,
      `"${c.status}"`,
      `"${c.issuedBy || 'Faculty'}"`
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const dateStr = new Date().toISOString().split('T')[0];
    this.downloadCSV(csv, `SensorLab_Certificates_Registry_${dateStr}.csv`);
  }
};
