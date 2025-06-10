import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Sparkles, MessageCircle } from 'lucide-react';
import discordIcon from '../assets/discord-icon.svg';
import redditIcon from '../assets/reddit-icon.svg';

interface Thread {
  id: number;
  title: string;
  content: string;
  author: string;
  replies: { author: string; content: string }[];
  tags: string[];
  views: number;
  lastActivity: string;
}

export default function Forum() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [showThreadId, setShowThreadId] = useState<number | null>(null);
  const [newThread, setNewThread] = useState({ title: '', content: '', author: '' });
  const [reply, setReply] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedThreads, setRecommendedThreads] = useState<Thread[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sample threads with more metadata
  const sampleThreads: Thread[] = [
    {
      id: 1,
      title: "How to get started with Python programming?",
      content: "I'm new to programming and want to learn Python. What are the best resources and how should I structure my learning?",
      author: "John Doe",
      replies: [
        { author: "Sarah Smith", content: "I recommend starting with Python for Everybody course on Coursera." },
        { author: "Mike Johnson", content: "Don't forget to practice with small projects!" }
      ],
      tags: ["python", "beginner", "learning"],
      views: 245,
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      title: "Best practices for React state management",
      content: "What are the current best practices for managing state in large React applications?",
      author: "Alice Brown",
      replies: [
        { author: "Tom Wilson", content: "Consider using Redux Toolkit for complex state." }
      ],
      tags: ["react", "javascript", "state-management"],
      views: 189,
      lastActivity: "5 hours ago"
    },
    {
      id: 3,
      title: "Docker vs Kubernetes: When to use what?",
      content: "I'm confused about when to use Docker and when to use Kubernetes. Can someone explain?",
      author: "David Lee",
      replies: [],
      tags: ["docker", "kubernetes", "devops"],
      views: 156,
      lastActivity: "1 day ago"
    }
  ];

  useEffect(() => {
    // Simulate loading threads from an API
    setThreads(sampleThreads);
    // Simulate AI recommendations based on user activity
    setRecommendedThreads(sampleThreads.filter(t => t.views > 150));
  }, []);

  // AI-powered search function
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    // Simulate AI-powered search with semantic matching
    const results = sampleThreads.filter(thread => {
      const searchableText = `${thread.title} ${thread.content} ${thread.tags.join(' ')}`.toLowerCase();
      const searchTerms = query.toLowerCase().split(' ');
      
      return searchTerms.some(term => searchableText.includes(term));
    });
    
    setThreads(results);
    setIsSearching(false);
  };

  // Create a new thread
  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThread.title || !newThread.content || !newThread.author) return;
    
    const newThreadWithMetadata: Thread = {
      id: Date.now(),
      title: newThread.title,
      content: newThread.content,
      author: newThread.author,
      replies: [],
      tags: extractTags(newThread.content),
      views: 0,
      lastActivity: "Just now"
    };

    setThreads([newThreadWithMetadata, ...threads]);
    setNewThread({ title: '', content: '', author: '' });
  };

  // Extract potential tags from content
  const extractTags = (content: string): string[] => {
    const commonTags = ['python', 'javascript', 'react', 'node', 'docker', 'kubernetes', 'devops', 'ai', 'ml'];
    return commonTags.filter(tag => content.toLowerCase().includes(tag));
  };

  // Add a reply to a thread
  const handleReply = (threadId: number) => {
    if (!reply || !replyAuthor) return;
    setThreads(threads =>
      threads.map(t =>
        t.id === threadId
          ? { 
              ...t, 
              replies: [...t.replies, { author: replyAuthor, content: reply }],
              lastActivity: "Just now"
            }
          : t
      )
    );
    setReply('');
    setReplyAuthor('');
  };

  const currentThread = threads.find(t => t.id === showThreadId);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar with community buttons */}
      <aside className="w-full md:w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Join Our Community</h2>
        <a href="https://discord.gg/your-invite" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition">
          <img src={discordIcon} alt="Discord" className="w-6 h-6" />
          Join our Discord
        </a>
        <a href="https://reddit.com/r/your-subreddit" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold shadow hover:bg-orange-600 transition">
          <img src={redditIcon} alt="Reddit" className="w-6 h-6" />
          Visit our Reddit
        </a>

        {/* AI Recommendations */}
        {recommendedThreads.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              Recommended for You
            </h3>
            <div className="space-y-3">
              {recommendedThreads.map(thread => (
                <div
                  key={thread.id}
                  onClick={() => setShowThreadId(thread.id)}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">{thread.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{thread.replies.length} replies</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main forum content */}
      <main className="flex-1 p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Discussion Forum</h1>

        {/* AI-Powered Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            {isSearching && (
              <div className="absolute right-3 top-3.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* Create Thread Form */}
        {!showThreadId && (
          <form onSubmit={handleCreateThread} className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Start a New Thread</h2>
            <input
              className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Your name"
              value={newThread.author}
              onChange={e => setNewThread({ ...newThread, author: e.target.value })}
              required
            />
            <input
              className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Thread title"
              value={newThread.title}
              onChange={e => setNewThread({ ...newThread, title: e.target.value })}
              required
            />
            <textarea
              className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="What's on your mind?"
              value={newThread.content}
              onChange={e => setNewThread({ ...newThread, content: e.target.value })}
              rows={3}
              required
            />
            <button type="submit" className="self-end px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition font-semibold">Post Thread</button>
          </form>
        )}

        {/* Thread List */}
        {!showThreadId && (
          <div className="space-y-4">
            {threads.length === 0 && <div className="text-gray-500 dark:text-gray-300">No threads found. Start the first discussion!</div>}
            {threads.map(thread => (
              <div key={thread.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-cyan-50 dark:hover:bg-gray-700 transition" onClick={() => setShowThreadId(thread.id)}>
                <div className="font-semibold text-lg text-cyan-700 dark:text-cyan-300">{thread.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">by {thread.author} &middot; {thread.replies.length} replies &middot; {thread.views} views &middot; {thread.lastActivity}</div>
                <div className="mt-2 text-gray-700 dark:text-gray-200 line-clamp-2">{thread.content}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {thread.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Thread View */}
        {showThreadId && currentThread && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
            <button className="mb-4 text-cyan-500 hover:underline" onClick={() => setShowThreadId(null)}>&larr; Back to threads</button>
            <h2 className="font-bold text-xl text-cyan-700 dark:text-cyan-300 mb-1">{currentThread.title}</h2>
            <div className="text-sm text-gray-500 dark:text-gray-300 mb-4">by {currentThread.author} &middot; {currentThread.views} views &middot; {currentThread.lastActivity}</div>
            <div className="mb-6 text-gray-800 dark:text-gray-100 whitespace-pre-line">{currentThread.content}</div>
            <div className="flex flex-wrap gap-2 mb-6">
              {currentThread.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                  #{tag}
                </span>
              ))}
            </div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Replies</h3>
            <div className="space-y-3 mb-4">
              {currentThread.replies.length === 0 && <div className="text-gray-500 dark:text-gray-300">No replies yet.</div>}
              {currentThread.replies.map((r, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded p-2">
                  <span className="font-semibold text-cyan-700 dark:text-cyan-300">{r.author}:</span> {r.content}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <input
                className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your name"
                value={replyAuthor}
                onChange={e => setReplyAuthor(e.target.value)}
                required
              />
              <textarea
                className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Write a reply..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                rows={2}
                required
              />
              <button className="self-end px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition font-semibold" onClick={() => handleReply(currentThread.id)}>Reply</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 