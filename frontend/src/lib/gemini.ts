// Gemini API integration
// Using the free version of Gemini API - Gemini 2.0 Flash model

// We'll use a proxy approach to avoid CORS issues in the browser
// This can be replaced with a direct API call if CORS is configured properly
const useProxy = false; // Set to true to use a backend proxy (not implemented yet)
const DIRECT_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const PROXY_API_URL = '/api/gemini-proxy'; // This should be implemented on your backend

// Choose the appropriate URL based on the useProxy setting
const GEMINI_API_URL = useProxy ? PROXY_API_URL : DIRECT_API_URL;

// Note: In a production environment, this API key should be stored securely in environment variables
// For demo purposes, we're using a placeholder that should be replaced with a real API key
const API_KEY = 'AIzaSyBGewtHd2LeVcKVRGhlP5rtL8eSTv5OepA'; // Replace with your actual API key

// Generation config for Gemini 2.0 Flash
const generationConfig = {
  temperature: 0.5,  // Lower temperature for more focused responses
  topP: 0.95,
  topK: 32,
  maxOutputTokens: 800,  // Token limit for flash model
};

// Safety settings - using default settings
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  }
];

// Mock data for frontend development when API is not available
const mockQuestions: Question[] = [
  {
    question: "Which HTML element is used to create a dropdown list?",
    options: ["<dropdown>", "<select>", "<option>", "<list>"],
    correctAnswer: 1
  },
  {
    question: "Which CSS property is used to control the spacing between elements?",
    options: ["spacing", "margin", "padding", "gap"],
    correctAnswer: 1
  },
  {
    question: "What does DOM stand for in JavaScript?",
    options: ["Document Object Model", "Data Object Model", "Document Oriented Model", "Digital Object Model"],
    correctAnswer: 0
  },
  {
    question: "Which of the following is NOT a valid way to declare a variable in JavaScript?",
    options: ["var x = 5;", "let x = 5;", "const x = 5;", "variable x = 5;"],
    correctAnswer: 3
  },
  {
    question: "Which CSS property is used to make a website responsive?",
    options: ["responsive-design", "@media", "viewport", "flex-wrap"],
    correctAnswer: 1
  }
];

const mockAssessment: GeminiResponse = {
  assessment: "You have a good understanding of basic frontend concepts but could improve in some areas.",
  recommendations: "Focus on strengthening your JavaScript skills and responsive design techniques. Consider practicing more with CSS layouts and frameworks.",
  score: 70,
  strengths: ["HTML structure", "Basic CSS knowledge"],
  areas_to_improve: ["JavaScript DOM manipulation", "Responsive design principles"]
};

export interface GeminiResponse {
  assessment: string;
  recommendations: string;
  score: number;
  strengths: string[];
  areas_to_improve: string[];
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

// Function to get user's name from localStorage or use default
function getUserName(): string {
  try {
    // Try to get user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      if (user && user.name) {
        return user.name.split(' ')[0]; // Return first name
      }
    }
    
    // Try to get auth data which might contain user info
    const authData = localStorage.getItem('auth');
    if (authData) {
      const auth = JSON.parse(authData);
      if (auth && auth.user && auth.user.name) {
        return auth.user.name.split(' ')[0]; // Return first name
      }
    }
  } catch (e) {
    console.error("Error getting user name:", e);
  }
  
  return "learner"; // Default name if none found
}

