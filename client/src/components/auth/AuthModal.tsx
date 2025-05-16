import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { X } from "lucide-react";

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalView } = useAuth();

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAuthModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setIsAuthModalOpen]);

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="absolute right-4 top-4">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="16" y1="11" x2="22" y2="11" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
            {authModalView === "login" 
              ? "Sign in to your account" 
              : authModalView === "register" 
                ? "Create your account" 
                : "Reset your password"}
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {authModalView === "login" && <LoginForm />}
          {authModalView === "register" && <RegisterForm />}
          {authModalView === "forgotPassword" && <ForgotPasswordForm />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
