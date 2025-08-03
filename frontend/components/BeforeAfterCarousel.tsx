import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const examples = [
  {
    id: 1,
    before: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    after: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    title: "Portrait"
  },
  {
    id: 2,
    before: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    title: "Product"
  },
  {
    id: 3,
    before: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop",
    title: "Pet"
  }
];

export default function BeforeAfterCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="flex justify-center items-center space-x-8">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="hidden sm:flex"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <div
              key={example.id}
              className={`transition-all duration-300 ${
                index === currentIndex ? 'opacity-100 scale-105' : 'opacity-70'
              }`}
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img
                      src={example.before}
                      alt={`${example.title} before`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Before
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src={example.after}
                      alt={`${example.title} after`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                      After
                    </div>
                  </div>
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-medium text-gray-900">{example.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="hidden sm:flex"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile navigation dots */}
      <div className="flex justify-center mt-6 sm:hidden">
        {examples.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full mx-1 transition-colors ${
              index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
