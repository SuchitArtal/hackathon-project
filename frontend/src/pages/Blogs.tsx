import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export default function Blogs() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Getting Started with Python: A Beginner's Guide",
      excerpt: "Learn the fundamentals of Python programming, from basic syntax to your first project. Perfect for absolute beginners.",
      author: "Sarah Chen",
      date: "Mar 15, 2024",
      readTime: "8 min read",
      category: "Tutorials",
      image: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec4?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "The Future of AI in Software Development",
      excerpt: "Explore how artificial intelligence is transforming the way we write, test, and maintain code.",
      author: "Dr. Michael Roberts",
      date: "Mar 14, 2024",
      readTime: "12 min read",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "Building Your First Full-Stack Application",
      excerpt: "A comprehensive guide to creating a complete web application using modern technologies.",
      author: "Alex Johnson",
      date: "Mar 13, 2024",
      readTime: "15 min read",
      category: "Tutorials",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 4,
      title: "Top 10 Programming Languages to Learn in 2024",
      excerpt: "Discover which programming languages are most in demand and why you should consider learning them.",
      author: "Maria Garcia",
      date: "Mar 12, 2024",
      readTime: "10 min read",
      category: "Career",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 5,
      title: "Mastering Data Structures and Algorithms",
      excerpt: "Essential concepts and techniques to ace your technical interviews and become a better programmer.",
      author: "David Kim",
      date: "Mar 11, 2024",
      readTime: "20 min read",
      category: "Computer Science",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 6,
      title: "The Art of Clean Code",
      excerpt: "Learn how to write maintainable, readable, and efficient code that other developers will love.",
      author: "Emma Wilson",
      date: "Mar 10, 2024",
      readTime: "9 min read",
      category: "Best Practices",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 7,
      title: "DevOps: From Zero to Hero",
      excerpt: "A complete guide to understanding and implementing DevOps practices in your projects.",
      author: "James Thompson",
      date: "Mar 9, 2024",
      readTime: "14 min read",
      category: "DevOps",
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 8,
      title: "React vs Vue: Which Framework Should You Choose?",
      excerpt: "A detailed comparison of two popular frontend frameworks to help you make the right choice for your next project.",
      author: "Lisa Wong",
      date: "Mar 8, 2024",
      readTime: "11 min read",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 9,
      title: "Machine Learning for Beginners",
      excerpt: "Start your journey into machine learning with this comprehensive guide covering basic concepts and practical examples.",
      author: "Dr. Raj Patel",
      date: "Mar 7, 2024",
      readTime: "18 min read",
      category: "AI/ML",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 10,
      title: "Cybersecurity Essentials for Developers",
      excerpt: "Learn about common security vulnerabilities and best practices to protect your applications from threats.",
      author: "Mark Anderson",
      date: "Mar 6, 2024",
      readTime: "13 min read",
      category: "Security",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 11,
      title: "Building RESTful APIs with Node.js",
      excerpt: "A practical guide to creating robust and scalable REST APIs using Node.js and Express.",
      author: "Chris Martinez",
      date: "Mar 5, 2024",
      readTime: "16 min read",
      category: "Backend",
      image: "https://images.unsplash.com/photo-1555066931-bf19f8fd80f5?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 12,
      title: "Mobile App Development with Flutter",
      excerpt: "Learn how to build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
      author: "Sophie Lee",
      date: "Mar 4, 2024",
      readTime: "15 min read",
      category: "Mobile",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 13,
      title: "Database Design Best Practices",
      excerpt: "Essential principles and patterns for designing efficient and scalable databases.",
      author: "Thomas Brown",
      date: "Mar 3, 2024",
      readTime: "12 min read",
      category: "Database",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 14,
      title: "UI/UX Design Principles for Developers",
      excerpt: "Learn how to create intuitive and engaging user interfaces that enhance user experience.",
      author: "Rachel Green",
      date: "Mar 2, 2024",
      readTime: "10 min read",
      category: "Design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60"
    }
  ];

  const categories = ['all', ...new Set(blogPosts.map(post => post.category.toLowerCase()))];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category.toLowerCase() === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blogs</h1>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <Tag className="w-4 h-4" />
                  <span>{post.category}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
} 