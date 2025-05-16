import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [, setLocation] = useLocation();
  const { setIsAuthModalOpen, setAuthModalView } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  // Reset to login form if user is already authenticated
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setEmailSent(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error: any) {
      let errorMessage = "Failed to send password reset email. Please try again.";
      
      // Check for specific Firebase error messages
      if (error.message.includes("user-not-found")) {
        errorMessage = "No account found with this email. Please check and try again.";
      }
      
      toast({
        title: "Password reset failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    setAuthModalView("login");
    setIsAuthModalOpen(true);
    setLocation("/");
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">
            {emailSent ? "Check Your Email" : "Reset Your Password"}
          </CardTitle>
          <CardDescription className="text-center">
            {emailSent
              ? `We've sent a password reset link to ${email}. Please check your inbox.`
              : "Enter your email address and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>
        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Your email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !email}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button
                variant="ghost"
                onClick={handleBackToLogin}
                type="button"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground mb-4">
              If you don't see the email in your inbox, check your spam folder. The link in the email will expire after a certain time.
            </p>
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full"
            >
              Try another email
            </Button>
            <Button
              onClick={handleBackToLogin}
              className="w-full"
            >
              Back to Login
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
