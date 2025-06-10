import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';

interface RoleCardData {
  id: string;
  title: string;
  description: string;
  techStack: string[];
}

const roles: RoleCardData[] = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    description: 'Build beautiful, interactive user interfaces for web applications using modern frameworks.',
    techStack: ['React', 'HTML', 'CSS', 'JavaScript'],
  }
];

export default function Roles() {
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const filteredRoles = roles.filter(role => {
    const searchLower = search.toLowerCase();
    return (
      role.title.toLowerCase().includes(searchLower) ||
      role.description.toLowerCase().includes(searchLower) ||
      role.techStack.some(tech => tech.toLowerCase().includes(searchLower))
    );
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    setSearch(e.target.value);
    // Simulate a small delay to show loading state
    setTimeout(() => setIsSearching(false), 300);
  };

  const clearSearch = () => {
    setSearch('');
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      {/* Navbar */}
      <nav className="flex items-center justify-between max-w-7xl mx-auto mb-8 px-2 sm:px-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </button>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search roles..."
            className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frontend Development Roadmap</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isSearching ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-300">
              Searching...
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-300">
              No roles found matching "{search}"
            </div>
          ) : (
            filteredRoles.map(role => (
              <div
                key={role.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col border border-cyan-100 dark:border-cyan-900 group cursor-pointer hover:-translate-y-1 duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{role.title}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{role.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {role.techStack.map(tech => (
                    <span key={tech} className="bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-2 py-1 rounded-full text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/frontend-roadmap')}
                  className="mt-auto px-5 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-semibold shadow group-hover:scale-105"
                >
                  View Roadmap
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 