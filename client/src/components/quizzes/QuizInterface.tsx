import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Lightbulb } from "lucide-react";
import { Question } from "@/types";
import { getRandomQuestion, recordQuizAnswer } from "@/lib/api";
import { Separator } from "@/components/ui/separator";

interface QuizInterfaceProps {
  category?: string;
  subcategory?: string;
}

const QuizInterface = ({ category, subcategory }: QuizInterfaceProps) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  
  // Fetch a random question
  const { 
    data: question, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: [`/api/quiz/random${category ? `?category=${category}${subcategory ? `&subcategory=${subcategory}` : ''}` : ''}`],
    enabled: true,
  });
  
  // Mutation to record answer
  const recordAnswerMutation = useMutation({
    mutationFn: (data: {
      questionId: number;
      isCorrect: boolean;
      userId: string;
      category: string;
      subcategory?: string;
    }) => recordQuizAnswer(data),
    onSuccess: () => {
      // Update user stats
      queryClient.invalidateQueries({ queryKey: ['/api/stats/user'] });
    },
    onError: (error) => {
      toast({
        title: "Error recording answer",
        description: `Failed to save your answer: ${error}`,
        variant: "destructive",
      });
    }
  });
  
  const handleAnswerSelect = (answer: boolean) => {
    if (isCorrect !== null) return; // Already answered
    
    setSelectedAnswer(answer);
    const correct = answer === question.answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    setQuestionsAnswered(prev => prev + 1);
    
    // Record the answer if user is logged in
    if (currentUser) {
      recordAnswerMutation.mutate({
        questionId: question.id,
        isCorrect: correct,
        userId: currentUser.uid,
        category: question.category,
        subcategory: question.subcategory
      });
    }
  };
  
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    refetch();
  };
  
  // Handle errors
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-medium text-red-800 dark:text-red-300">Failed to load question</h3>
            <p className="mt-2 text-red-700 dark:text-red-400">Please try again later or select a different category.</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="mt-4 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="shadow-md overflow-hidden">
        <div className="bg-primary-600 dark:bg-primary-800 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              {category ? `${category} Quiz${subcategory ? `: ${subcategory}` : ''}` : 'Quiz'}
            </h3>
            <div className="flex items-center bg-white/20 rounded-lg px-3 py-1">
              <div className="mr-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span className="text-white font-medium">Question {questionsAnswered + 1}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
              <div className="h-4 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 dark:bg-gray-700"></div>
              <div className="space-y-4 mt-6">
                <div className="h-14 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="h-14 bg-gray-200 rounded dark:bg-gray-700"></div>
              </div>
            </div>
          ) : question ? (
            <div className="mb-8">
              <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-4">{question.question}</h4>
              
              {/* Options */}
              <div className="space-y-4 mt-6">
                <button 
                  className={`w-full flex items-center border-2 rounded-lg p-4 transition-all duration-200 ${
                    selectedAnswer === true
                      ? isCorrect 
                        ? "border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-900/20"
                        : "border-red-600 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:border-primary-500 dark:hover:bg-primary-900/20"
                  }`}
                  onClick={() => handleAnswerSelect(true)}
                  disabled={isCorrect !== null}
                >
                  <div className={`h-6 w-6 flex-shrink-0 rounded-full mr-3 flex items-center justify-center ${
                    selectedAnswer === true 
                      ? isCorrect 
                        ? "bg-green-600 dark:bg-green-500" 
                        : "bg-red-600 dark:bg-red-500"
                      : "border-2 border-gray-300 dark:border-gray-600"
                  }`}>
                    {selectedAnswer === true && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-lg font-medium text-gray-900 dark:text-white">True</span>
                </button>
                
                <button 
                  className={`w-full flex items-center border-2 rounded-lg p-4 transition-all duration-200 ${
                    selectedAnswer === false
                      ? isCorrect 
                        ? "border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-900/20"
                        : "border-red-600 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:border-primary-500 dark:hover:bg-primary-900/20"
                  }`}
                  onClick={() => handleAnswerSelect(false)}
                  disabled={isCorrect !== null}
                >
                  <div className={`h-6 w-6 flex-shrink-0 rounded-full mr-3 flex items-center justify-center ${
                    selectedAnswer === false 
                      ? isCorrect 
                        ? "bg-green-600 dark:bg-green-500" 
                        : "bg-red-600 dark:bg-red-500"
                      : "border-2 border-gray-300 dark:border-gray-600"
                  }`}>
                    {selectedAnswer === false && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-lg font-medium text-gray-900 dark:text-white">False</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No questions available for this category.</p>
            </div>
          )}
          
          {/* Explanation Panel */}
          {showExplanation && question && (
            <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 rounded-md p-2">
                  <Lightbulb className="text-primary text-xl" />
                </div>
                <h4 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Explanation</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{question.explanation}</p>
              
              {question.references && Object.keys(question.references).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">References:</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {Object.entries(question.references).map(([key, value]) => (
                      <li key={key}>• {key}: {value}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {question.ai_explanation && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Additional Context:</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{question.ai_explanation}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Controls */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              disabled={questionsAnswered === 0}
              onClick={() => window.history.back()}
              className="inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button
              disabled={isLoading || !question}
              onClick={handleNextQuestion}
              className="inline-flex items-center"
            >
              {isCorrect === null ? "Skip" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuizInterface;
