import { Link } from "wouter";
import AiTutor from "@/components/ai/AiTutor";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  BrainCircuit,
  FileQuestion 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Helmet } from "react-helmet";

const AiTutorPage = () => {
  return (
    <>
      <Helmet>
        <title>AI Medical Tutor - DocDot</title>
        <meta 
          name="description" 
          content="Get instant answers to your medical questions from our AI-powered tutor. Perfect for clarifying concepts and improving your understanding."
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation breadcrumb */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="inline-flex items-center px-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <BrainCircuit className="mr-3 h-8 w-8 text-primary" />
            AI-Powered Medical Tutor
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Ask any medical questions and get detailed explanations from our AI tutor. Perfect for 
            clarifying concepts, understanding difficult topics, or diving deeper into your areas of interest.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main AI Tutor Component */}
          <div className="lg:col-span-2">
            <AiTutor />
          </div>
          
          {/* Sidebar Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How to Use the AI Tutor</CardTitle>
                <CardDescription>Get the most out of your AI assistant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 dark:text-primary-400 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Ask specific questions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      The more specific your question, the more helpful the response will be.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 dark:text-primary-400 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Follow up for clarity</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      If a response isn't clear, ask follow-up questions to get more information.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 dark:text-primary-400 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Provide feedback</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use the feedback buttons to help improve the AI's responses over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Example Questions</CardTitle>
                <CardDescription>Try asking questions like these</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    "Explain the pathophysiology of heart failure with preserved ejection fraction."
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    "What's the difference between the sympathetic and parasympathetic nervous systems?"
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    "What are the most common causes of lower back pain and how are they diagnosed?"
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    "Walk me through the coagulation cascade and its clinical implications."
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Limitations</CardTitle>
                <CardDescription>Important things to know</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  • The AI tutor is for educational purposes only and should not be used for medical advice.
                </p>
                <p>
                  • Information may not always be up-to-date with the latest research.
                </p>
                <p>
                  • Always verify important information with authoritative sources.
                </p>
                <p>
                  • The AI may occasionally provide incorrect information.
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Link href="/quiz/all" className="w-full">
                  <Button variant="outline" className="w-full">
                    <FileQuestion className="mr-2 h-4 w-4" />
                    Test Your Knowledge
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiTutorPage;
