import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown } from 'lucide-react';

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "one-time",
    credits: "5 credits",
    features: [
      "5 background removals",
      "High-quality results",
      "JPEG, PNG, WebP support",
      "Basic download options"
    ],
    buttonText: "Get Started",
    popular: false
  },
  {
    name: "Pro Monthly",
    price: "$9.99",
    period: "per month",
    credits: "500 credits",
    features: [
      "500 background removals/month",
      "High-quality results",
      "All file formats",
      "Priority processing",
      "Advanced download options",
      "Email support"
    ],
    buttonText: "Start Free Trial",
    popular: true
  },
  {
    name: "Pro Annual",
    price: "$99.99",
    period: "per year",
    credits: "6000 credits",
    features: [
      "6000 background removals/year",
      "2 months free",
      "High-quality results",
      "All file formats",
      "Priority processing",
      "Advanced download options",
      "Priority email support"
    ],
    buttonText: "Start Free Trial",
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the plan that works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${
                plan.popular 
                  ? 'border-purple-500 shadow-lg scale-105' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                  <Crown className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {plan.period}
                  </span>
                </div>
                <p className="text-purple-600 font-medium mt-2">
                  {plan.credits}
                </p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
