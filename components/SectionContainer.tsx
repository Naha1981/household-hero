import React from 'react';
import LoadingSpinner from './LoadingSpinner'; // Ensure LoadingSpinner is imported if used

interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ title, children, isLoading, loadingText, className = "" }) => {
  return (
    <div className={`p-4 sm:p-6 bg-white shadow-xl rounded-xl ${className}`}>
      <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 pb-3 border-b-2 border-primary/20">
        {title}
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <LoadingSpinner text={loadingText || "Loading..."} />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default SectionContainer;