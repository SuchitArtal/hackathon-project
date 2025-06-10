import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, Database, Globe, Cpu } from 'lucide-react';

const domains = [
  {
    id: 'cpp',
    title: 'C++',
    icon: <Code size={32} className="text-cyan-500" />,
    description: 'Master the fundamentals and advanced concepts of C++ programming.'
  },
  {
    id: 'python',
    title: 'Python',
    icon: <BookOpen size={32} className="text-green-500" />,
    description: 'Learn Python for scripting, automation, and data science.'
  },
  {
    id: 'java',
    title: 'Java',
    icon: <Globe size={32} className="text-orange-500" />,
    description: 'Explore Java for enterprise, Android, and backend development.'
  },
  {
    id: 'datascience',
    title: 'Data Science',
    icon: <Database size={32} className="text-purple-500" />,
    description: 'Dive into data analysis, machine learning, and AI.'
  },
  {
    id: 'webdev',
    title: 'Web Development',
    icon: <Cpu size={32} className="text-blue-500" />,
    description: 'Build modern web applications with the latest technologies.'
  },
];

export default function DomainList() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Domains</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {domains.map(domain => (
          <button
            key={domain.id}
            onClick={() => navigate(`/domains/${domain.id}`)}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-cyan-400 hover:shadow-xl transition group w-full"
          >
            <div className="mb-4 group-hover:scale-110 transition-transform">
              {domain.icon}
            </div>
            <div className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {domain.title}
            </div>
            <div className="text-gray-500 dark:text-gray-300 text-center text-sm mb-2">
              {domain.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 