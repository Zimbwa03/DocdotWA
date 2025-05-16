import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { auth, verifyEmail } from "@/lib/firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Shield, 
  LogOut, 
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { Helmet } from "react-helmet";

const ProfilePage = () => {
  const [, setLocation] = useLocation();
  const { currentUser, logout, userData, refreshUserData } = useAuth();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  
  useEffect(() => {
    if (!currentUser) {
      setLocation("/");
      return;
    }
    
    // Initialize form with current user data
    setDisplayName(currentUser.displayName || "");
    setEmail(currentUser.email || "");
  }, [currentUser, setLocation]);
  
  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    
    setIsUpdating(true);
    try {
      if (displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName });
        await refreshUserData();
        
        toast({
          title: "Profile updated",
          description: "Your display name has been updated successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUpdateEmail = async () => {
    if (!currentUser || !email) return;
    
    setIsUpdating(true);
    try {
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
        await refreshUserData();
        
        toast({
          title: "Email updated",
          description: "Your email has been updated successfully. Please verify your new email.",
        });
      }
    } catch (error: any) {
      let errorMessage = "Failed to update email. Try logging out and in again.";
      
      if (error.code === "auth/requires-recent-login") {
        errorMessage = "For security reasons, please log out and log in again to change your email.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use by another account.";
      }
      
      toast({
        title: "Failed to update email",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUpdatePassword = async () => {
    if (!currentUser) return;
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new password and confirmation match.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      await updatePassword(currentUser, newPassword);
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      let errorMessage = "Failed to update password.";
      
      if (error.code === "auth/requires-recent-login") {
        errorMessage = "For security reasons, please log out and log in again to change your password.";
      }
      
      toast({
        title: "Failed to update password",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleSendVerificationEmail = async () => {
    if (!currentUser) return;
    
    setSendingVerification(true);
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
      setSendingVerification(false);
    }
  };

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Helmet>
        <title>Your Profile - DocDot</title>
        <meta 
          name="description" 
          content="Manage your account settings, update your profile information, and view your progress."
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
            <User className="mr-3 h-8 w-8 text-primary" />
            Your Profile
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Manage your account settings and view your progress
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {currentUser.displayName || "User"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentUser.email}
                    </p>
                    
                    {!currentUser.emailVerified && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Email not verified
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <Link href="/stats">
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                            <line x1="18" y1="9" x2="18" y2="18"></line>
                            <line x1="12" y1="6" x2="12" y2="18"></line>
                            <line x1="6" y1="12" x2="6" y2="18"></line>
                          </svg>
                          My Statistics
                        </Button>
                      </Link>
                      
                      <Link href="/leaderboard">
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 22l-9-4-9 4V2h18z"></path>
                          </svg>
                          Leaderboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You'll need to sign in again to access your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="email">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="password">
                  <Lock className="mr-2 h-4 w-4" />
                  Password
                </TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information and how it appears across the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        placeholder="Your display name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={isUpdating}
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This is the name that will be displayed on your profile and on the leaderboard.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Account Statistics</Label>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Total Quizzes</span>
                          <span className="font-medium">{userData?.totalAttempts || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Current Streak</span>
                          <span className="font-medium">{userData?.streak || 0} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Best Streak</span>
                          <span className="font-medium">{userData?.maxStreak || 0} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Last Quiz Date</span>
                          <span className="font-medium">{userData?.lastQuizDate || "Never"}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <Link href="/stats">
                          <span className="text-primary hover:underline inline-flex items-center">
                            View detailed statistics
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </span>
                        </Link>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="outline" onClick={() => refreshUserData()} disabled={isUpdating}>
                      Reset
                    </Button>
                    <Button onClick={handleUpdateProfile} disabled={isUpdating || !displayName}>
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Email Tab */}
              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Settings</CardTitle>
                    <CardDescription>
                      Update your email address and verification status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isUpdating}
                      />
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Email Verification
                          </span>
                        </div>
                        
                        {currentUser.emailVerified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Not Verified
                          </span>
                        )}
                      </div>
                      
                      {!currentUser.emailVerified && (
                        <div className="pt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Please verify your email address to access all features of the platform.
                          </p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleSendVerificationEmail}
                            disabled={sendingVerification}
                          >
                            {sendingVerification ? "Sending..." : "Resend Verification Email"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setEmail(currentUser?.email || "")}
                      disabled={isUpdating}
                    >
                      Reset
                    </Button>
                    <Button 
                      onClick={handleUpdateEmail}
                      disabled={isUpdating || !email || email === currentUser?.email}
                    >
                      {isUpdating ? "Updating..." : "Update Email"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Password Tab */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isUpdating}
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Must be at least 6 characters long.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isUpdating}
                      />
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-md p-4">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                            Important Security Information
                          </p>
                          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                            For security reasons, you may be asked to sign in again after changing your password.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      disabled={isUpdating}
                    >
                      Reset
                    </Button>
                    <Button 
                      onClick={handleUpdatePassword}
                      disabled={isUpdating || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    >
                      {isUpdating ? "Updating..." : "Update Password"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
