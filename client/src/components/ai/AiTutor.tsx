import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { askMedicalQuestion } from "@/lib/openrouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Send, 
  User, 
  RefreshCcw, 
  ThumbsUp, 
  MoreHorizontal,
  Loader2,
  MessageSquarePlus
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const AiTutor = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    const userQuestion = question.trim();
    setQuestion("");
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userQuestion,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await askMedicalQuestion(userQuestion);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error asking AI:", error);
      
      toast({
        title: "Failed to get AI response",
        description: "There was an error processing your question. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const regenerateLastResponse = async () => {
    // Find the last user question
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    
    if (lastUserMessageIndex === -1) return;
    
    const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex];
    
    // Remove all messages after the last user message
    setMessages(messages.slice(0, messages.length - lastUserMessageIndex));
    setIsLoading(true);
    
    try {
      const response = await askMedicalQuestion(lastUserMessage.content);
      
      // Add new AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response.answer,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error regenerating response:", error);
      
      toast({
        title: "Failed to regenerate response",
        description: "There was an error processing your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFeedback = (messageId: string, type: 'helpful' | 'unhelpful') => {
    toast({
      title: type === 'helpful' ? "Feedback recorded" : "Feedback noted",
      description: type === 'helpful' 
        ? "Thank you for your positive feedback!" 
        : "We'll work to improve our responses.",
    });
  };
  
  return (
    <Card className="shadow-lg border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <CardHeader className="bg-primary-700 dark:bg-primary-800 text-white rounded-t-lg pb-3">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-800 dark:bg-primary-900 flex items-center justify-center">
              <Bot className="text-white h-6 w-6" />
            </div>
          </div>
          <div className="ml-3">
            <CardTitle className="text-white">DocDot AI Tutor</CardTitle>
            <CardDescription className="text-primary-200 dark:text-primary-300">
              Trained on medical literature
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto p-0">
        <div className="px-6 py-5 space-y-4 h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <Bot className="h-12 w-12 text-primary-300 dark:text-primary-700" />
              <div className="max-w-sm">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Ask me anything about medicine</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  I can help you understand concepts, provide explanations, or answer general medical questions.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 w-full max-w-md">
                <Button 
                  variant="outline" 
                  className="text-left justify-start h-auto py-2" 
                  onClick={() => setQuestion("What is the difference between systolic and diastolic heart failure?")}
                >
                  <div>
                    <p className="font-medium">Systolic vs diastolic heart failure</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="text-left justify-start h-auto py-2" 
                  onClick={() => setQuestion("Explain the pathophysiology of acute pancreatitis")}
                >
                  <div>
                    <p className="font-medium">Pancreatitis pathophysiology</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="text-left justify-start h-auto py-2" 
                  onClick={() => setQuestion("What are the branches of the facial nerve and their functions?")}
                >
                  <div>
                    <p className="font-medium">Facial nerve anatomy</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="text-left justify-start h-auto py-2" 
                  onClick={() => setQuestion("How do ACE inhibitors work in heart failure treatment?")}
                >
                  <div>
                    <p className="font-medium">ACE inhibitors mechanism</p>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md rounded-lg px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-gray-900 dark:text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                  }`}>
                    <div className="flex items-start mb-1">
                      {message.role === 'assistant' && (
                        <Bot className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                      )}
                      {message.role === 'user' && (
                        <User className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    {message.role === 'assistant' && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleFeedback(message.id, 'helpful')}
                        >
                          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                          Helpful
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => regenerateLastResponse()}
                        >
                          <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                          Regenerate
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 px-2 text-xs"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-md rounded-lg px-4 py-3 bg-gray-100 dark:bg-gray-800">
                    <div className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                      <Loader2 className="h-4 w-4 animate-spin text-primary-600 dark:text-primary-400" />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col space-y-2">
            <div className="flex relative">
              <Textarea 
                placeholder="Type your medical question here..." 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="pr-12 min-h-[80px] resize-none"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-2 bottom-2" 
                disabled={!question.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 justify-between">
              <div className="flex items-center">
                <Bot className="h-3.5 w-3.5 mr-1 text-primary-600 dark:text-primary-400" />
                <span>Powered by OpenRouter API with medical knowledge</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs" 
                onClick={() => setMessages([])}
                disabled={messages.length === 0}
              >
                <MessageSquarePlus className="h-3.5 w-3.5 mr-1" />
                New Chat
              </Button>
            </div>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AiTutor;
