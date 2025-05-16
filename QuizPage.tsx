import { useParams } from "wouter";
import QuizInterface from "@/components/quizzes/QuizInterface";
import QuizList from "@/components/quizzes/QuizList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";

const QuizPage = () => {
  const params = useParams<{ category?: string; subcategory?: string }>();
  const { category, subcategory } = params;
  
  // Decode the subcategory if it exists
  const decodedSubcategory = subcategory ? decodeURIComponent(subcategory) : undefined;

  return (
    <>
      <Helmet>
        <title>
          {category && category !== "all" 
            ? subcategory 
              ? `${category} / ${decodedSubcategory} Quiz - DocDot` 
              : `${category} Quiz - DocDot` 
            : "Medical Quizzes - DocDot"}
        </title>
        <meta 
          name="description" 
          content={category && category !== "all" 
            ? subcategory 
              ? `Test your knowledge of ${category} / ${decodedSubcategory} with interactive true/false medical quizzes.` 
              : `Test your knowledge of ${category} with interactive true/false medical quizzes.` 
            : "Interactive true/false medical quizzes across various categories to test and enhance your medical knowledge."}
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {category && category !== "all" 
              ? subcategory 
                ? `${category} Quiz: ${decodedSubcategory}` 
                : `${category} Quizzes` 
              : "Medical Quizzes"}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {category && category !== "all" 
              ? subcategory 
                ? `Test your knowledge of ${category} / ${decodedSubcategory} with these true/false questions.` 
                : `Explore ${category} topics and test your knowledge.` 
              : "Select a category or start a random quiz across all medical topics."}
          </p>
        </div>
        
        {/* Quiz content */}
        {category && category !== "all" ? (
          subcategory ? (
            <QuizInterface category={category} subcategory={decodedSubcategory} />
          ) : (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>{category} Quiz Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuizList />
                </CardContent>
              </Card>
              
              <QuizInterface category={category} />
            </div>
          )
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>All Quiz Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <QuizList />
              </CardContent>
            </Card>
            
            <QuizInterface />
          </div>
        )}
      </div>
    </>
  );
};

export default QuizPage;
