import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCheck, 
  Trophy, 
  Percent 
} from "lucide-react";

const StatCards = () => {
  const { userData, currentUser } = useAuth();
  
  const stats = {
    totalAttempts: userData?.totalAttempts || 0,
    streak: userData?.streak || 0,
    accuracy: userData?.totalAttempts 
      ? Math.round((userData.correctAnswers / userData.totalAttempts) * 100) 
      : 0
  };

  // If user is not logged in, use default stats for display
  const displayStats = currentUser ? stats : {
    totalAttempts: 157,
    streak: 8,
    accuracy: 84
  };

  return (
    <div className="relative -mt-12 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary rounded-md p-3">
                  <CheckCheck className="text-white text-xl" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Quizzes Completed
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {displayStats.totalAttempts}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <Trophy className="text-white text-xl" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Current Streak
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {displayStats.streak} days
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-amber-500 rounded-md p-3">
                  <Percent className="text-white text-xl" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Accuracy Rate
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {displayStats.accuracy}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatCards;
