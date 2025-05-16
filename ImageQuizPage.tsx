import { useParams } from "wouter";
import { Link } from "wouter";
import ImageQuiz from "@/components/quizzes/ImageQuiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Image } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";

// Sample image categories
const IMAGE_CATEGORIES = {
  "Anatomy": [
    "Head and Neck",
    "Upper Limb",
    "Thorax",
    "Lower Limb",
    "Abdomen",
    "Pelvis"
  ],
  "Histology": [
    "Epithelial Tissue",
    "Connective Tissue",
    "Muscle Tissue",
    "Nervous Tissue",
    "Cardiovascular System",
    "Respiratory System",
    "Digestive System",
    "Urinary System",
    "Reproductive System"
  ]
};

const ImageQuizPage = () => {
  const params = useParams<{ category?: string; subcategory?: string }>();
  const { category, subcategory } = params;
  const [activeTab, setActiveTab] = useState(category || "all");
  
  // Decode the subcategory if it exists
  const decodedSubcategory = subcategory ? decodeURIComponent(subcategory) : undefined;

  return (
    <>
      <Helmet>
        <title>
          {category 
            ? subcategory 
              ? `${category} / ${decodedSubcategory} Image Quiz - DocDot` 
              : `${category} Image Quiz - DocDot` 
            : "Medical Image Quiz - DocDot"}
        </title>
        <meta 
          name="description" 
          content="Test your visual diagnostic skills with our image-based quizzes featuring histology slides and cadaver images. Perfect for visual learners!"
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
            <Image className="mr-3 h-8 w-8 text-amber-500" />
            {category 
              ? subcategory 
                ? `${category} Image Quiz: ${decodedSubcategory}` 
                : `${category} Image Quiz` 
              : "Medical Image Quiz"}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Test your visual diagnostic skills with our image-based quizzes featuring histology slides and cadaver images.
          </p>
        </div>
        
        {/* Category selection */}
        {!subcategory && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Image Quiz Categories</CardTitle>
              <CardDescription>Select a category to focus your image recognition practice</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="all">All Images</TabsTrigger>
                  <TabsTrigger value="Anatomy">Cadaver Anatomy</TabsTrigger>
                  <TabsTrigger value="Histology">Histology</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <div className="relative h-48">
                        <img 
                          src="https://images.unsplash.com/photo-1530210124550-912dc1381cb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80" 
                          alt="Cadaver anatomy" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                          <h3 className="text-2xl font-bold text-white">Cadaver Anatomy</h3>
                          <p className="text-white/80">{IMAGE_CATEGORIES.Anatomy.length} subcategories</p>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Identify structures from real cadaver images. Test your practical anatomy knowledge.
                        </p>
                        <Link href="/image-quiz/Anatomy">
                          <Button variant="default" className="w-full">Start Anatomy Image Quiz</Button>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <div className="relative h-48">
                        <img 
                          src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80" 
                          alt="Histology slide" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                          <h3 className="text-2xl font-bold text-white">Histology</h3>
                          <p className="text-white/80">{IMAGE_CATEGORIES.Histology.length} subcategories</p>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Identify tissues, cells, and structures from microscopic slides across all body systems.
                        </p>
                        <Link href="/image-quiz/Histology">
                          <Button variant="default" className="w-full bg-amber-500 hover:bg-amber-600">Start Histology Image Quiz</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="Anatomy" className="mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {IMAGE_CATEGORIES.Anatomy.map((subcat) => (
                      <Link key={subcat} href={`/image-quiz/Anatomy/${encodeURIComponent(subcat)}`}>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer">
                          <h3 className="font-medium text-gray-900 dark:text-white">{subcat}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Cadaver images</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="Histology" className="mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {IMAGE_CATEGORIES.Histology.map((subcat) => (
                      <Link key={subcat} href={`/image-quiz/Histology/${encodeURIComponent(subcat)}`}>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all hover:border-amber-300 dark:hover:border-amber-700 cursor-pointer">
                          <h3 className="font-medium text-gray-900 dark:text-white">{subcat}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Microscopic slides</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        {/* Image Quiz component */}
        <ImageQuiz 
          category={category || activeTab === "all" ? undefined : activeTab} 
          subcategory={decodedSubcategory} 
        />
      </div>
    </>
  );
};

export default ImageQuizPage;
