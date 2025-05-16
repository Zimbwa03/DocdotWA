import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Image } from "lucide-react";

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

const CategorySection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Choose Your Study Area
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
          Comprehensive quizzes across major medical disciplines, from anatomy to physiology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Anatomy Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="relative h-48">
            {/* Anatomical diagram image */}
            <img 
              src="https://pixabay.com/get/gb95afc4c4711b3c1d1214b2f977d14a80cf88fa2b13827185fec33b8420f9ac4a0d4a0d590a303c2a09687105ff2be1762c8ec48bf493576afcf4fbb9ff77333_1280.jpg" 
              alt="Anatomical diagram" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white">Anatomy</h3>
              <p className="text-white/80">{CATEGORIES.Anatomy.length} subcategories</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.Anatomy.map((subcategory) => (
                <Link key={subcategory} href={`/quiz/Anatomy/${encodeURIComponent(subcategory)}`}>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                    {subcategory}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/quiz/Anatomy">
                <Button className="inline-flex items-center px-4 py-2">
                  Start Anatomy Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Physiology Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="relative h-48">
            {/* Physiology image */}
            <img 
              src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80" 
              alt="Physiology diagram" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white">Physiology</h3>
              <p className="text-white/80">{CATEGORIES.Physiology.length} subcategories</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.Physiology.slice(0, 7).map((subcategory) => (
                <Link key={subcategory} href={`/quiz/Physiology/${encodeURIComponent(subcategory)}`}>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                    {subcategory}
                  </span>
                </Link>
              ))}
              <Link href="/quiz/Physiology">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                  And more...
                </span>
              </Link>
            </div>
            <div className="mt-6">
              <Link href="/quiz/Physiology">
                <Button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 focus:ring-green-500">
                  Start Physiology Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Quiz Card */}
      <div className="mt-12">
        <Card className="bg-gray-50 dark:bg-gray-800/50 overflow-hidden border border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/3">
                {/* Histology slide image */}
                <img 
                  src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Histology slide visualization" 
                  className="h-60 md:h-full w-full object-cover" 
                />
              </div>
              <div className="p-8 md:w-2/3">
                <div className="uppercase tracking-wide text-sm text-primary font-semibold">Special Feature</div>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Image Recognition Quiz</h2>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Test your visual diagnostic skills with our image-based quizzes featuring histology slides and cadaver images. Perfect for visual learners!
                </p>
                <div className="mt-6">
                  <Link href="/image-quiz">
                    <Button variant="default" className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 focus:ring-amber-500">
                      Try Image Quiz
                      <Image className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategorySection;
