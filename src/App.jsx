import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ProgressProvider } from './contexts/ProgressContext.jsx';
import { AssistantProvider } from './contexts/AssistantContext.jsx';

import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { FloatingAssistant } from './components/assistant/FloatingAssistant.jsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { SignupPage } from './pages/SignupPage.jsx';
import { OnboardingPage } from './pages/OnboardingPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { LearningPage } from './pages/LearningPage.jsx';
import { LessonPage } from './pages/LessonPage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.jsx';
import { VirtualLabPage } from './pages/VirtualLabPage.jsx';
import { QuizPage } from './pages/QuizPage.jsx';
import { AchievementsPage } from './pages/AchievementsPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

// Teacher Dashboard Pages & Layout
import { TeacherProtectedRoute } from './components/teacher/TeacherProtectedRoute.jsx';
import { TeacherLayout } from './components/teacher/TeacherLayout.jsx';
import { TeacherOverviewPage } from './pages/teacher/TeacherOverviewPage.jsx';
import { TeacherStudentsPage } from './pages/teacher/TeacherStudentsPage.jsx';
import { TeacherStudentDetailPage } from './pages/teacher/TeacherStudentDetailPage.jsx';
import { TeacherProjectsPage } from './pages/teacher/TeacherProjectsPage.jsx';
import { TeacherAchievementsPage } from './pages/teacher/TeacherAchievementsPage.jsx';
import { TeacherCertificatesPage } from './pages/teacher/TeacherCertificatesPage.jsx';
import { TeacherReportsPage } from './pages/teacher/TeacherReportsPage.jsx';
import { TeacherSettingsPage } from './pages/teacher/TeacherSettingsPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <AssistantProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            <Navbar />

            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<LoginPage />} />

                {/* Protected Student routes */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <OnboardingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn"
                  element={
                    <ProtectedRoute>
                      <LearningPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:moduleId"
                  element={
                    <ProtectedRoute>
                      <LessonPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <ProjectsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:projectId"
                  element={
                    <ProtectedRoute>
                      <ProjectDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lab"
                  element={
                    <ProtectedRoute>
                      <VirtualLabPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lab/:projectId"
                  element={
                    <ProtectedRoute>
                      <VirtualLabPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quizzes/:quizId"
                  element={
                    <ProtectedRoute>
                      <QuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/achievements"
                  element={
                    <ProtectedRoute>
                      <AchievementsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />

                {/* Teacher Faculty Protected Routes */}
                <Route
                  path="/teacher"
                  element={
                    <TeacherProtectedRoute>
                      <TeacherLayout />
                    </TeacherProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/teacher/overview" replace />} />
                  <Route path="overview" element={<TeacherOverviewPage />} />
                  <Route path="students" element={<TeacherStudentsPage />} />
                  <Route path="students/:studentId" element={<TeacherStudentDetailPage />} />
                  <Route path="projects" element={<TeacherProjectsPage />} />
                  <Route path="achievements" element={<TeacherAchievementsPage />} />
                  <Route path="certificates" element={<TeacherCertificatesPage />} />
                  <Route path="reports" element={<TeacherReportsPage />} />
                  <Route path="settings" element={<TeacherSettingsPage />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />
            <FloatingAssistant />
          </div>
        </AssistantProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}
