import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Heart, CreditCard, Coffee, Gift, Star, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet";

const DonatePage = () => {
  // Define donation tiers
  const donationTiers = [
    {
      name: "Coffee",
      amount: "$5",
      description: "Buy us a coffee to keep us awake while we code! Every little bit helps.",
      icon: <Coffee className="h-10 w-10 text-amber-500" />,
      benefits: ["Support ongoing development", "Our sincere gratitude"],
      color: "bg-amber-500"
    },
    {
      name: "Supporter",
      amount: "$25",
      description: "Become a DocDot supporter and help us expand our quiz database.",
      icon: <Gift className="h-10 w-10 text-primary" />,
      benefits: ["Support ongoing development", "Name in supporters list", "Early access to new features"],
      color: "bg-primary"
    },
    {
      name: "Champion",
      amount: "$100",
      description: "Be a champion for medical education by helping us develop new advanced features.",
      icon: <Star className="h-10 w-10 text-purple-500" />,
      benefits: ["All Supporter benefits", "Ad-free experience forever", "Exclusive study guides", "Vote on new features"],
      color: "bg-purple-500"
    }
  ];
  
  // FAQs about donations
  const donationFaqs = [
    {
      question: "How are donations used?",
      answer: "All donations go directly toward supporting DocDot's operations and development. This includes server costs, database management, development of new features, expanding our question database, and improving the AI tutor capabilities."
    },
    {
      question: "Is my donation tax-deductible?",
      answer: "Currently, DocDot is not registered as a non-profit organization, so donations are not tax-deductible. We're focused on building the best medical education platform possible."
    },
    {
      question: "Can I donate a specific amount?",
      answer: "Absolutely! While we have suggested donation tiers, you can donate any amount you wish. Every contribution helps and is greatly appreciated."
    },
    {
      question: "Do I need to create an account to donate?",
      answer: "No, you don't need an account to make a donation. However, creating an account allows us to provide you with supporter benefits and keep you updated on how your donation is helping."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes! We use industry-standard encryption and secure payment processors. We never store your credit card information on our servers."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Support DocDot - Donations</title>
        <meta 
          name="description" 
          content="Support DocDot's mission to improve medical education through free interactive learning tools. Your donations help us develop new features and maintain the platform."
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
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-pink-100 dark:bg-pink-900/20 mb-4">
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Support DocDot
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            DocDot is a free resource for medical students worldwide. Your donations help us maintain the platform, 
            expand our question database, and develop new features.
          </p>
        </div>
        
        {/* Donation tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {donationTiers.map((tier, index) => (
            <Card key={index} className={`${index === 1 ? 'border-primary dark:border-primary' : ''} hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="h-14 w-14 rounded-full flex items-center justify-center bg-opacity-10" style={{ backgroundColor: `${tier.color}20` }}>
                    {tier.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{tier.amount}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{index > 0 ? "one-time" : "or more"}</span>
                  </div>
                </div>
                <CardTitle className="text-xl mt-4">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" style={{ backgroundColor: tier.color }}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Donate {tier.amount}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Why donate section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Why Donate to DocDot?</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your support makes a real difference in medical education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <CardTitle className="text-lg">Free Access for All</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We're committed to keeping DocDot free for all medical students worldwide. Your donations help us maintain this commitment while still improving the platform.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                </div>
                <CardTitle className="text-lg">Expanded Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your donations allow us to create more high-quality questions, add new categories, and expand our image database with professional medical images.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <CardTitle className="text-lg">Advanced AI Tutor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Help us improve our AI tutor with better medical knowledge, more accurate answers, and personalized learning experiences for medical students.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Custom donation section */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-8 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Custom Donation Amount</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Want to contribute a different amount? Every donation helps, no matter the size.
            </p>
            
            <div className="max-w-md mx-auto">
              <Button size="lg" className="w-full bg-primary hover:bg-primary-600">
                <CreditCard className="mr-2 h-5 w-5" />
                Choose Your Own Amount
              </Button>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Payments are processed securely. You'll receive a receipt by email.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Common questions about supporting DocDot
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {donationFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        
        {/* Contact section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Have Questions?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            If you have any questions about donations or would like to discuss other ways to support DocDot, 
            please don't hesitate to reach out to us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@docdot.org">
              <Button variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Contact Us
              </Button>
            </a>
            <Link href="/ai-tutor">
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Chat with AI Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonatePage;
