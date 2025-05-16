import { Switch, Route } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";
import QuizPage from "@/pages/QuizPage";
import ImageQuizPage from "@/pages/ImageQuizPage";
import StatsPage from "@/pages/StatsPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ResourcesPage from "@/pages/ResourcesPage";
import AiTutorPage from "@/pages/AiTutorPage";
import ProfilePage from "@/pages/ProfilePage";
import DonatePage from "@/pages/DonatePage";
import AnalyticsDashboardPage from "@/pages/AnalyticsDashboardPage";
import NotFound from "@/pages/not-found";
import VerifyEmail from "@/components/auth/VerifyEmail";
import ForgotPassword from "@/components/auth/ForgotPassword";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";

function App() {
  const { isAuthModalOpen } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/quiz/:category/:subcategory?" component={QuizPage} />
          <Route path="/image-quiz" component={ImageQuizPage} />
          <Route path="/stats" component={StatsPage} />
          <Route path="/analytics" component={AnalyticsDashboardPage} />
          <Route path="/leaderboard" component={LeaderboardPage} />
          <Route path="/resources" component={ResourcesPage} />
          <Route path="/ai-tutor" component={AiTutorPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/donate" component={DonatePage} />
          <Route path="/verify-email" component={VerifyEmail} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      {isAuthModalOpen && <AuthModal />}
    </div>
  );
}

export default App;
