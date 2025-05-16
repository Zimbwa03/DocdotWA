import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQuizCategories } from "@/lib/api";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Brain, Heart, AlertCircle, Loader2 } from "lucide-react";

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

interface CategoryCardProps {
  name: string;
  subcategories: string[];
  iconComponent: React.ReactNode;
  accentColor: string;
  bgClass: string;
}

const CategoryCard = ({ name, subcategories, iconComponent, accentColor, bgClass }: CategoryCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className={`${bgClass} rounded-t-lg`}>
        <div className="flex items-center gap-3">
          {iconComponent}
          <CardTitle className="text-white">{name}</CardTitle>
        </div>
        <CardDescription className="text-white/80">
          {subcategories.length} subcategories
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {subcategories.map((subcategory) => (
            <Link 
              key={subcategory} 
              href={`/quiz/${name}/${encodeURIComponent(subcategory)}`}
            >
              <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${accentColor} cursor-pointer transition-colors`}>
                {subcategory}
              </span>
            </Link>
          ))}
        </div>
        <Link href={`/quiz/${name}`}>
          <Button className="w-full">
            Start {name} Quiz
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const QuizList = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch quiz categories from API
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/quiz/categories'],
    queryFn: () => getQuizCategories(),
    // For now, use the predefined CATEGORIES if API call fails
    initialData: CATEGORIES,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading quiz categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Failed to load categories</h3>
        <p className="text-gray-500 dark:text-gray-400">Please try again later.</p>
      </div>
    );
  }

  const displayCategories = categories || CATEGORIES;

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All Categories</TabsTrigger>
            <TabsTrigger value="Anatomy">Anatomy</TabsTrigger>
            <TabsTrigger value="Physiology">Physiology</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryCard 
              name="Anatomy" 
              subcategories={displayCategories["Anatomy"]} 
              iconComponent={<Brain className="h-6 w-6 text-white" />}
              accentColor="bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300"
              bgClass="bg-gradient-to-r from-primary-600 to-primary-700"
            />
            <CategoryCard 
              name="Physiology" 
              subcategories={displayCategories["Physiology"]} 
              iconComponent={<Heart className="h-6 w-6 text-white" />}
              accentColor="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
              bgClass="bg-gradient-to-r from-green-600 to-green-700"
            />
          </div>
          <div className="mt-6 flex justify-center">
            <Link href="/quiz/all">
              <Button size="lg" variant="outline">
                Start Random Quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="Anatomy" className="mt-0">
          <CategoryCard 
            name="Anatomy" 
            subcategories={displayCategories["Anatomy"]} 
            iconComponent={<Brain className="h-6 w-6 text-white" />}
            accentColor="bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300"
            bgClass="bg-gradient-to-r from-primary-600 to-primary-700"
          />
        </TabsContent>
        
        <TabsContent value="Physiology" className="mt-0">
          <CategoryCard 
            name="Physiology" 
            subcategories={displayCategories["Physiology"]} 
            iconComponent={<Heart className="h-6 w-6 text-white" />}
            accentColor="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
            bgClass="bg-gradient-to-r from-green-600 to-green-700"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizList;
