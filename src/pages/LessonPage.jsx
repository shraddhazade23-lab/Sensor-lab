import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { lessonService } from '../services/lessonService.js';
import { useProgress } from '../contexts/ProgressContext.jsx';
import { useAssistant } from '../contexts/AssistantContext.jsx';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  HelpCircle,
  Lightbulb,
  Check
} from 'lucide-react';

export const LessonPage = () => {
  const { moduleId } = useParams();
  const [searchParams] = useSearchParams();
  const lessonIdFromUrl = searchParams.get('lesson');
  const navigate = useNavigate();

  const { progress, markLessonDone } = useProgress();
  const { setIsOpen, updateAssistantContext } = useAssistant();

  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMarkingDone, setIsMarkingDone] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      const list = await lessonService.getLessonsByModule(moduleId);
      setLessons(list);

      const target = lessonIdFromUrl
        ? list.find(l => l.id === lessonIdFromUrl) || list[0]
        : list[0];
      setCurrentLesson(target);
      if (target) {
        updateAssistantContext({ currentLesson: target });
      }
      setLoading(false);
    };
    fetchLessons();
  }, [moduleId, lessonIdFromUrl]);

  const isCompleted = currentLesson && progress.lessons[currentLesson.id]?.status === 'completed';

  const handleComplete = async () => {
    if (!currentLesson) return;
    setIsMarkingDone(true);
    await markLessonDone(currentLesson.id);
    setIsMarkingDone(false);
  };

  if (loading || !currentLesson) {
    return <div className="py-20 text-center text-sm text-slate-400">Loading lesson content...</div>;
  }

  // Find next lesson in module
  const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link to="/learn" className="flex items-center space-x-1.5 text-teal-600 hover:text-teal-700 font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Modules</span>
        </Link>
        <span className="font-mono bg-slate-100 px-2.5 py-1 rounded-md">
          Lesson {currentLesson.sortOrder} of {lessons.length}
        </span>
      </div>

      {/* Lesson Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-200">
            Class {currentLesson.gradeLevel}
          </span>
          <span className="text-xs text-slate-400 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentLesson.estimatedMinutes} minutes</span>
          </span>
          {isCompleted && (
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Completed</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {currentLesson.title}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          {currentLesson.introduction}
        </p>

        {/* Learning Objectives */}
        <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Lightbulb className="w-4 h-4 text-teal-600" />
            <span>What You Will Learn in this Lesson</span>
          </h4>
          <ul className="space-y-1 text-xs text-teal-800">
            {currentLesson.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Blocks */}
      <div className="space-y-6">
        {currentLesson.contentBlocks.map((block, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <h3 className="font-extrabold text-lg text-slate-900">{block.heading}</h3>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {block.body}
            </div>
          </div>
        ))}
      </div>

      {/* Hands-on Activity Challenge */}
      {currentLesson.activityInstructions && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-base">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Try It Yourself: Hands-on Activity</span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed">
            {currentLesson.activityInstructions}
          </p>

          {currentLesson.relatedProjectIds?.length > 0 && (
            <div className="pt-2">
              <Link
                to={`/lab/${currentLesson.relatedProjectIds[0]}`}
                className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span>Open Related Virtual Lab Project</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Lesson Action Footer Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handleComplete}
            disabled={isCompleted || isMarkingDone}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4" />
                <span>Lesson Completed (+50 pts)</span>
              </>
            ) : (
              <span>{isMarkingDone ? 'Saving...' : 'Mark Lesson Complete (+50 pts)'}</span>
            )}
          </button>

          {currentLesson.quizId && (
            <Link
              to={`/quizzes/${currentLesson.quizId}`}
              className="w-full sm:w-auto px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Take Quiz</span>
            </Link>
          )}
        </div>

        {nextLesson && (
          <Link
            to={`/learn/${moduleId}?lesson=${nextLesson.id}`}
            className="flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-teal-600 transition-colors"
          >
            <span>Next: {nextLesson.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}

      </div>

    </div>
  );
};
