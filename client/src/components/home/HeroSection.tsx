import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-y-0 w-full h-full">
        {/* Medical students studying image with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-900 mix-blend-multiply opacity-90"></div>
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80" 
          alt="Medical students studying" 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Elevate Your Medical Knowledge
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-white">
          Interactive quizzes, detailed explanations, and AI-powered tutoring to help you master medical concepts.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/quiz/all">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
              Start Quiz
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 -mr-1 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="ghost" 
            className="bg-primary-100 bg-opacity-20 text-white hover:bg-opacity-30 border border-primary-100 border-opacity-20"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
