import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const CTASection = () => {
  const { currentUser, setIsAuthModalOpen, setAuthModalView } = useAuth();

  const handleSignUpClick = () => {
    if (!currentUser) {
      setAuthModalView("register");
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-primary-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20 lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-3xl font-bold tracking-tight text-white">Ready to accelerate your medical education?</h2>
            <p className="mt-4 max-w-3xl text-lg text-primary-100">
              {currentUser 
                ? "Continue tracking your progress, join the community, and master medical concepts faster than ever."
                : "Sign up for free and start tracking your progress, join the community, and master medical concepts faster than ever."}
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {currentUser ? (
                <Link href="/quiz/all">
                  <Button 
                    size="lg"
                    className="inline-flex items-center justify-center px-5 py-3 bg-white text-primary-700 hover:bg-primary-50"
                  >
                    Start Quiz Session
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg"
                  className="inline-flex items-center justify-center px-5 py-3 bg-white text-primary-700 hover:bg-primary-50"
                  onClick={handleSignUpClick}
                >
                  Create Free Account
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg"
                className="inline-flex items-center justify-center px-5 py-3 text-white bg-primary-800 bg-opacity-60 hover:bg-opacity-70 border-primary-600"
              >
                Take a Tour
                <Film className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-5/12 lg:flex-none">
            {/* Medical students collaborating image */}
            <img 
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Medical students collaborating" 
              className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
