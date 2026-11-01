import { describe, it, expect, beforeEach } from 'vitest';
import { teacherService } from '../services/teacherService.js';
import { certificateService, CERTIFICATE_DEFINITIONS } from '../services/certificateService.js';

describe('Teacher Management & Academic Service', () => {
  beforeEach(() => {
    localStorage.clear();
    teacherService.initRosterStore();
  });

  it('initializes and loads benchmark students roster across Classes 5 to 10', async () => {
    const res = await teacherService.getStudentsList({ pageSize: 50 });
    expect(res.students.length).toBeGreaterThanOrEqual(10);
    
    // Check classes 5 to 10 representation
    const grades = new Set(res.students.map(s => s.grade));
    expect(grades.has(5)).toBe(true);
    expect(grades.has(6)).toBe(true);
    expect(grades.has(7)).toBe(true);
    expect(grades.has(8)).toBe(true);
    expect(grades.has(9)).toBe(true);
    expect(grades.has(10)).toBe(true);
  });

  it('filters students by grade cohort accurately', async () => {
    const class6Res = await teacherService.getStudentsList({ gradeFilter: '6' });
    expect(class6Res.students.length).toBeGreaterThan(0);
    class6Res.students.forEach(s => {
      expect(s.grade).toBe(6);
    });

    const class10Res = await teacherService.getStudentsList({ gradeFilter: '10' });
    expect(class10Res.students.length).toBeGreaterThan(0);
    class10Res.students.forEach(s => {
      expect(s.grade).toBe(10);
    });
  });

  it('searches students by name or student ID', async () => {
    const searchByName = await teacherService.getStudentsList({ searchQuery: 'Maya' });
    expect(searchByName.students.length).toBeGreaterThan(0);
    expect(searchByName.students[0].displayName).toContain('Maya');

    const searchById = await teacherService.getStudentsList({ searchQuery: 'SL-STU-0501' });
    expect(searchById.students.length).toBe(1);
    expect(searchById.students[0].studentId).toBe('SL-STU-0501');
  });

  it('calculates dashboard summary metrics accurately from real student progress', async () => {
    const summary = await teacherService.getDashboardSummary({ gradeFilter: 'all' });
    expect(summary.totalStudents).toBeGreaterThan(0);
    expect(summary.projectsCompleted).toBeGreaterThan(0);
    expect(summary.totalPointsEarned).toBeGreaterThan(0);
    expect(summary.gradeDistribution).toHaveLength(6);
  });

  it('computes project monitoring statistics reusing curriculum project definitions', async () => {
    const projects = await teacherService.getProjectsMonitoring();
    expect(projects.length).toBeGreaterThanOrEqual(8);
    
    const ledProj = projects.find(p => p.id === 'proj-simple-led');
    expect(ledProj).toBeDefined();
    expect(ledProj.startedCount).toBeGreaterThan(0);
    expect(ledProj.completionRate).toBeGreaterThan(0);
  });

  it('ranks students properly on points leaderboard', async () => {
    const res = await teacherService.getPointsAndBadgesLeaderboard();
    expect(res.leaderboard.length).toBeGreaterThan(0);
    for (let i = 0; i < res.leaderboard.length - 1; i++) {
      expect(res.leaderboard[i].totalPoints).toBeGreaterThanOrEqual(res.leaderboard[i + 1].totalPoints);
    }
  });
});

describe('Certificate Service & Criteria Verification', () => {
  beforeEach(() => {
    localStorage.clear();
    teacherService.initRosterStore();
  });

  it('evaluates student criteria prerequisites correctly', () => {
    const student = {
      uid: 'test_student',
      displayName: 'Test Student',
      grade: 6
    };
    const progress = {
      points: 100, // Not enough for minPoints 150
      projects: {
        'proj-simple-led': { status: 'completed' }
      }
    };

    const evaluation = certificateService.evaluateStudentEligibility(student, progress, []);
    const foundation = evaluation.find(e => e.typeId === 'foundation-circuits');
    expect(foundation.isEligible).toBe(false);
    expect(foundation.unmetCriteria.length).toBeGreaterThan(0);

    // Meet points requirement
    progress.points = 200;
    const eligibleEval = certificateService.evaluateStudentEligibility(student, progress, []);
    const eligibleFoundation = eligibleEval.find(e => e.typeId === 'foundation-circuits');
    expect(eligibleFoundation.isEligible).toBe(true);
  });

  it('issues certified credential with unique certificate ID and prevents duplicates', async () => {
    const cert = await certificateService.issueCertificate({
      studentUid: 'stu_test_unique',
      studentName: 'Candidate Test',
      studentId: 'SL-STU-9999',
      grade: 7,
      typeId: 'foundation-circuits',
      issuedByTeacherName: 'Dr. Priya Rao'
    });

    expect(cert.certificateId).toContain('CERT-SL-7');
    expect(cert.status).toBe('active');

    // Attempt duplicate issuance
    await expect(
      certificateService.issueCertificate({
        studentUid: 'stu_test_unique',
        studentName: 'Candidate Test',
        studentId: 'SL-STU-9999',
        grade: 7,
        typeId: 'foundation-circuits'
      })
    ).rejects.toThrow(/already been issued/);
  });

  it('allows administrative revocation of credentials', async () => {
    const cert = await certificateService.issueCertificate({
      studentUid: 'stu_revoke_test',
      studentName: 'Revoke Test',
      studentId: 'SL-STU-8888',
      grade: 8,
      typeId: 'sensors-microcontrollers'
    });

    const success = await certificateService.revokeCertificate(cert.certificateId, 'Testing revocation');
    expect(success).toBe(true);

    const all = await certificateService.getAllCertificates();
    const found = all.find(c => c.certificateId === cert.certificateId);
    expect(found.status).toBe('revoked');
  });
});
