import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Zap, 
  Download, 
  Star, 
  Check, 
  ArrowRight,
  Smartphone,
  Monitor,
  Globe
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UploadZone from '../components/UploadZone';
import BeforeAfterCarousel from '../components/BeforeAfterCarousel';
import PricingSection from '../components/PricingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';

export default function LandingPage() {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      title: "AI-Powered Precision",
      description: "Advanced AI technology removes backgrounds with professional quality in seconds"
    },
    {
      icon: <Upload className="w-8 h-8 text-purple-600" />,
      title: "Easy Upload",
      description: "Drag and drop your images or upload from your device with support for JPEG, PNG, and WebP"
    },
    {
      icon: <Download className="w-8 h-8 text-purple-600" />,
      title: "Instant Download",
      description: "Download your processed images immediately in high resolution"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-purple-600" />,
      title: "Mobile Optimized",
      description: "Works perfectly on all devices with responsive design and touch-friendly interface"
    },
    {
      icon: <Monitor className="w-8 h-8 text-purple-600" />,
      title: "Desktop Power",
      description: "Full-featured desktop experience with advanced tools and keyboard shortcuts"
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      title: "Cloud Storage",
      description: "Your images are securely stored in the cloud with easy access from anywhere"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload a photo to get started",
      description: "Drag and drop your image or click to browse. We support JPEG, PNG, and WebP formats up to 10MB."
    },
    {
      number: "02",
      title: "Let our AI do the work",
      description: "Our advanced AI technology analyzes your image and removes the background with precision in under 5 seconds."
    },
    {
      number: "03",
      title: "Download and use your new image",
      description: "Get your processed image instantly in high resolution, ready for your projects and social media."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
              Free image backgrounds for first-time users
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Background Remover
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Free image background AI for fast and creative 
              <br className="hidden sm:block" />
              AI-powered background removal
            </p>
          </div>

          {/* Upload Zone */}
          <div className="max-w-2xl mx-auto mb-16">
            <UploadZone onUpload={handleGetStarted} />
            <p className="text-center text-sm text-gray-500 mt-4">
              or drop an image here
            </p>
          </div>

          {/* Before/After Examples */}
          <BeforeAfterCarousel />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              You might also be interested in
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Remove backgrounds in 3 easy steps
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full text-xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Go further with Remove.Help
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            We're excited to see more features to make 
            your photos even more amazing. Get started 
            today and see the difference AI can make.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100"
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
