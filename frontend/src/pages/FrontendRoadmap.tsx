import { useState, useEffect } from 'react';
import { PlayCircle, Star, Home, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateFrontendQuestions, assessFrontendTest, GeminiResponse, Question } from '../lib/gemini';

interface Level {
  title: string;
  articles: number;
  problems: number;
  completed: boolean;
  branch?: boolean;
  branchItems?: { title: string; articles: number; problems: number; completed: boolean }[];
}

const initialLevels: Level[] = [
  { title: 'HTML Fundamentals', articles: 5, problems: 10, completed: false },
  { title: 'CSS Basics & Layout', articles: 6, problems: 12, completed: false },
  { title: 'JavaScript Essentials', articles: 8, problems: 15, completed: false },
  { title: 'DOM Manipulation', articles: 4, problems: 8, completed: false },
  { title: 'Responsive Design', articles: 5, problems: 10, completed: false },
  {
    title: 'Frontend Frameworks',
    articles: 0,
    problems: 0,
    completed: false,
    branch: true,
    branchItems: [
      { title: 'React Basics', articles: 6, problems: 10, completed: false },
      { title: 'React Advanced', articles: 8, problems: 12, completed: false },
    ],
  },
  { title: 'State Management', articles: 5, problems: 8, completed: false },
  { title: 'Testing & Debugging', articles: 4, problems: 6, completed: false },
  { title: 'Performance Optimization', articles: 3, problems: 5, completed: false },
];

