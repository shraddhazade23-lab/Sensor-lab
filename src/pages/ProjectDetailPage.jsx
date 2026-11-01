import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService.js';
import { useProgress } from '../contexts/ProgressContext.jsx';
import { useAssistant } from '../contexts/AssistantContext.jsx';
import {
  Layers,
  ArrowLeft,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Check,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { progress, markProjectDone } = useProgress();
  const { updateAssistantContext } = useAssistant();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMarkingDone, setIsMarkingDone] = useState(false);

  useEffect(() => {
    const fetchProj = async () => {
      setLoading(true);
      const data = await projectService.getProject(projectId);
      setProject(data);
      if (data) {
        updateAssistantContext({ currentProject: data });
      }
      setLoading(false);
    };
    fetchProj();
  }, [projectId]);

  const isCompleted = project && progress.projects[project.id]?.status === 'completed';

  const handleComplete = async () => {
    if (!project) return;
    setIsMarkingDone(true);
    await markProjectDone(project.id);
    setIsMarkingDone(false);
  };

  if (loading || !project) {
    return <div className="py-20 text-center text-sm text-slate-400">Loading project details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link to="/projects" className="flex items-center space-x-1.5 text-teal-600 hover:text-teal-700 font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
        <span className="font-mono bg-slate-100 px-2.5 py-1 rounded-md">
          Class {project.gradeLevels.join(', ')} • {project.difficulty}
        </span>
      </div>

      {/* Project Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">{project.thumbnail}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {project.title}
              </h1>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              {project.description}
            </p>
          </div>

          <Link
            to={`/lab/${project.id}`}
            className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/30 flex items-center space-x-2 shrink-0 transition-all hover:scale-102"
          >
            <Cpu className="w-4 h-4" />
            <span>Launch Virtual Lab</span>
          </Link>
        </div>

        {/* Objectives */}
        <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Lightbulb className="w-4 h-4 text-teal-600" />
            <span>Project Objectives</span>
          </h4>
          <ul className="space-y-1 text-xs text-teal-800">
            {project.objectives.map((obj, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bill of Materials (Components List) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">
          Required Virtual Components
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {project.components.map((c, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                {c.count}x
              </div>
              <span className="font-semibold text-xs text-slate-800">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Connection Instructions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">
          Step-by-Step Wiring Blueprint
        </h3>
        <div className="space-y-3">
          {project.instructions.map((inst, idx) => (
            <div key={idx} className="flex items-start space-x-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium mt-0.5">
                {inst}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting Tips */}
      {project.troubleshootingTips?.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Troubleshooting & Debugging Tips</span>
          </div>
          <ul className="space-y-1.5 text-xs text-amber-900">
            {project.troubleshootingTips.map((tip, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="font-bold text-amber-700">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Footer */}
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
                <span>Project Finished (+100 pts)</span>
              </>
            ) : (
              <span>{isMarkingDone ? 'Saving...' : 'Mark Project Complete (+100 pts)'}</span>
            )}
          </button>

          <Link
            to={`/lab/${project.id}`}
            className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Open in Virtual Lab</span>
          </Link>
        </div>

        {project.quizId && (
          <Link
            to={`/quizzes/${project.quizId}`}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Take Project Quiz (+30 pts)</span>
          </Link>
        )}
      </div>

    </div>
  );
};
