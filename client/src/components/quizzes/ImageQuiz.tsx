import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lightbulb, AlertCircle, Loader2 } from "lucide-react";
import { getRandomImageQuestion, recordImageQuizAnswer } from "@/lib/api";
import { ImageQuestion } from "@/types";

interface ImageQuizProps {
  category?: string;
  subcategory?: string;
}

const ImageQuiz = ({ category, subcategory }: ImageQuizProps) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Fetch a random image question
  const { 
    data: question, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery<ImageQuestion>({
    queryKey: [`/api/image-quiz/random${category ? `?category=${category}${subcategory ? `&subcategory=${subcategory}` : ''}` : ''}`],
    enabled: true,
  });

  // Mutation to record answer
  const recordAnswerMutation = useMutation({
    mutationFn: (data: {
      questionId: string;
      isCorrect: boolean;
      userId: string;
      category: string;
      subcategory: string;
    }) => recordImageQuizAnswer(data),
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

  const handleAnswerSelect = (answer: string) => {
    if (isCorrect !== null) return; // Already answered
    
    setSelectedAnswer(answer);
    const correct = answer === question?.correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);
    setQuestionsAnswered(prev => prev + 1);
    
    // Record the answer if user is logged in and question is available
    if (currentUser && question) {
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

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <h3 className="text-xl font-medium text-red-800 dark:text-red-300">Failed to load image quiz</h3>
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
        <div className="bg-amber-500 dark:bg-amber-700 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              Image Quiz {category ? `- ${category}${subcategory ? ` / ${subcategory}` : ''}` : ''}
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
              <div className="h-64 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
              <div className="space-y-4 mt-6">
                <div className="h-10 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="h-10 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="h-10 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="h-10 bg-gray-200 rounded dark:bg-gray-700"></div>
              </div>
            </div>
          ) : question ? (
            <div className="mb-8">
              {/* Image */}
              <div className="mb-6 overflow-hidden rounded-lg">
                <img 
                  src={question.imageUrl} 
                  alt={`Medical image for question: ${question.question}`} 
                  className="w-full h-auto max-h-96 object-contain bg-gray-100 dark:bg-gray-800"
                />
              </div>
              
              {/* Question */}
              <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-6">{question.question}</h4>
              
              {/* Answer options */}
              <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                {question.options.map((option, index) => (
                  <div 
                    key={option}
                    className={`flex items-center space-x-2 rounded-lg border p-4 transition-all duration-200 ${
                      selectedAnswer === option
                        ? isCorrect 
                          ? "border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-900/20"
                          : option === question.correctAnswer
                            ? "border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-900/20"
                            : "border-red-600 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-amber-300 hover:bg-amber-50/50 dark:hover:border-amber-500 dark:hover:bg-amber-900/20"
                    }`}
                    onClick={() => isCorrect === null && handleAnswerSelect(option)}
                  >
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${index}`} 
                      disabled={isCorrect !== null}
                      className="cursor-pointer"
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="w-full cursor-pointer text-base font-medium text-gray-900 dark:text-white"
                    >
                      {option}
                    </Label>
                    {selectedAnswer && (option === question.correctAnswer) && (
                      <span className="ml-auto inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No image questions available.</p>
            </div>
          )}
          
          {/* Explanation Panel */}
          {showExplanation && question && (
            <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/50 rounded-md p-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400 text-xl" />
                </div>
                <h4 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Explanation</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{question.explanation}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                  </svg>
                  <span>Category: {question.category} / {question.subcategory}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Controls */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </Button>
            
            <Button
              disabled={isLoading || !question}
              onClick={handleNextQuestion}
              className="inline-flex items-center bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
            >
              {isCorrect === null ? "Skip" : "Next Image"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImageQuiz;
