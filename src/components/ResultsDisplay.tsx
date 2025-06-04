
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CloudSun, Sun, CloudSunRain } from "lucide-react";
import KPIDisplay from "./KPIDisplay";

interface ResultsDisplayProps {
  results: {
    dailyOutput: number[];
    totalOutput: number;
    efficiency: number;
    weatherConditions: string[];
  } | null;
}

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const [activeTab, setActiveTab] = useState("chart");
  
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Sunny":
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case "Partly Cloudy":
        return <CloudSun className="h-5 w-5 text-blue-400" />;
      case "Cloudy":
        return <CloudSunRain className="h-5 w-5 text-gray-500" />;
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  // Prepare data for chart
  const chartData = results?.dailyOutput.map((output, index) => ({
    day: `Day ${index + 1}`,
    output,
    weather: results.weatherConditions[index]
  })) || [];

  const PercentageIndicator = ({ percentage }: { percentage: number }) => {
    const segments = 10;
    const filledSegments = Math.round((percentage / 100) * segments);
    
    return (
      <div className="flex gap-1 mt-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < filledSegments ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  if (!results) {
    return (
      <Card className="h-full shadow-lg border-blue-100 flex items-center justify-center min-h-[400px]">
        <CardContent className="text-center p-8">
          <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sun className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Prediction Generated</h3>
          <p className="text-gray-500">
            Fill out the form with your solar panel details to generate a power prediction
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-t-lg">
        <CardTitle>Solar Power Prediction Results</CardTitle>
        <CardDescription>
          Estimated power generation based on your panel specifications
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-700 font-medium mb-1">Weekly Power Generation</div>
            <div className="text-3xl font-bold text-blue-900">{results.totalOutput} kWh</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-700 font-medium mb-1">System Efficiency</div>
            <div className="text-3xl font-bold text-yellow-900">{results.efficiency}%</div>
            <PercentageIndicator percentage={results.efficiency} />
          </div>
        </div>
        
        <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="chart">Daily Output Chart</TabsTrigger>
            <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="border-none p-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis 
                    label={{ 
                      value: 'kWh', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' } 
                    }} 
                  />
                  <Tooltip formatter={(value) => [`${value} kWh`, 'Power Output']} />
                  <Bar 
                    dataKey="output" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    name="Power Output" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="daily" className="border-none p-0">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {results.dailyOutput.map((output, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-white border border-blue-100 rounded-lg shadow-sm"
                >
                  <div className="flex items-center">
                    {getWeatherIcon(results.weatherConditions[index])}
                    <span className="ml-2 font-medium">Day {index + 1}</span>
                    <span className="ml-4 text-sm text-gray-500">{results.weatherConditions[index]}</span>
                  </div>
                  <div className="font-bold text-blue-600">{output} kWh</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="kpis" className="border-none p-0">
            <KPIDisplay results={results} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
