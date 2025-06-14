
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CloudSun, Sun, CloudSunRain, BarChart3, TrendingUp, ArrowRight } from "lucide-react";
import KPIDisplay from "./KPIDisplay";

interface ResultsDisplayProps {
  results: {
    dailyOutput: number[];
    totalOutput: number;
    efficiency: number;
    weatherConditions: string[];
    duration: string;
  } | null;
  showKPIs: boolean;
  onShowKPIs: () => void;
  onBackToChart: () => void;
  onNavigateToMetrics: () => void;
}

const ResultsDisplay = ({ 
  results, 
  showKPIs, 
  onShowKPIs, 
  onBackToChart, 
  onNavigateToMetrics 
}: ResultsDisplayProps) => {
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

  const getChartData = () => {
    if (!results) return [];
    
    const { dailyOutput, weatherConditions, duration } = results;
    
    // Handle both "last 1 week" and "1 week" formats
    if (duration.includes("1 week") || duration.includes("week")) {
      return dailyOutput.map((output, index) => ({
        day: `Day ${index + 1}`,
        output,
        weather: weatherConditions[index]
      }));
    } else if (duration.includes("3 months") || duration.includes("month")) {
      // Group by weeks (13 weeks)
      const weeklyData = [];
      for (let i = 0; i < 13; i++) {
        const startIdx = i * 7;
        const endIdx = Math.min(startIdx + 7, dailyOutput.length);
        const weekOutput = dailyOutput.slice(startIdx, endIdx).reduce((sum, val) => sum + val, 0);
        weeklyData.push({
          day: `Week ${i + 1}`,
          output: parseFloat(weekOutput.toFixed(2)),
          weather: "Mixed"
        });
      }
      return weeklyData;
    } else if (duration.includes("6 months")) {
      // Group by months (6 months)
      const monthlyData = [];
      const daysPerMonth = 30;
      for (let i = 0; i < 6; i++) {
        const startIdx = i * daysPerMonth;
        const endIdx = Math.min(startIdx + daysPerMonth, dailyOutput.length);
        const monthOutput = dailyOutput.slice(startIdx, endIdx).reduce((sum, val) => sum + val, 0);
        monthlyData.push({
          day: `Month ${i + 1}`,
          output: parseFloat(monthOutput.toFixed(2)),
          weather: "Mixed"
        });
      }
      return monthlyData;
    } else if (duration.includes("1 year") || duration.includes("year")) {
      // Group by months (12 months)
      const monthlyData = [];
      const daysPerMonth = Math.floor(365 / 12);
      for (let i = 0; i < 12; i++) {
        const startIdx = i * daysPerMonth;
        const endIdx = Math.min(startIdx + daysPerMonth, dailyOutput.length);
        const monthOutput = dailyOutput.slice(startIdx, endIdx).reduce((sum, val) => sum + val, 0);
        monthlyData.push({
          day: `Month ${i + 1}`,
          output: parseFloat(monthOutput.toFixed(2)),
          weather: "Mixed"
        });
      }
      return monthlyData;
    } else if (duration.includes("days")) {
      // Handle custom date ranges
      return dailyOutput.map((output, index) => ({
        day: `Day ${index + 1}`,
        output,
        weather: weatherConditions[index] || "Mixed"
      }));
    }
    
    return [];
  };

  const chartData = getChartData();

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
      <Card className="h-full shadow-lg border-blue-100 flex items-center justify-center min-h-[200px]">
        <CardContent className="text-center p-4">
          <div className="bg-blue-50 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">No Prediction Generated</h3>
          <p className="text-gray-500 text-xs">
            Fill out the form with your solar panel details to generate a power prediction
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showKPIs) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onBackToChart}
            className="flex items-center text-xs h-6"
          >
            <BarChart3 className="h-3 w-3 mr-1" />
            Back to Charts
          </Button>
          <Button 
            onClick={onNavigateToMetrics}
            className="flex items-center text-xs h-6"
          >
            Advanced Metrics
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        <KPIDisplay results={results} />
      </div>
    );
  }

  return (
    <Card className="shadow-lg border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-t-lg pb-1 pt-1 px-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm">Solar Power Prediction Results</CardTitle>
            <CardDescription className="text-xs">
              Estimated power generation for {results.duration}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button 
              onClick={onShowKPIs}
              variant="outline"
              className="flex items-center text-xs h-6 px-2"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Show KPIs
            </Button>
            <Button 
              onClick={onNavigateToMetrics}
              className="flex items-center text-xs h-6 px-2"
            >
              Metrics
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 px-2 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <div className="bg-blue-50 p-2 rounded-lg">
            <div className="text-xs text-blue-700 font-medium mb-0.5">{results.duration} Power Generation</div>
            <div className="text-lg font-bold text-blue-900">{results.totalOutput} kWh</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded-lg">
            <div className="text-xs text-yellow-700 font-medium mb-0.5">System Efficiency</div>
            <div className="text-lg font-bold text-yellow-900">{results.efficiency}%</div>
            <PercentageIndicator percentage={results.efficiency} />
          </div>
        </div>
        
        {/* Reduced chart height */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center">
            <BarChart3 className="h-4 w-4 mr-1 text-blue-600" />
            Power Output Chart
          </h3>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10 }}
                  height={30}
                />
                <YAxis 
                  label={{ 
                    value: 'kWh', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: 10 } 
                  }}
                  tick={{ fontSize: 10 }}
                  width={30}
                />
                <Tooltip 
                  formatter={(value) => [`${value} kWh`, 'Power Output']}
                  contentStyle={{ fontSize: '10px' }}
                />
                <Bar 
                  dataKey="output" 
                  fill="#3B82F6" 
                  radius={[2, 2, 0, 0]}
                  name="Power Output" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {(results.duration.includes("1 week") || results.duration.includes("week")) && (
          <Tabs defaultValue="daily" className="mt-2">
            <TabsList className="grid grid-cols-1 w-full h-6">
              <TabsTrigger value="daily" className="text-xs py-0">Daily Breakdown</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="border-none p-0 mt-2">
              <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                {results.dailyOutput.map((output, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-1.5 bg-white border border-blue-100 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      {getWeatherIcon(results.weatherConditions[index])}
                      <span className="ml-1 font-medium text-xs">Day {index + 1}</span>
                      <span className="ml-2 text-xs text-gray-500">{results.weatherConditions[index]}</span>
                    </div>
                    <div className="font-bold text-blue-600 text-xs">{output} kWh</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
