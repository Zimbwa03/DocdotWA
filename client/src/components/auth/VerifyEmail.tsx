import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { verifyEmail } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, MailCheck, AlertTriangle } from "lucide-react";

const VerifyEmail = () => {
  const [, setLocation] = useLocation();
  const { currentUser, setIsAuthModalOpen, setAuthModalView } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) {
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  const handleResendEmail = async () => {
    if (!currentUser) return;

    setIsSending(true);
    try {
      await verifyEmail(currentUser);
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send verification email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleLogin = () => {
    setAuthModalView("login");
    setIsAuthModalOpen(true);
    setLocation("/");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            {currentUser.emailVerified ? (
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <MailCheck className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            )}
          </div>
          <CardTitle className="text-center text-2xl">
            {currentUser.emailVerified ? "Email Verified" : "Verify Your Email"}
          </CardTitle>
          <CardDescription className="text-center">
            {currentUser.emailVerified
              ? "Thank you for verifying your email address."
              : `We've sent a verification email to ${currentUser.email}. Please check your inbox and click the verification link.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!currentUser.emailVerified && (
            <div className="bg-yellow-50 p-4 rounded-md flex items-start gap-3 mt-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Important:</p>
                <p>
                  If you don't verify your email, you may not be able to access all features of the platform.
                  Check your spam folder if you don't see the email in your inbox.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {currentUser.emailVerified ? (
            <Button
              onClick={() => setLocation("/")}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                onClick={handleResendEmail}
                disabled={isSending}
                className="w-full"
              >
                {isSending ? "Sending..." : "Resend Verification Email"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                className="w-full"
              >
                I'll verify later
              </Button>
            </>
          )}
          {!currentUser.emailVerified && (
            <Button
              variant="link"
              onClick={handleLogin}
              className="w-full"
            >
              Sign in with another account
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
