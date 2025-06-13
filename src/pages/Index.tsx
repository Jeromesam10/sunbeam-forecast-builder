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
  const [selectedDuration, setSelectedDuration] = useState("1 week");
  const [activeView, setActiveView] = useState("prediction");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [durationType, setDurationType] = useState<"preset" | "custom">("preset");

  const sidebarItems = [
    { title: "Prediction", id: "prediction", icon: Home },
    { title: "Analytics", id: "analytics", icon: BarChart3 },
    { title: "Project Map", id: "map", icon: MapPin },
    { title: "Live Monitoring", id: "monitoring", icon: Activity },
    { title: "Settings", id: "settings", icon: Settings },
  ];

  const handlePrediction = (formData: {
    location: string;
    capacity: number;
    angle: number;
    direction: string;
  }) => {
    // Calculate duration based on selection
    let finalDuration = selectedDuration;
    if (durationType === "custom" && dateRange?.from && dateRange?.to) {
      const days = differenceInDays(dateRange.to, dateRange.from);
      finalDuration = `${days} days`;
    }

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
  };

  const renderContent = () => {
    switch (activeView) {
      case "prediction":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 h-full">
            <div className="lg:col-span-4 space-y-2">
              <PredictionForm 
                onSubmit={handlePrediction} 
                selectedDuration={selectedDuration}
                onDurationChange={setSelectedDuration}
              />
              
              <Card className="text-xs">
                <CardHeader className="pb-1 pt-2 px-3">
                  <CardTitle className="text-xs font-medium">Duration Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 p-3 pt-1">
                  <Select value={durationType} onValueChange={(value: "preset" | "custom") => setDurationType(value)}>
                    <SelectTrigger className="h-6 text-xs">
                      <SelectValue placeholder="Select duration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preset">Preset Duration</SelectItem>
                      <SelectItem value="custom">Custom Date Range</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {durationType === "custom" && (
                    <div className="space-y-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-6 text-xs px-2",
                              !dateRange?.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "MMM dd")} -{" "}
                                  {format(dateRange.to, "MMM dd")}
                                </>
                              ) : (
                                format(dateRange.from, "MMM dd, y")
                              )
                            ) : (
                              <span>Pick date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                  <h3 className="text-base font-medium mb-2">No Analytics Data</h3>
                  <p className="text-muted-foreground mb-4 text-sm">Generate a prediction first to view analytics</p>
                  <Button onClick={() => setActiveView("prediction")} className="text-xs h-8">Go to Prediction</Button>
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
      <div className="h-screen flex w-full bg-gradient-to-b from-blue-50 to-white">
        <Sidebar className="text-xs">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs">Solar Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        asChild
                        isActive={activeView === item.id}
                        onClick={() => setActiveView(item.id)}
                        className="text-xs h-8"
                      >
                        <div className="cursor-pointer">
                          <item.icon className="h-3 w-3" />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          {/* Dashboard Header */}
          <div className="p-2 border-b bg-white shadow-sm flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-6 w-6" />
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <h1 className="text-lg font-bold text-gray-800">
                    Solar Power Prediction Dashboard
                  </h1>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {sidebarItems.find(item => item.id === activeView)?.title}
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-2 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