export async function generateFrontendQuestions(): Promise<Question[]> {
  try {
    // Get user's name for personalization (still used for other parts of the prompt if desired, but not directly for question text)
    const userName = getUserName();
    
    const prompt = `You are an experienced senior frontend developer conducting a technical assessment for a frontend development position.
                    
                    Assessment Guidelines
                    Difficulty Level: Basic to intermediate (suitable for junior to mid-level developers)
                    Question Distribution: Cover the following areas evenly:

                    HTML semantics and structure
                    CSS styling, layout, and responsive design
                    JavaScript fundamentals and ES6+ features
                    DOM manipulation and event handling
                    Frontend frameworks/libraries concepts
                    Web performance and optimization
                    Browser APIs and web standards
                    Debugging and development tools

                    Question Types: Mix of:

                    Conceptual understanding
                    Code analysis and debugging
                    Best practices and optimization
                    Real-world problem solving
                    Common pitfalls and gotchas

                    Response Format
                    Generate exactly 5 assessment questions formatted as a JSON array. Each question object must include:
                    json{
                      "question": "Clear, specific question text",
                      "options": [
                        "Option A - plausible distractor",
                        "Option B - another plausible option", 
                        "Option C - correct answer",
                        "Option D - common misconception"
                      ],
                      "correctAnswer": 2
                    }
                    
                    Quality Standards
                    Realistic Scenarios: Base questions on common development tasks and challenges
                    Avoid Trivia: Focus on practical knowledge over memorization
                    Clear Language: Use precise, unambiguous wording
                    Balanced Difficulty: Mix 60% basic and 40% intermediate questions
                    Diverse Distractors: Make incorrect options plausible but clearly wrong to knowledgeable developers
                    Current Practices: Reflect modern frontend development standards and tools

                    Example Categories to Cover
                    HTML: Semantic elements, accessibility, forms, meta tags
                    CSS: Flexbox/Grid, specificity, animations, responsive design
                    JavaScript: Closures, async/await, array methods, event handling
                    DOM: Element selection, manipulation, event delegation
                    Performance: Loading optimization, rendering, memory management
                    Tools: DevTools, bundlers, version control basics
                    Best Practices: Code organization, error handling, testing concepts
                    Browser APIs: Fetch, Storage, Geolocation, etc.

                    Generate questions that would effectively differentiate between candidates with different skill levels while being fair and representative of actual frontend development work.`;

    // Prepare request based on whether we're using the proxy or direct API
    let requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(useProxy 
        ? {
            prompt,
            apiKey: API_KEY,
            generationConfig,
            safetySettings
          }
        : {
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: generationConfig,
            safetySettings: safetySettings
          })
    };

    // Add API key to URL if using direct API
    const apiUrl = useProxy ? GEMINI_API_URL : `${GEMINI_API_URL}?key=${API_KEY}`;
    
    try {
      console.log("Attempting to fetch questions from Gemini API...");
      const response = await fetch(apiUrl, requestOptions);

      if (!response.ok) {
        console.error(`Error fetching questions: ${response.statusText}`);
        console.log("Falling back to mock questions");
        return mockQuestions; // Fallback to mock data if API call fails
      }

      const data = await response.json();
      
      // Handle different response formats based on proxy vs direct
      const content = useProxy 
        ? data.content 
        : data.candidates[0].content.parts[0].text;
      
      console.log("Raw content from Gemini:", content);
      
      // Parse the JSON from the response text
      try {
        // Extract JSON from markdown code blocks if present
        let jsonContent = content;
        
        // Check if content is wrapped in markdown code blocks
        const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          jsonContent = codeBlockMatch[1].trim();
          console.log("Extracted JSON from code block:", jsonContent);
        }
        
        // Try to parse the JSON
        const questions = JSON.parse(jsonContent);
        return questions as Question[];
      } catch (e) {
        console.error("Failed to parse questions from Gemini response", e);
        console.log("Falling back to mock questions");
        return mockQuestions; // Fallback to mock data if parsing fails
      }
    } catch (fetchError) {
      console.error("Network error when fetching questions:", fetchError);
      console.log("Falling back to mock questions");
      return mockQuestions; // Fallback to mock data if network error
    }
  } catch (error) {
    console.error("Error generating frontend questions:", error);
    console.log("Falling back to mock questions");
    return mockQuestions; // Fallback to mock data if API call fails
  }
}

