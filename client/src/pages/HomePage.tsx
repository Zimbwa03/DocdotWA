import HeroSection from "@/components/home/HeroSection";
import StatCards from "@/components/home/StatCards";
import CategorySection from "@/components/home/CategorySection";
import CTASection from "@/components/home/CTASection";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet";

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Helmet>
        <title>DocDot - Interactive Medical Education Platform</title>
        <meta 
          name="description" 
          content="Enhance your medical knowledge with interactive quizzes, AI tutoring, and performance tracking. Perfect for medical students at all levels."
        />
      </Helmet>
      
      <div>
        <HeroSection />
        
        {/* Only show stat cards if user is authenticated or for demo purposes */}
        <StatCards />
        
        <CategorySection />
        
        <CTASection />
      </div>
    </>
  );
};

export default HomePage;
