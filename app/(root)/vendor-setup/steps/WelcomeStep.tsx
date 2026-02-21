interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome to the Marketplace!</h2>
      
      <div className="space-y-4 text-gray-600 mb-10 flex-1">
        <p>
          Thank you for choosing Atlaze to power your online store! This quick setup wizard will help you configure the basic settings. 
          <span className="font-semibold text-gray-800"> It's completely optional and shouldn't take longer than two minutes.</span>
        </p>
        
        <p>
          No time right now? If you don't want to go through the wizard, you can skip and return to the Store!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
        <button
          onClick={onNext}
          className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-8 rounded-md transition-colors w-full sm:w-auto text-center"
        >
          Let's Go!
        </button>
        <button
          onClick={() => window.location.href = "/"}
          className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-8 rounded-md transition-colors w-full sm:w-auto text-center"
        >
          Not right now
        </button>
      </div>
    </div>
  );
}
