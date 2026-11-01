import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService.js';
import { useProgress } from '../contexts/ProgressContext.jsx';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { recordQuiz } = useProgress();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      const data = await quizService.getQuiz(quizId);
      setQuiz(data);
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  if (loading || !quiz) {
    return <div className="py-20 text-center text-sm text-slate-400">Loading quiz activity...</div>;
  }

  const currentQ = quiz.questions[currentQuestionIndex];
  const isQuestionAnswered = selectedAnswers[currentQ.id] !== undefined;

  const handleSelectOption = (optionIndex) => {
    if (revealed[currentQ.id]) return; // Already revealed

    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex }));
    setRevealed(prev => ({ ...prev, [currentQ.id]: true }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      quiz.questions.forEach(q => {
        if (selectedAnswers[q.id] === q.correctIndex) {
          correctCount++;
        }
      });
      const finalScore = Math.round((correctCount / quiz.questions.length) * quiz.maxPoints);
      setScore(finalScore);
      setIsFinished(true);

      // Record in progress service
      recordQuiz(quiz.id, finalScore, quiz.maxPoints, quiz.questions.length);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setRevealed({});
    setCurrentQuestionIndex(0);
    setIsFinished(false);
    setScore(0);
  };

  const isPassed = score >= (quiz.maxPoints * 0.7);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1 text-teal-600 hover:text-teal-700 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lesson</span>
        </button>
        <span className="font-mono bg-slate-100 px-2.5 py-1 rounded-md">
          Passing Score: 70%
        </span>
      </div>

      {!isFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          
          {/* Quiz Header */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                Understanding Check
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{quiz.title}</h2>
            </div>
            <span className="text-xs font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {currentQ.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const isRevealed = revealed[currentQ.id];

                let optionStyles = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                if (isRevealed) {
                  if (isCorrect) {
                    optionStyles = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold shadow-xs';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'bg-red-50 border-red-300 text-red-800';
                  } else {
                    optionStyles = 'opacity-50 border-slate-200 bg-slate-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isRevealed}
                    className={`w-full text-left p-4 rounded-2xl border-2 text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyles}`}
                  >
                    <span>{opt}</span>
                    {isRevealed && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {isRevealed && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation reveal */}
          {revealed[currentQ.id] && (
            <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 text-xs text-teal-900 space-y-1 animate-in fade-in">
              <span className="font-bold block text-teal-950">Explanation:</span>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {revealed[currentQ.id] && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center space-x-2 transition-all hover:scale-102"
              >
                <span>{currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Results View */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-50 border border-teal-200 flex items-center justify-center text-4xl shadow-inner">
            {isPassed ? '🏆' : '📚'}
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Quiz Completed</span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isPassed ? 'Fantastic Job!' : 'Good Effort! Review & Try Again'}
            </h2>
            <p className="text-xs text-slate-500">
              You scored <strong className="text-slate-800">{score}</strong> out of <strong className="text-slate-800">{quiz.maxPoints}</strong> points.
            </p>
          </div>

          {isPassed && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-800 font-medium inline-block">
              🎉 +30 Learning Points added to your student profile!
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <button
              onClick={handleRetry}
              className="px-5 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            <Link
              to="/dashboard"
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