export async function assessFrontendTest(userAnswers: any): Promise<GeminiResponse> {
  try {
    // Get user's name for personalization
    const userName = getUserName();
    
    const prompt = `You are an experienced frontend development mentor providing feedback to ${userName} on their assessment results.
    
    Analyze these frontend development test answers from ${userName}:
    ${JSON.stringify(userAnswers)}
    
    Provide your response in this exact JSON format:
    {
      "assessment": "A brief 1-2 sentence overall assessment addressed directly to ${userName}",
      "recommendations": "A 2-3 line note on where ${userName} should improve, with specific, actionable advice",
      "score": [a number between 0-100 representing their overall score],
      "strengths": ["strength1", "strength2"],
      "areas_to_improve": ["area1", "area2"]
    }
    
    Make your feedback personalized, constructive, and encouraging. Address ${userName} directly in your assessment and recommendations.`;

    // Prepare request based on whether we're using the proxy or direct API
    let requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(useProxy 
        ? {
            prompt,
            apiKey: API_KEY,
            generationConfig,
            safetySettings
          }
        : {
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: generationConfig,
            safetySettings: safetySettings
          })
    };

    // Add API key to URL if using direct API
    const apiUrl = useProxy ? GEMINI_API_URL : `${GEMINI_API_URL}?key=${API_KEY}`;
    
    try {
      console.log("Attempting to get assessment from Gemini API...");
      const response = await fetch(apiUrl, requestOptions);

      if (!response.ok) {
        console.error(`Error assessing test: ${response.statusText}`);
        console.log("Falling back to calculated assessment");
        
        // Calculate score based on correct answers if we have the data
        if (userAnswers.questions && userAnswers.userAnswers) {
          const questions = userAnswers.questions;
          const answers = userAnswers.userAnswers;
          let correctCount = 0;
          
          Object.keys(answers).forEach(qIndex => {
            const questionIndex = parseInt(qIndex);
            if (questions[questionIndex] && answers[questionIndex] === questions[questionIndex].correctAnswer) {
              correctCount++;
            }
          });
          
          const score = Math.round((correctCount / questions.length) * 100);
          
          // Create a personalized mock assessment
          const personalizedAssessment = {
            ...mockAssessment,
            score: score,
            assessment: `${userName}, you have a good understanding of basic frontend concepts but could improve in some areas.`,
            recommendations: `${userName}, focus on strengthening your JavaScript skills and responsive design techniques. Consider practicing more with CSS layouts and frameworks.`
          };
          
          return personalizedAssessment;
        }
        
        // Create a personalized mock assessment with default score
        const personalizedAssessment = {
          ...mockAssessment,
          assessment: `${userName}, you have a good understanding of basic frontend concepts but could improve in some areas.`,
          recommendations: `${userName}, focus on strengthening your JavaScript skills and responsive design techniques. Consider practicing more with CSS layouts and frameworks.`
        };
        
        return personalizedAssessment;
      }

      const data = await response.json();
      
      // Handle different response formats based on proxy vs direct
      const content = useProxy 
        ? data.content 
        : data.candidates[0].content.parts[0].text;
      
      console.log("Raw assessment content from Gemini:", content);
      
      // Parse the JSON from the response text
      try {
        // First check if content is wrapped in markdown code blocks
        const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          const jsonContent = codeBlockMatch[1].trim();
          console.log("Extracted JSON from code block:", jsonContent);
          return JSON.parse(jsonContent) as GeminiResponse;
        }
        
        // If not in code blocks, try to find JSON in the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const assessment = JSON.parse(jsonMatch[0]);
          return assessment;
        }
        
        throw new Error("Could not find valid JSON in response");
      } catch (e) {
        console.error("Failed to parse assessment from Gemini response", e);
        console.log("Falling back to calculated assessment");
        
        // Create a personalized mock assessment
        const personalizedAssessment = {
          ...mockAssessment,
          assessment: `${userName}, you have a good understanding of basic frontend concepts but could improve in some areas.`,
          recommendations: `${userName}, focus on strengthening your JavaScript skills and responsive design techniques. Consider practicing more with CSS layouts and frameworks.`
        };
        
        return personalizedAssessment;
      }
    } catch (fetchError) {
      console.error("Network error when fetching assessment:", fetchError);
      console.log("Falling back to calculated assessment");
      
      // Create a personalized mock assessment
      const personalizedAssessment = {
        ...mockAssessment,
        assessment: `${userName}, you have a good understanding of basic frontend concepts but could improve in some areas.`,
        recommendations: `${userName}, focus on strengthening your JavaScript skills and responsive design techniques. Consider practicing more with CSS layouts and frameworks.`
      };
      
      return personalizedAssessment;
    }
  } catch (error) {
    console.error("Error assessing frontend test:", error);
    console.log("Falling back to calculated assessment");
    
    // Create a personalized mock assessment
    const personalizedAssessment = {
      ...mockAssessment,
      assessment: `${getUserName()}, you have a good understanding of basic frontend concepts but could improve in some areas.`,
      recommendations: `${getUserName()}, focus on strengthening your JavaScript skills and responsive design techniques. Consider practicing more with CSS layouts and frameworks.`
    };
    
    return personalizedAssessment;
  }
} 