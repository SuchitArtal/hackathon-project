import { useState } from 'react';
import { PlayCircle, Star, Home, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Level {
  title: string;
  articles: number;
  problems: number;
  completed: boolean;
  branch?: boolean;
  branchItems?: { title: string; articles: number; problems: number; completed: boolean }[];
}

const initialLevels: Level[] = [
  { title: 'C++ Introduction', articles: 5, problems: 10, completed: false },
  { title: 'Data Types & Variables', articles: 4, problems: 8, completed: false },
  { title: 'Control Flow', articles: 6, problems: 12, completed: false },
  { title: 'Functions', articles: 5, problems: 10, completed: false },
  { title: 'Structure & Classes', articles: 0, problems: 5, completed: false },
  {
    title: 'Level 6',
    articles: 0,
    problems: 0,
    completed: false,
    branch: true,
    branchItems: [
      { title: 'STL Basics', articles: 0, problems: 4, completed: false },
      { title: 'STL Containers', articles: 0, problems: 4, completed: false },
    ],
  },
  { title: 'Advanced C++', articles: 0, problems: 3, completed: false },
];

export default function Roadmap() {
  const [levels, setLevels] = useState<Level[]>(initialLevels);
  const [branches, setBranches] = useState(initialLevels[5].branchItems);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    code: '',
    short: '',
  });
  const navigate = useNavigate();

  // Helper to check if a level is unlocked
  const isLevelUnlocked = (idx: number) => {
    if (idx === 0) return true;
    // For branch, check if previous is completed
    if (levels[idx - 1].branch) {
      // All branches must be completed
      return branches && branches.every(b => b.completed);
    }
    return levels[idx - 1].completed;
  };

  // Helper to check if exam is unlocked
  const isExamUnlocked = () => {
    // All levels and branches must be completed
    const allMain = levels.filter(l => !l.branch).every(l => l.completed);
    const allBranches = branches ? branches.every(b => b.completed) : true;
    return allMain && allBranches;
  };

  // Mark a level as completed and unlock the next
  const onStartLevel = (levelNumber: number) => {
    if (levels[levelNumber].branch) return; // handled separately
    const updated = [...levels];
    updated[levelNumber].completed = true;
    setLevels(updated);
  };

  // Mark a branch as completed
  const onStartBranch = (branchIdx: number) => {
    if (!branches) return;
    const updated = branches.map((b, i) =>
      i === branchIdx ? { ...b, completed: true } : b
    );
    setBranches(updated);
  };

  const onStartExam = () => {
    alert('Starting Exam!');
    // Implement your exam logic here
  };

  // Dummy sidebar data
  const dailyGoal = 7;
  const completedToday = 4;
  const dayStreak = 5;
  const hoursLeft = 3;
  const easy = 12, medium = 7, hard = 3;
  const total = easy + medium + hard;
  const percent = Math.round(((easy + medium) / total) * 100);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Roadmap */}
      <div className="flex-1 flex flex-col items-center py-6 px-2 md:px-8">
        {/* Back button and breadcrumb */}
        <div className="w-full max-w-2xl flex flex-col items-start mb-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-base mb-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="focus:outline-none hover:text-cyan-500 transition"
              aria-label="Go to Dashboard"
            >
              <Home size={20} className="text-gray-400" />
            </button>
            <span className="mx-1">/</span>
            <span className="text-cyan-600 font-semibold">C++</span>
          </div>
        </div>
        {/* Logo and heading */}
        {/* Removed 'ಜ್ಞಾನ Setu' heading and logo image */}
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">C++ Roadmap</h2>
        {/* Test Button and Test Simulation */}
        {!testCompleted && !showTest && (
          <button
            className="mb-8 px-8 py-3 bg-white/80 dark:bg-gray-800 border border-cyan-400/60 rounded-xl font-semibold text-base text-cyan-700 dark:text-cyan-200 shadow hover:shadow-md hover:bg-cyan-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-3"
            onClick={() => setShowTest(true)}
          >
            <span>Start Assessment for Your Personalized Roadmap</span>
            <ArrowRight size={20} className="text-cyan-500 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
        {/* Demo Test Modal/Section */}
        {showTest && !testCompleted && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow max-w-md w-full flex flex-col items-center">
            <h3 className="text-2xl font-extrabold mb-4 text-cyan-600 dark:text-cyan-300">C++ Initial Assessment</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300 text-center">Take this creative demo test to personalize your roadmap!</p>
            {/* Q1: MCQ */}
            <div className="mb-4 w-full">
              <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">1. What is the output of the following code?</label>
              <pre className="bg-gray-100 dark:bg-gray-900 rounded p-2 text-sm mb-2">{`int a = 5;
int b = 10;
printf("%d", a + b);`}</pre>
              <select
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                value={quizAnswers.q1}
                onChange={e => setQuizAnswers(a => ({ ...a, q1: e.target.value }))}
              >
                <option value="">Select an answer</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="510">510</option>
              </select>
            </div>
            {/* Q2: MCQ */}
            <div className="mb-4 w-full">
              <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">2. Which of the following is a valid C++ variable name?</label>
              <select
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                value={quizAnswers.q2}
                onChange={e => setQuizAnswers(a => ({ ...a, q2: e.target.value }))}
              >
                <option value="">Select an answer</option>
                <option value="2ndValue">2ndValue</option>
                <option value="value_2">value_2</option>
                <option value="int">int</option>
                <option value="float value">float value</option>
              </select>
            </div>
            {/* Q3: Output Question */}
            <div className="mb-4 w-full">
              <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">3. What will be the output?</label>
              <pre className="bg-gray-100 dark:bg-gray-900 rounded p-2 text-sm mb-2">{`for(int i=0; i<3; i++) {
  std::cout << i << " ";
}`}</pre>
              <input
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                placeholder="Type the output (e.g., 0 1 2 )"
                value={quizAnswers.q3}
                onChange={e => setQuizAnswers(a => ({ ...a, q3: e.target.value }))}
              />
            </div>
            {/* Coding Question */}
            <div className="mb-4 w-full">
              <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">4. Coding: Write a function to return the sum of two numbers in C++.</label>
              <textarea
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                rows={4}
                placeholder={`int sum(int a, int b) {\n  // your code here\n}`}
                value={quizAnswers.code}
                onChange={e => setQuizAnswers(a => ({ ...a, code: e.target.value }))}
              />
            </div>
            {/* Short Answer */}
            <div className="mb-6 w-full">
              <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">5. In one sentence, why do you want to learn C++?</label>
              <input
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your answer..."
                value={quizAnswers.short}
                onChange={e => setQuizAnswers(a => ({ ...a, short: e.target.value }))}
              />
            </div>
            <button
              className="px-6 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white rounded hover:from-cyan-500 hover:to-purple-600 transition font-semibold text-lg shadow"
              onClick={() => { setTestCompleted(true); setShowTest(false); }}
              disabled={Object.values(quizAnswers).some(v => !v)}
            >
              Submit Test
            </button>
          </div>
        )}
        {/* Show the roadmap only after test is completed */}
        {testCompleted && (
          <div className="relative flex flex-col items-center w-full max-w-md">
            {/* Vertical line connecting levels */}
            <div className="absolute left-1/2 top-8 bottom-8 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 opacity-30 -translate-x-1/2 z-0" />
            {levels.map((level, idx) => {
              // Branching for Level 6
              if (level.branch && branches) {
                const unlocked = isLevelUnlocked(idx);
                return (
                  <div key={idx} className="relative z-10 w-full flex flex-col items-center">
                    <div className="mb-2">
                      <span className="inline-block px-4 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold border border-gray-200 dark:border-gray-700">Level {idx + 1}</span>
                    </div>
                    <div className="flex gap-6 mb-8">
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
                    {/* Connector line between levels */}
                    <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 opacity-30" />
                  </div>
                );
              }
              // Normal level
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
            {/* Exam Section */}
            <div className="relative z-10 w-full flex flex-col items-center mt-8">
              <div className="mb-2">
                <span className="inline-block px-4 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-sm font-semibold border border-yellow-300 dark:border-yellow-700">Exam</span>
              </div>
              <div className={`w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-8 p-6 flex flex-col items-center border-2 ${isExamUnlocked() ? 'border-yellow-400' : 'border-gray-300 dark:border-gray-700 opacity-60'}`}>
                <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">C++ Mastery Exam</h2>
                <p className="mb-4 text-gray-500 dark:text-gray-300 text-sm text-center">Test your knowledge and see if you've mastered the C++ roadmap!</p>
                <button
                  onClick={onStartExam}
                  disabled={!isExamUnlocked()}
                  className={`mt-2 w-24 h-24 flex items-center justify-center rounded-full text-white text-3xl shadow-lg transition ${isExamUnlocked() ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:scale-105' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}
                  aria-label="Start Exam"
                >
                  <PlayCircle size={56} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-8 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Daily Goal</h3>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg h-4 mb-2">
            <div
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-4 rounded-lg transition-all"
              style={{ width: `${(completedToday / dailyGoal) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-300">
            <span>{completedToday} / {dailyGoal} problems</span>
            <span>{dayStreak} day streak</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">{hoursLeft} hours left today</div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Progress</h3>
          {/* Progress ring (simple SVG) */}
          <div className="relative w-24 h-24 mb-2">
            <svg className="w-24 h-24" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none" />
              <circle
                cx="50" cy="50" r="45"
                stroke="url(#gradient)"
                strokeWidth="10"
                fill="none"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - percent / 100)}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a21caf" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white">{percent}%</span>
          </div>
          <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-300">
            <span>Easy: {easy}</span>
            <span>Medium: {medium}</span>
            <span>Hard: {hard}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
