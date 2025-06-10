from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import openai
import ast
import redis
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="JnanaSetu AI Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

# OpenAI configuration
openai.api_key = os.getenv("OPENAI_API_KEY")

class QuestionRequest(BaseModel):
    topic: str
    difficulty: str
    num_questions: int = 5

class CodeEvaluationRequest(BaseModel):
    code: str
    test_cases: List[Dict[str, Any]]

class QuestionResponse(BaseModel):
    questions: List[Dict[str, Any]]

class CodeEvaluationResponse(BaseModel):
    results: List[Dict[str, Any]]
    feedback: str

@app.post("/generate-questions", response_model=QuestionResponse)
async def generate_questions(request: QuestionRequest):
    try:
        # Check cache first
        cache_key = f"questions:{request.topic}:{request.difficulty}:{request.num_questions}"
        cached_questions = redis_client.get(cache_key)
        
        if cached_questions:
            return QuestionResponse(questions=eval(cached_questions))

        # Generate questions using GPT-4
        prompt = f"""
        Generate {request.num_questions} multiple choice questions about {request.topic}.
        Difficulty level: {request.difficulty}
        Each question should have:
        1. A clear question stem
        2. 4 options (A, B, C, D)
        3. The correct answer
        4. A brief explanation
        Format as a JSON array of objects with keys: question, options, answer, explanation
        """

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert educational content creator."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        questions = eval(response.choices[0].message.content)
        
        # Cache the results
        redis_client.setex(cache_key, 3600, str(questions))  # Cache for 1 hour

        return QuestionResponse(questions=questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate-code", response_model=CodeEvaluationResponse)
async def evaluate_code(request: CodeEvaluationRequest):
    try:
        # Parse and validate the code
        try:
            ast.parse(request.code)
        except SyntaxError as e:
            return CodeEvaluationResponse(
                results=[],
                feedback=f"Syntax Error: {str(e)}"
            )

        # Execute test cases
        results = []
        for test_case in request.test_cases:
            try:
                # Create a new namespace for execution
                namespace = {}
                exec(request.code, namespace)
                
                # Call the function with test case input
                result = namespace[test_case["function_name"]](*test_case["input"])
                
                # Compare with expected output
                is_correct = result == test_case["expected_output"]
                
                results.append({
                    "test_case": test_case["name"],
                    "passed": is_correct,
                    "actual_output": result,
                    "expected_output": test_case["expected_output"]
                })
            except Exception as e:
                results.append({
                    "test_case": test_case["name"],
                    "passed": False,
                    "error": str(e)
                })

        # Generate feedback using GPT-4
        feedback_prompt = f"""
        Code:
        {request.code}
        
        Test Results:
        {results}
        
        Provide constructive feedback on the code quality, style, and potential improvements.
        """

        feedback_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert code reviewer."},
                {"role": "user", "content": feedback_prompt}
            ],
            temperature=0.7
        )

        feedback = feedback_response.choices[0].message.content

        return CodeEvaluationResponse(
            results=results,
            feedback=feedback
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 