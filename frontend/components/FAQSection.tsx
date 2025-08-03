import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Why use Remove.Help?",
    answer: "Remove.Help uses advanced AI technology to provide professional-quality background removal in seconds. It's faster, more accurate, and more affordable than traditional editing methods."
  },
  {
    question: "How to remove background from picture?",
    answer: "Simply upload your image to our platform, and our AI will automatically detect and remove the background. The process takes less than 5 seconds and requires no technical skills."
  },
  {
    question: "Can I remove the background on mobile?",
    answer: "Yes! Remove.Help is fully optimized for mobile devices. You can upload images from your camera roll or take new photos directly within the app."
  },
  {
    question: "Is my background remover too fast?",
    answer: "Our AI processes images in under 5 seconds while maintaining high quality. The speed doesn't compromise the accuracy of the background removal."
  },
  {
    question: "How can I change my background color?",
    answer: "After removing the background, you can download the image with a transparent background and add any color or image background using your preferred editing software."
  },
  {
    question: "Who can benefit from using the background removal tool?",
    answer: "Content creators, e-commerce businesses, photographers, marketers, social media managers, and anyone who needs to quickly remove backgrounds from images."
  },
  {
    question: "Why is it important to remove the background of product pictures?",
    answer: "Clean product images with removed backgrounds look more professional, increase conversion rates, and are required by many e-commerce platforms and marketplaces."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            You asked, we answered
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-900">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
