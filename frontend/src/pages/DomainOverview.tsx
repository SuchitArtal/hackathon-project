import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const domainData: Record<string, any> = {
  cpp: {
    title: 'C++',
    description: 'Master the fundamentals and advanced concepts of C++ programming.',
    skills: ['OOP', 'STL', 'Memory Management', 'Algorithms'],
    careers: ['Software Engineer', 'Game Developer', 'Embedded Systems Engineer'],
    roadmaps: ['C++ Roadmap'],
    resources: [
      { type: 'Article', title: 'C++ Basics', link: '#' },
      { type: 'Book', title: 'Effective C++', link: '#' },
      { type: 'Video', title: 'C++ Crash Course', link: '#' },
    ],
    progress: 60,
    badge: true,
  },
  python: {
    title: 'Python',
    description: 'Learn Python for scripting, automation, and data science.',
    skills: ['Scripting', 'Data Analysis', 'Web Development'],
    careers: ['Data Scientist', 'Backend Developer', 'Automation Engineer'],
    roadmaps: ['Python Roadmap'],
    resources: [
      { type: 'Article', title: 'Python for Beginners', link: '#' },
      { type: 'Book', title: 'Fluent Python', link: '#' },
      { type: 'Video', title: 'Python in 1 Hour', link: '#' },
    ],
    progress: 30,
    badge: false,
  },
  // Add more domains as needed
};

export default function DomainOverview() {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const domain = domainData[domainId || 'cpp'] || domainData.cpp;

  useEffect(() => {
    if (domainId === 'cpp') {
      navigate('/roadmap', { replace: true });
    }
  }, [domainId, navigate]);

  if (domainId === 'cpp') return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{domain.title} Domain</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300 max-w-2xl text-center">{domain.description}</p>
      {domainId === 'cpp' && (
        <button
          className="mb-8 px-6 py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white rounded-lg font-semibold text-lg shadow hover:from-cyan-500 hover:to-purple-600 transition"
          onClick={() => navigate('/roadmap')}
        >
          Click here to take a test and get a personalized roadmap
        </button>
      )}
      <div className="flex flex-wrap gap-8 justify-center mb-8 w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 w-72">
          <h2 className="text-lg font-semibold mb-2">Key Skills</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
            {domain.skills.map((skill: string) => <li key={skill}>{skill}</li>)}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 w-72">
          <h2 className="text-lg font-semibold mb-2">Career Paths</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
            {domain.careers.map((career: string) => <li key={career}>{career}</li>)}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 w-72">
          <h2 className="text-lg font-semibold mb-2">Featured Roadmaps</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
            {domain.roadmaps.map((rm: string) => <li key={rm}>{rm}</li>)}
          </ul>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 w-full max-w-2xl mb-8">
        <h2 className="text-lg font-semibold mb-2">Top Resources</h2>
        <ul className="text-gray-700 dark:text-gray-200">
          {domain.resources.map((res: any, i: number) => (
            <li key={i} className="mb-1">
              <span className="font-medium">[{res.type}]</span> <a href={res.link} className="text-cyan-500 hover:underline">{res.title}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-40 h-40 relative">
          <svg className="w-40 h-40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none" />
            <circle
              cx="50" cy="50" r="45"
              stroke="#06b6d4"
              strokeWidth="10"
              fill="none"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - domain.progress / 100)}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900 dark:text-white">{domain.progress}%</span>
        </div>
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">Progress</div>
        {domain.badge && <div className="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white rounded-full font-bold shadow">Domain Badge Earned!</div>}
      </div>
    </div>
  );
} 