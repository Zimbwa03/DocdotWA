import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getUserStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  BarChart3, 
  CheckCheck, 
  Trophy, 
  Percent, 
  Clock, 
  Calendar, 
  Flame,
  Medal,
  Target,
  Brain,
  Loader2
} from "lucide-react";

const UserStats = () => {
  const [activeTab, setActiveTab] = useState("overall");
  const { currentUser, userData } = useAuth();
  
  // Fetch user stats if user is logged in
  const { data: stats, isLoading } = useQuery({
    queryKey: [`/api/stats/user/${currentUser?.uid}`],
    enabled: !!currentUser?.uid,
  });
  
  // Use auth context data if API data is not available
  const userStats = stats || userData;
  
  if (!currentUser) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Sign in to view your stats</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create an account or sign in to track your progress and see detailed statistics.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/">
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={() => {
                  // Let the Auth context handle this
                }}
              >
                Sign In
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading your stats...</span>
      </div>
    );
  }
  
  if (!userStats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No stats available yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start taking quizzes to build your stats and track your progress.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/quiz/all">
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Start a Quiz
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate progress stats
  const totalAttempts = userStats.totalAttempts || 0;
  const correctAnswers = userStats.correctAnswers || 0;
  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
  const streak = userStats.streak || 0;
  const maxStreak = userStats.maxStreak || 0;
  const lastQuizDate = userStats.lastQuizDate ? new Date(userStats.lastQuizDate) : null;
  
  // Get category stats
  const categoryStats = userStats.categoryStats || {};
  
  // Group category stats by main category
  const groupedStats: Record<string, { attempts: number; correct: number; subcategories: Record<string, { attempts: number; correct: number }> }> = {};
  
  Object.entries(categoryStats).forEach(([key, stats]) => {
    if (key.includes('/')) {
      // Handle subcategories (category/subcategory format)
      const [category, subcategory] = key.split('/');
      
      if (!groupedStats[category]) {
        groupedStats[category] = { attempts: 0, correct: 0, subcategories: {} };
      }
      
      groupedStats[category].attempts += stats.attempts;
      groupedStats[category].correct += stats.correct;
      groupedStats[category].subcategories[subcategory] = stats;
    } else {
      // Handle main categories
      if (!groupedStats[key]) {
        groupedStats[key] = { attempts: 0, correct: 0, subcategories: {} };
      }
      
      groupedStats[key].attempts += stats.attempts;
      groupedStats[key].correct += stats.correct;
    }
  });
  
  // Get achievement data
  const achievements = [
    {
      id: "quiz-master",
      name: "Quiz Master",
      description: "Completed 100+ quizzes",
      icon: <CheckCheck className="h-5 w-5 text-primary-600 dark:text-primary-400" />,
      achieved: totalAttempts >= 100
    },
    {
      id: "hot-streak",
      name: "Hot Streak",
      description: "5+ days consecutive study",
      icon: <Flame className="h-5 w-5 text-red-600 dark:text-red-400" />,
      achieved: streak >= 5
    },
    {
      id: "accuracy-expert",
      name: "Accuracy Expert",
      description: "80%+ overall accuracy",
      icon: <Target className="h-5 w-5 text-green-600 dark:text-green-400" />,
      achieved: accuracy >= 80 && totalAttempts >= 20
    },
    {
      id: "anatomy-expert",
      name: "Anatomy Expert",
      description: "90%+ in Anatomy quizzes",
      icon: <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      achieved: groupedStats["Anatomy"]?.attempts > 10 && 
                (groupedStats["Anatomy"]?.correct / groupedStats["Anatomy"]?.attempts) * 100 >= 90
    },
    {
      id: "marathon-learner",
      name: "Marathon Learner",
      description: "Completed 10+ quizzes in one day",
      icon: <Medal className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      achieved: totalAttempts >= 10
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Overall Performance Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Overall Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className="relative h-40 w-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 dark:text-gray-800"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary-600 dark:text-primary-400 -rotate-90 origin-center"
                  strokeWidth="10"
                  strokeDasharray={Math.PI * 80}
                  strokeDashoffset={Math.PI * 80 * (1 - accuracy / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{accuracy}%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Accuracy</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
              <div className="flex justify-center mb-1">
                <CheckCheck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Questions</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{totalAttempts}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
              <div className="flex justify-center mb-1">
                <Flame className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{streak} days</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
              <div className="flex justify-center mb-1">
                <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Best Streak</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{maxStreak} days</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
              <div className="flex justify-center mb-1">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Quiz</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {lastQuizDate ? lastQuizDate.toLocaleDateString() : "Never"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Category Performance Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Performance by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="overall">Overall Categories</TabsTrigger>
              <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overall" className="space-y-4">
              {Object.entries(groupedStats).length > 0 ? (
                Object.entries(groupedStats).map(([category, data]) => {
                  const categoryAccuracy = data.attempts > 0 
                    ? Math.round((data.correct / data.attempts) * 100) 
                    : 0;
                  
                  let colorClass = "bg-primary-600 dark:bg-primary-400";
                  if (category === "Anatomy") {
                    colorClass = "bg-primary-600 dark:bg-primary-400";
                  } else if (category === "Physiology") {
                    colorClass = "bg-green-600 dark:bg-green-400";
                  } else if (category === "Image Quiz") {
                    colorClass = "bg-amber-600 dark:bg-amber-400";
                  }
                  
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{categoryAccuracy}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={categoryAccuracy}
                          className={`h-2.5`}
                          indicatorClassName={colorClass}
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-28">
                          {data.correct}/{data.attempts} correct
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400">No category data available yet. Start taking quizzes!</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="subcategories" className="space-y-6">
              {Object.entries(groupedStats).length > 0 ? (
                Object.entries(groupedStats).map(([category, data]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{category}</h4>
                    {Object.keys(data.subcategories).length > 0 ? (
                      Object.entries(data.subcategories).map(([subcategory, subcatData]) => {
                        const subcatAccuracy = subcatData.attempts > 0 
                          ? Math.round((subcatData.correct / subcatData.attempts) * 100) 
                          : 0;
                        
                        let colorClass = "bg-primary-600 dark:bg-primary-400";
                        if (category === "Anatomy") {
                          colorClass = "bg-primary-600 dark:bg-primary-400";
                        } else if (category === "Physiology") {
                          colorClass = "bg-green-600 dark:bg-green-400";
                        } else if (category === "Image Quiz") {
                          colorClass = "bg-amber-600 dark:bg-amber-400";
                        }
                        
                        return (
                          <div key={subcategory} className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subcategory}</span>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subcatAccuracy}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={subcatAccuracy}
                                className={`h-2.5`}
                                indicatorClassName={colorClass}
                              />
                              <span className="text-xs text-gray-500 dark:text-gray-400 w-28">
                                {subcatData.correct}/{subcatData.attempts} correct
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 pl-4">No subcategory data available.</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400">No subcategory data available yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <Link href="/leaderboard">
              <span className="text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm inline-flex items-center">
                View global leaderboard 
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* Achievements Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Your Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`flex items-center p-3 rounded-lg ${
                achievement.achieved 
                  ? "bg-primary-50 dark:bg-primary-900/20" 
                  : "bg-gray-100 dark:bg-gray-800/50 opacity-60"
              }`}
            >
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                achievement.achieved 
                  ? "bg-primary-100 dark:bg-primary-900/50" 
                  : "bg-gray-200 dark:bg-gray-700"
              }`}>
                {achievement.icon}
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{achievement.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
              </div>
              {achievement.achieved && (
                <span className="ml-auto bg-primary-200 dark:bg-primary-900 text-primary-800 dark:text-primary-300 text-xs font-medium px-2.5 py-0.5 rounded">
                  Achieved
                </span>
              )}
            </div>
          ))}
          
          <div className="mt-6 text-center">
            <Link href="/quiz/all">
              <button className="text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm inline-flex items-center">
                Take more quizzes to earn achievements
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
