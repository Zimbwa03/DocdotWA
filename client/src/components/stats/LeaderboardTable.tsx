import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getLeaderboard } from "@/lib/api";
import { LeaderboardEntry } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Trophy, AlertCircle, Loader2 } from "lucide-react";

// Medical Categories from the Telegram bot code
const CATEGORIES = {
  "Anatomy": [
    "Head and Neck",
    "Upper Limb",
    "Thorax",
    "Lower Limb",
    "Pelvis and Perineum",
    "Neuroanatomy",
    "Abdomen"
  ],
  "Physiology": [
    "Cell",
    "Nerve and Muscle",
    "Blood",
    "Endocrine",
    "Reproductive",
    "Gastrointestinal Tract",
    "Renal",
    "Cardiovascular System",
    "Respiration",
    "Medical Genetics",
    "Neurophysiology"
  ]
};

interface LeaderboardTableProps {
  category?: string;
  subcategory?: string;
}

const LeaderboardTable = ({ category, subcategory }: LeaderboardTableProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const { currentUser } = useAuth();
  
  // Update active tab when category prop changes
  useEffect(() => {
    if (category) {
      setActiveTab(category);
    } else {
      setActiveTab("all");
    }
  }, [category]);
  
  // Fetch leaderboard data
  const { 
    data: leaderboard, 
    isLoading, 
    error,
    refetch
  } = useQuery<LeaderboardEntry[]>({
    queryKey: [`/api/stats/leaderboard${activeTab !== "all" ? `?category=${activeTab}${subcategory ? `&subcategory=${subcategory}` : ''}` : ''}`],
    enabled: true,
  });
  
  // Refetch when tab changes
  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);
  
  // Find user's position in the leaderboard
  const userPosition = leaderboard?.findIndex(entry => entry.userId === currentUser?.uid) ?? -1;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading leaderboard...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Failed to load leaderboard</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            There was an error loading the leaderboard data. Please try again later.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Trophy className="h-10 w-10 text-amber-500 mx-auto mb-2" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No leaderboard data yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Be the first to take quizzes and claim your spot at the top!
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Leaderboard</CardTitle>
        <CardDescription>
          {subcategory 
            ? `Showing top performers for ${category} / ${subcategory}`
            : activeTab === "all" 
              ? "Showing top performers across all categories" 
              : `Showing top performers for ${activeTab}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!subcategory && (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} value={activeTab}>
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="all">All Categories</TabsTrigger>
                <TabsTrigger value="Anatomy">Anatomy</TabsTrigger>
                <TabsTrigger value="Physiology">Physiology</TabsTrigger>
                <TabsTrigger value="Image Quiz">Image Quiz</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry, index) => {
                const isCurrentUser = entry.userId === currentUser?.uid;
                
                // For display, if user is not in top 10, show special highlight
                const shouldHighlightUser = isCurrentUser;
                
                return (
                  <TableRow 
                    key={entry.userId} 
                    className={shouldHighlightUser ? "bg-primary-50 dark:bg-primary-900/20" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                          ${index === 0 ? "bg-yellow-500" : 
                            index === 1 ? "bg-gray-400" : 
                              index === 2 ? "bg-amber-600" : 
                                shouldHighlightUser ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700"}`}>
                          <span className={`text-white font-bold ${
                            shouldHighlightUser ? "text-white" : ""
                          }`}>
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${
                          shouldHighlightUser 
                            ? "bg-primary-500 dark:bg-primary-600" 
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}>
                          <span className="font-medium text-lg">
                            {entry.displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {isCurrentUser ? "You" : entry.displayName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900 dark:text-white">{entry.attempts}</div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        {entry.accuracy.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {entry.streak ? (
                        <div className="flex items-center">
                          <Flame className="text-red-500 mr-1 h-4 w-4" />
                          <span>{entry.streak} days</span>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {/* If user not in top 20 but logged in, show their position at the bottom */}
              {currentUser && userPosition === -1 && (
                <>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 dark:text-gray-400 py-2">
                      <div className="flex items-center justify-center">
                        <span>• • •</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-primary-50 dark:bg-primary-900/20">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">?</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                          <span className="font-medium text-lg">{currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">You</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Take more quizzes to rank</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900 dark:text-white">-</div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                        -
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span>-</span>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
