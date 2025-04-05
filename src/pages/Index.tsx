
import { useState } from "react";
import SolarHero from "@/components/SolarHero";
import PredictionForm from "@/components/PredictionForm";
import ResultsDisplay from "@/components/ResultsDisplay";

const Index = () => {
  const [results, setResults] = useState<null | {
    dailyOutput: number[];
    totalOutput: number;
    efficiency: number;
    weatherConditions: string[];
  }>(null);

  const handlePrediction = (formData: {
    location: string;
    capacity: number;
    angle: number;
    direction: string;
  }) => {
    // Simulate prediction calculation (in a real app, this would call an API)
    const weatherConditions = ["Sunny", "Partly Cloudy", "Sunny", "Sunny", "Cloudy", "Partly Cloudy", "Sunny"];
    
    // Calculate based on capacity, angle and simulated weather
    const efficiencyFactor = 0.7 + (formData.angle / 100) * 0.3;
    const directionMultiplier = formData.direction === "South" ? 1 : 
                               formData.direction === "East" || formData.direction === "West" ? 0.8 : 0.6;
    
    const dailyOutput = weatherConditions.map(condition => {
      const weatherMultiplier = condition === "Sunny" ? 1 : 
                               condition === "Partly Cloudy" ? 0.7 : 0.4;
      return parseFloat((formData.capacity * efficiencyFactor * weatherMultiplier * directionMultiplier).toFixed(2));
    });
    
    const totalOutput = parseFloat(dailyOutput.reduce((sum, val) => sum + val, 0).toFixed(2));
    const efficiency = parseFloat((efficiencyFactor * directionMultiplier * 100).toFixed(1));
    
    setResults({
      dailyOutput,
      totalOutput,
      efficiency,
      weatherConditions
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <SolarHero />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <PredictionForm onSubmit={handlePrediction} />
          </div>
          <div className="lg:col-span-7">
            <ResultsDisplay results={results} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
