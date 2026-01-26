import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { MaterialIcon } from '../components/ui/MaterialIcon';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex items-center justify-center px-6">
      <div className="text-center">
        {/* Large Icon/Illustration Area */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <MaterialIcon 
              iconName="error_outline" 
              size={120} 
              className="text-gray-200 dark:text-zinc-800" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold text-blue-600">404</span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
          Page not found
        </h1>
        <p className="text-gray-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="secondary" 
            iconName="arrow_back" 
            onClick={() => navigate(-1)}>
            Go Back
          </Button>
          
          <Button 
            variant="primary" 
            iconName="home" 
            onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;