export default function FrontendRoadmap() {
  const [levels, setLevels] = useState<Level[]>(initialLevels);
  const [branches, setBranches] = useState(initialLevels[5].branchItems);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [assessment, setAssessment] = useState<GeminiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Legacy state for compatibility with existing code
  // @ts-ignore - This variable is used in the testData object
  const [quizAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    code: '',
    short: '',
  });

  useEffect(() => {
    // Load assessment from localStorage if it exists
    const savedAssessment = localStorage.getItem('frontendAssessment');
    if (savedAssessment) {
      try {
        setAssessment(JSON.parse(savedAssessment));
        setTestCompleted(true);
      } catch (e) {
        console.error("Failed to parse saved assessment", e);
      }
    }
  }, []);

  const isLevelUnlocked = (idx: number) => {
    if (idx === 0) return true;
    if (levels[idx - 1].branch) {
      return branches && branches.every(b => b.completed);
    }
    return levels[idx - 1].completed;
  };

  const onStartLevel = (levelNumber: number) => {
    if (levels[levelNumber].branch) return;
    const updated = [...levels];
    updated[levelNumber].completed = true;
    setLevels(updated);
  };

  const onStartBranch = (branchIdx: number) => {
    if (!branches) return;
    const updated = branches.map((b, i) =>
      i === branchIdx ? { ...b, completed: true } : b
    );
    setBranches(updated);
  };

  const handleStartTest = async () => {
    setShowTest(true);
    setLoadingQuestions(true);
    setError(null);
    
    try {
      const fetchedQuestions = await generateFrontendQuestions();
      setQuestions(fetchedQuestions);
    } catch (err) {
      setError("Failed to load questions. Please try again later.");
      console.error("Error loading questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmitTest = async () => {
    setLoadingAssessment(true);
    setError(null);
    
    try {
      // Prepare data for assessment
      const testData = {
        questions,
        userAnswers,
        // Include legacy quiz answers for completeness
        additionalInfo: quizAnswers
      };
      
      const result = await assessFrontendTest(testData);
      setAssessment(result);
      setTestCompleted(true);
      setShowTest(false);
      
      // Save assessment to localStorage
      localStorage.setItem('frontendAssessment', JSON.stringify(result));
    } catch (err) {
      setError("Failed to assess your test. Please try again later.");
      console.error("Error assessing test:", err);
    } finally {
      setLoadingAssessment(false);
    }
  };

  const resetTest = () => {
    setShowTest(false);
    setTestCompleted(false);
    setQuestions([]);
    setUserAnswers({});
    setAssessment(null);
    localStorage.removeItem('frontendAssessment');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Roadmap */}
      <div className="flex-1 flex flex-col items-center py-6 px-2 md:px-8">
        {/* Back button and breadcrumb */}
        <div className="w-full max-w-2xl flex flex-col items-start mb-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-base mb-2">
            <button
              onClick={() => navigate('/roles')}
              className="focus:outline-none hover:text-cyan-500 transition"
              aria-label="Go to Roles"
            >
              <Home size={20} className="text-gray-400" />
            </button>
            <span className="mx-1">/</span>
            <span className="text-cyan-600 font-semibold">Frontend Development</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Frontend Development Roadmap</h2>

        {/* Test Button */}
        {!testCompleted && !showTest && (
          <button
            className="mb-8 px-8 py-3 bg-white/80 dark:bg-gray-800 border border-cyan-400/60 rounded-xl font-semibold text-base text-cyan-700 dark:text-cyan-200 shadow hover:shadow-md hover:bg-cyan-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-3"
            onClick={handleStartTest}
          >
            <span>Start Assessment for Your Personalized Roadmap</span>
            <ArrowRight size={20} className="text-cyan-500 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {/* Loading State */}
        {(loadingQuestions || loadingAssessment) && (
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 flex flex-col items-center">
            <Loader2 size={48} className="animate-spin text-cyan-500 mb-4" />
            <p className="text-lg text-gray-700 dark:text-gray-200">
              {loadingQuestions ? "Loading questions..." : "Analyzing your answers..."}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 px-4 py-1 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 text-sm rounded border border-red-200 dark:border-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Gemini-powered Assessment Test */}
        {showTest && !testCompleted && !loadingQuestions && questions.length > 0 && (
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Frontend Development Assessment</h3>
            
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="mb-8">
                <p className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  {qIndex + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <div 
                      key={oIndex}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        userAnswers[qIndex] === oIndex 
                          ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-300 dark:border-cyan-700' 
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleAnswerSelect(qIndex, oIndex)}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name={`question-${qIndex}`} 
                          checked={userAnswers[qIndex] === oIndex}
                          onChange={() => handleAnswerSelect(qIndex, oIndex)}
                          className="mr-2"
                        />
                        <span>{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              className="px-6 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white rounded hover:from-cyan-500 hover:to-purple-600 transition font-semibold text-lg shadow"
              onClick={handleSubmitTest}
              disabled={Object.keys(userAnswers).length < questions.length}
            >
              Submit Assessment
            </button>
          </div>
        )}

        {/* Assessment Results */}
        {testCompleted && assessment && (
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Your Assessment Results</h3>
            
            <div className="flex items-center justify-center my-6">
              <div className="relative w-32 h-32">
                <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-700"></div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{assessment.score}%</span>
                </div>
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="8"
                  />
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="8"
                    strokeDasharray={`${assessment.score * 2.83} 283`} 
                    strokeDashoffset="0" 
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Assessment</h4>
              <p className="text-gray-600 dark:text-gray-300">{assessment.assessment}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Recommendations</h4>
              <p className="text-gray-600 dark:text-gray-300">{assessment.recommendations}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Strengths</h4>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                {assessment.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Areas to Improve</h4>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                {assessment.areas_to_improve.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
            
            <button
              className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition font-semibold"
              onClick={resetTest}
            >
              Retake Assessment
            </button>
          </div>
        )}

        {/* Roadmap Levels */}
        {testCompleted && (
          <div className="relative flex flex-col items-center w-full max-w-md">
            {/* Vertical line connecting levels */}
            <div className="absolute left-1/2 top-8 bottom-8 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 opacity-30 -translate-x-1/2 z-0" />
            
            {levels.map((level, idx) => {
              if (level.branch && branches) {
                const unlocked = isLevelUnlocked(idx);
                return (
                  <div key={idx} className="relative z-10 w-full flex flex-col items-center">
                    <div className="mb-2">
                      <span className="inline-block px-4 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold border border-gray-200 dark:border-gray-700">Level {idx + 1}</span>
                    </div>
                    <div className="flex gap-4">
                      {branches.map((item, bidx) => (
                        <div key={bidx} className={`w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 ${unlocked ? 'border-cyan-400' : 'border-gray-300 dark:border-gray-700 opacity-60'}`}>
                          <h2 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">{item.title}</h2>
                          <div className="flex gap-4 mb-4 text-gray-500 dark:text-gray-300 text-sm">
                            <span>{item.articles} Articles</span>
                            <span>{item.problems} Problems</span>
                          </div>
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={18} className="text-yellow-400 opacity-60" fill="none" />
                            ))}
                          </div>
                          <button
                            disabled={!unlocked || item.completed}
                            onClick={() => onStartBranch(bidx)}
                            className={`mt-2 w-14 h-14 flex items-center justify-center rounded-full text-white text-2xl shadow-lg transition ${unlocked && !item.completed ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 hover:scale-105' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}
                            aria-label={`Start ${item.title}`}
                          >
                            {item.completed ? <span className="text-lg">✓</span> : <PlayCircle size={32} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              const unlocked = isLevelUnlocked(idx);
              return (
                <div key={idx} className="relative z-10 w-full flex flex-col items-center">
                  <div className="mb-2">
                    <span className="inline-block px-4 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold border border-gray-200 dark:border-gray-700">Level {idx + 1}</span>
                  </div>
                  <div className={`w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-8 p-6 flex flex-col items-center border-2 transition-all duration-200 ${unlocked ? 'border-cyan-400' : 'border-gray-300 dark:border-gray-700 opacity-60'}`}>
                    <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">{level.title}</h2>
                    <div className="flex gap-4 mb-4 text-gray-500 dark:text-gray-300 text-sm">
                      <span>{level.articles} Articles</span>
                      <span>{level.problems} Problems</span>
                    </div>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className="text-yellow-400 opacity-60" fill="none" />
                      ))}
                    </div>
                    <button
                      disabled={!unlocked || level.completed}
                      onClick={() => onStartLevel(idx)}
                      className={`mt-2 w-20 h-20 flex items-center justify-center rounded-full text-white text-4xl shadow-lg transition ${unlocked && !level.completed ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 hover:scale-105' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}
                      aria-label={`Start Level ${idx + 1}`}
                    >
                      {level.completed ? <span className="text-2xl">✓</span> : <PlayCircle size={48} />}
                    </button>
                  </div>
                  {/* Connector line between levels */}
                  <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 opacity-30" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 