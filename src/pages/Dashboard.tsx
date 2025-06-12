import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, BarChart3, Activity, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";
import PredictionForm from "@/components/PredictionForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import KPIDisplay from "@/components/KPIDisplay";
import ProjectMap from "@/components/ProjectMap";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const Dashboard = () => {
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            <div className="lg:col-span-4 space-y-3">
              <PredictionForm 
                onSubmit={handlePrediction} 
                selectedDuration={selectedDuration}
                onDurationChange={setSelectedDuration}
              />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Duration Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={durationType} onValueChange={(value: "preset" | "custom") => setDurationType(value)}>
                    <SelectTrigger className="h-8 text-xs">
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
                              "w-full justify-start text-left font-normal h-8 text-xs",
                              !dateRange?.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "LLL dd, y")} -{" "}
                                  {format(dateRange.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(dateRange.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
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
                  <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
                  <p className="text-muted-foreground mb-4">Generate a prediction first to view analytics</p>
                  <Button onClick={() => setActiveView("prediction")}>Go to Prediction</Button>
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
            <CardHeader>
              <CardTitle>Live Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Live monitoring dashboard coming soon...</p>
            </CardContent>
          </Card>
        );
        
      case "settings":
        return (
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Application settings will be available here.</p>
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
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Solar Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        asChild
                        isActive={activeView === item.id}
                        onClick={() => setActiveView(item.id)}
                      >
                        <div className="cursor-pointer">
                          <item.icon className="h-4 w-4" />
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
          <div className="p-3 border-b bg-white/50 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">
                {sidebarItems.find(item => item.id === activeView)?.title || "Solar Dashboard"}
              </h1>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
