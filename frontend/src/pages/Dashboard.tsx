import { Globe, Briefcase, PenLine, MessageCircle, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSearchStore } from '../store/search';

interface CardItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dashboardQuery } = useSearchStore();
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if the user came from registration or login
  const from = location.state?.from;
  let message = '';
  if (from === 'register') {
    message = 'Registration successful!';
  } else if (from === 'login') {
    message = 'Login successful!';
  }

  const cards: CardItem[] = [
    {
      id: 'domain',
      icon: <Globe className="w-9 h-9 text-cyan-400" aria-hidden="true" />,
      label: 'Domain',
      path: '/domains'
    },
    {
      id: 'roles',
      icon: <Briefcase className="w-9 h-9 text-blue-500" aria-hidden="true" />,
      label: 'Roles',
      path: '/roles'
    },
    {
      id: 'blogs',
      icon: <PenLine className="w-9 h-9 text-purple-500" aria-hidden="true" />,
      label: 'Blogs',
      path: '/blogs'
    },
    {
      id: 'forum',
      icon: <MessageCircle className="w-9 h-9 text-fuchsia-500" aria-hidden="true" />,
      label: 'Discussion Forum',
      path: '/forum'
    }
  ];

  const handleCardClick = (path: string) => {
    try {
      navigate(path);
    } catch (err) {
      toast.error('Failed to navigate. Please try again.');
    }
  };

  const filteredCards = cards.filter(card =>
    card.label.toLowerCase().includes(dashboardQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-red-500 dark:text-red-400 text-center">
          <p className="text-xl font-semibold mb-2">Something went wrong</p>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-10 px-4">
        {/* Welcome message */}
        {message && (
          <div 
            className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg"
            role="alert"
          >
            {message}
          </div>
        )}
        
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-0 flex flex-col items-center border border-gray-200 dark:border-gray-700">
          {/* Content */}
          <div className="w-full flex flex-col items-center px-4 sm:px-8 py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
              Get roadmaps on these domains or roles etc
            </h1>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-300 mb-8 text-center">
              Get news updates, discussion forums, and more
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center w-full h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full max-w-2xl mb-10">
                {filteredCards.map(card => (
                  <DashboardCard
                    key={card.id}
                    icon={card.icon}
                    label={card.label}
                    onClick={() => handleCardClick(card.path)}
                  />
                ))}
              </div>
            )}

            {/* Continue to Path */}
            <div className="w-full max-w-2xl mb-10 flex justify-center">
              <div className="flex flex-col items-center bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-500/10 dark:from-cyan-900/30 dark:via-blue-900/30 dark:to-purple-900/30 rounded-xl shadow p-6 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-bold text-gray-800 dark:text-white">Continue to Path</span>
                  <ArrowRight className="text-cyan-400" aria-hidden="true" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">Pick up where you left off in your learning journey.</p>
                <Link
                  to="/roadmap"
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white font-semibold text-base transition focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-purple-600"
                  aria-label="Go to Roadmap"
                >
                  Go to Roadmap <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function DashboardCard({ icon, label, onClick }: DashboardCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 sm:p-10 bg-gray-100 dark:bg-gray-700 rounded-xl shadow hover:shadow-xl transition hover:bg-cyan-50 dark:hover:bg-purple-900/30 cursor-pointer group w-full"
      aria-label={`Go to ${label}`}
    >
      <div className="mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-blue-500 group-hover:to-purple-500 group-hover:bg-clip-text transition">
        {label}
      </div>
    </button>
  );
} 