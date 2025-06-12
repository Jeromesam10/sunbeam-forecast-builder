
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import SolarHero from "@/components/SolarHero";
import PredictionForm from "@/components/PredictionForm";
import ResultsDisplay from "@/components/ResultsDisplay";

const Index = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<null | {
    dailyOutput: number[];
    totalOutput: number;
    efficiency: number;
    weatherConditions: string[];
    duration: string;
  }>(null);
  const [showKPIs, setShowKPIs] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("1 week");

  const handlePrediction = (formData: {
    location: string;
    capacity: number;
    angle: number;
    direction: string;
  }) => {
    // Generate data based on selected duration
    const getDurationData = (duration: string) => {
      switch (duration) {
        case "3 months":
          return Array.from({ length: 90 }, (_, i) => {
            const weatherTypes = ["Sunny", "Partly Cloudy", "Cloudy"];
            const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            const weatherMultiplier = randomWeather === "Sunny" ? 1 : 
                                    randomWeather === "Partly Cloudy" ? 0.7 : 0.4;
            const efficiencyFactor = 0.7 + (formData.angle / 100) * 0.3;
            const directionMultiplier = formData.direction === "South" ? 1 : 
                                       formData.direction === "East" || formData.direction === "West" ? 0.8 : 0.6;
            return {
              output: parseFloat((formData.capacity * efficiencyFactor * weatherMultiplier * directionMultiplier).toFixed(2)),
              weather: randomWeather
            };
          });
        case "6 months":
          return Array.from({ length: 180 }, (_, i) => {
            const weatherTypes = ["Sunny", "Partly Cloudy", "Cloudy"];
            const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            const weatherMultiplier = randomWeather === "Sunny" ? 1 : 
                                    randomWeather === "Partly Cloudy" ? 0.7 : 0.4;
            const efficiencyFactor = 0.7 + (formData.angle / 100) * 0.3;
            const directionMultiplier = formData.direction === "South" ? 1 : 
                                       formData.direction === "East" || formData.direction === "West" ? 0.8 : 0.6;
            return {
              output: parseFloat((formData.capacity * efficiencyFactor * weatherMultiplier * directionMultiplier).toFixed(2)),
              weather: randomWeather
            };
          });
        case "1 year":
          return Array.from({ length: 365 }, (_, i) => {
            const weatherTypes = ["Sunny", "Partly Cloudy", "Cloudy"];
            const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            const weatherMultiplier = randomWeather === "Sunny" ? 1 : 
                                    randomWeather === "Partly Cloudy" ? 0.7 : 0.4;
            const efficiencyFactor = 0.7 + (formData.angle / 100) * 0.3;
            const directionMultiplier = formData.direction === "South" ? 1 : 
                                       formData.direction === "East" || formData.direction === "West" ? 0.8 : 0.6;
            return {
              output: parseFloat((formData.capacity * efficiencyFactor * weatherMultiplier * directionMultiplier).toFixed(2)),
              weather: randomWeather
            };
          });
        default: // 1 week
          const weatherConditions = ["Sunny", "Partly Cloudy", "Sunny", "Sunny", "Cloudy", "Partly Cloudy", "Sunny"];
          const efficiencyFactor = 0.7 + (formData.angle / 100) * 0.3;
          const directionMultiplier = formData.direction === "South" ? 1 : 
                                     formData.direction === "East" || formData.direction === "West" ? 0.8 : 0.6;
          
          return weatherConditions.map(condition => {
            const weatherMultiplier = condition === "Sunny" ? 1 : 
                                     condition === "Partly Cloudy" ? 0.7 : 0.4;
            return {
              output: parseFloat((formData.capacity * efficiencyFactor * weatherMultiplier * directionMultiplier).toFixed(2)),
              weather: condition
            };
          });
      }
    };

    const durationData = getDurationData(selectedDuration);
    const dailyOutput = durationData.map(d => d.output);
    const weatherConditions = durationData.map(d => d.weather);
    
    const totalOutput = parseFloat(dailyOutput.reduce((sum, val) => sum + val, 0).toFixed(2));
    const efficiencyFactor = 0.7 + (formData.angle / 100) * 0.3;
    const directionMultiplier = formData.direction === "South" ? 1 : 
                               formData.direction === "East" || formData.direction === "West" ? 0.8 : 0.6;
    const efficiency = parseFloat((efficiencyFactor * directionMultiplier * 100).toFixed(1));
    
    const newResults = {
      dailyOutput,
      totalOutput,
      efficiency,
      weatherConditions,
      duration: selectedDuration
    };
    
    setResults(newResults);
    setShowKPIs(false); // Reset KPI view when new prediction is generated
  };

  const handleShowKPIs = () => {
    setShowKPIs(true);
  };

  const handleBackToChart = () => {
    setShowKPIs(false);
  };

  const handleNavigateToMetrics = () => {
    navigate('/metrics', { state: { results } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <SolarHero />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-6 text-center">
          <Link to="/dashboard">
            <Button className="mb-4">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Open Dashboard
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <PredictionForm 
              onSubmit={handlePrediction} 
              selectedDuration={selectedDuration}
              onDurationChange={setSelectedDuration}
            />
          </div>
          <div className="lg:col-span-7">
            <ResultsDisplay 
              results={results} 
              showKPIs={showKPIs}
              onShowKPIs={handleShowKPIs}
              onBackToChart={handleBackToChart}
              onNavigateToMetrics={handleNavigateToMetrics}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
