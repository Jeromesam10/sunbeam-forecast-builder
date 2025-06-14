import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, BarChart3, Activity, Settings, Home, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";
import PredictionForm from "@/components/PredictionForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import KPIDisplay from "@/components/KPIDisplay";
import ProjectMap from "@/components/ProjectMap";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const Index = () => {
  const [results, setResults] = useState<null | {
    dailyOutput: number[];
    totalOutput: number;
    efficiency: number;
    weatherConditions: string[];
    duration: string;
  }>(null);
  const [showKPIs, setShowKPIs] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("last 1 week");
  const [activeView, setActiveView] = useState("map");

  const sidebarItems = [
    { title: "Project Map", id: "map", icon: MapPin },
    { title: "Prediction", id: "prediction", icon: Home },
    { title: "Analytics", id: "analytics", icon: BarChart3 },
    { title: "Live Monitoring", id: "monitoring", icon: Activity },
    { title: "Settings", id: "settings", icon: Settings },
  ];

  const handlePrediction = (formData: {
    location: string;
    capacity: number;
    angle: number;
    direction: string;
    duration: string;
    durationType: "preset" | "custom";
  }) => {
    // Use the duration from the form data
    const finalDuration = formData.duration;

    // Generate data based on duration
    const getDurationData = (duration: string) => {
      let numDays = 7; // default
      if (duration.includes("3 months")) numDays = 90;
      else if (duration.includes("6 months")) numDays = 180;
      else if (duration.includes("1 year")) numDays = 365;
      else if (duration.includes("days")) numDays = parseInt(duration);

      return Array.from({ length: numDays }, () => {
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
    };

    const durationData = getDurationData(finalDuration);
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
      duration: finalDuration
    };
    
    setResults(newResults);
    setShowKPIs(false);
    
    // Only switch to prediction view if user is not already there
    if (activeView !== "prediction") {
      setActiveView("prediction");
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "prediction":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full">
            <div className="lg:col-span-4 space-y-1">
              <PredictionForm 
                onSubmit={handlePrediction} 
                selectedDuration={selectedDuration}
                onDurationChange={setSelectedDuration}
              />
            </div>
            
            <div className="lg:col-span-8 h-full">
              <ResultsDisplay 
                results={results} 
                showKPIs={showKPIs}
                onShowKPIs={() => setShowKPIs(true)}
                onBackToChart={() => setShowKPIs(false)}
                onNavigateToMetrics={() => setActiveView("analytics")}
              />
            </div>
          </div>
        );
        
      case "analytics":
        return (
          <div className="h-full">
            {results ? (
              <KPIDisplay results={results} />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <h3 className="text-sm font-medium mb-1">No Analytics Data</h3>
                  <p className="text-muted-foreground mb-2 text-xs">Generate a prediction first to view analytics</p>
                  <Button onClick={() => setActiveView("prediction")} className="text-xs h-6">Go to Prediction</Button>
                </CardContent>
              </Card>
            )}
          </div>
        );
        
      case "map":
        return <ProjectMap />;
        
      case "monitoring":
        return (
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Live Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-sm">Live monitoring dashboard coming soon...</p>
            </CardContent>
          </Card>
        );
        
      case "settings":
        return (
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Application settings will be available here.</p>
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col w-full bg-gradient-to-b from-blue-50 to-white">
        {/* Fixed header bar spanning full width at the top */}
        <div className="fixed top-0 left-0 right-0 z-30 p-1 border-b bg-blue-600 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-5 w-5 text-white" />
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-400" />
                <h1 className="text-sm font-bold text-white">
                  Solar Power Prediction Dashboard
                </h1>
              </div>
            </div>
            <div className="text-xs text-blue-100">
              {sidebarItems.find(item => item.id === activeView)?.title}
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex overflow-hidden mt-10">
          {/* Sidebar with hover effect and positioned below header */}
          <div className="relative group">
            <Sidebar className="text-xs fixed left-0 top-10 bottom-0 z-20 transition-all duration-300 ease-in-out w-12 group-hover:w-64 bg-white border-r">
              <SidebarContent className="transition-all duration-300 ease-in-out">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Solar Dashboard
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {sidebarItems.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton 
                            asChild
                            isActive={activeView === item.id}
                            onClick={() => setActiveView(item.id)}
                            className="text-xs h-8 justify-start transition-all duration-300"
                          >
                            <div className="cursor-pointer flex items-center gap-2">
                              <item.icon className="h-4 w-4 flex-shrink-0" />
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                {item.title}
                              </span>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </div>
          
          {/* Main content area with proper margin for sidebar */}
          <div className="flex-1 p-1 overflow-hidden ml-12 transition-all duration-300">
            {renderContent()}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
