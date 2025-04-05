
import { Sun } from "lucide-react";

const SolarHero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Solar Power Prediction
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Forecast your solar energy production based on panel specifications, 
              location, and weather conditions.
            </p>
            <div className="flex items-center text-yellow-300 font-medium">
              <Sun className="mr-2" />
              Make informed decisions with accurate solar predictions
            </div>
          </div>
          <div className="md:w-2/5">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
              <div className="flex justify-center mb-4">
                <div className="bg-yellow-400 h-24 w-24 rounded-full flex items-center justify-center shadow-lg">
                  <Sun size={64} className="text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2">How it works</h3>
                <p className="opacity-90">
                  Enter your solar panel details and location, and our prediction
                  engine will calculate estimated power generation based on historical
                  weather patterns and solar irradiance data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarHero;
