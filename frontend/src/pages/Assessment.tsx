import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const Assessment = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userName } = useAuthStore();

  console.log("Assessment Component Render - User Name from Auth Store:", userName);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_AI_SERVICE_URL}/generate-questions`,
          {
            topic: 'JavaScript',
            difficulty: 'intermediate',
            num_questions: 10
          }
        );
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load questions');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []); // Fetch questions only once on component mount

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const skillGaps = questions
        .filter((q) => selectedAnswer !== q.answer)
        .map((q) => q.explanation);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assessments`,
        {
          score: (score / questions.length) * 100,
          skillGaps
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast.success('Assessment completed!');
      navigate('/roadmap');
    } catch (error) {
      toast.error('Failed to submit assessment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Helper function to process the question text for display
  const getProcessedQuestion = () => {
    if (questions.length === 0) return '';
    const questionText = questions[currentQuestion].question;
    const processed = questionText.replace(/\\[Learner\'s Name\\]/g, userName || 'Learner');
    console.log("Rendering question - userName:", userName, "Processed:", processed);
    return processed;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Assessment</h2>
        <div className="text-lg font-semibold">
          Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {userName && currentQuestion === 0 && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg">
          <p className="text-lg">Hi {userName}, let's start with something fundamental.</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <p className="text-lg font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="mt-2 text-gray-700">
            {getProcessedQuestion()}
          </p>
        </div>

        <div className="space-y-3">
          {questions[currentQuestion]?.options.map((option, index) => (
            <button
              key={index}
              className={`w-full text-left p-3 rounded-md border ${
                selectedAnswer === option
                  ? 'bg-indigo-100 border-indigo-500'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleAnswerSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;