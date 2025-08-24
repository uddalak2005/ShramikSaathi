import { useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react"; // check icon for completion

const CustomLoader = ({onClose}) => {
  const steps = [
    "Fetching your account information",
    "Assessing loan applicability",
    "Applying to banks",
    "Application done",
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 3000); // 3s delay
      return () => clearTimeout(timer);
    } else {
      // when last step is reached, mark done
      setLoadingDone(true);
      onClose();
    }
  }, [currentStep, steps.length]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-50">
      {/* Spinner or Check */}
      {!loadingDone ? (
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      ) : (
        <CheckCircle className="h-10 w-10 text-green-600 mb-4" />
      )}

      {/* Loading Text */}
      <p className="text-lg font-medium text-gray-700">
        {steps[currentStep]}
      </p>
    </div>
  );
};

export default CustomLoader;
