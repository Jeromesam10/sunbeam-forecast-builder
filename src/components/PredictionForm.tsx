
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Zap, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";

interface PredictionFormProps {
  onSubmit: (data: {
    location: string;
    capacity: number;
    angle: number;
    direction: string;
  }) => void;
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
}

const PredictionForm = ({ onSubmit, selectedDuration, onDurationChange }: PredictionFormProps) => {
  const [location, setLocation] = useState("San Francisco, CA");
  const [capacity, setCapacity] = useState(5);
  const [angle, setAngle] = useState(30);
  const [direction, setDirection] = useState("South");
  const [durationType, setDurationType] = useState<"preset" | "custom">("preset");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate final duration based on selection type
    let finalDuration = selectedDuration;
    if (durationType === "custom" && dateRange?.from && dateRange?.to) {
      const days = differenceInDays(dateRange.to, dateRange.from);
      finalDuration = `${days} days`;
      onDurationChange(finalDuration);
    }
    
    onSubmit({
      location,
      capacity,
      angle,
      direction,
    });
  };

  const handleDurationTypeChange = (type: "preset" | "custom") => {
    setDurationType(type);
    if (type === "preset") {
      setDateRange(undefined);
    }
  };

  const handleCustomDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      const days = differenceInDays(range.to, range.from);
      onDurationChange(`${days} days`);
    }
  };

  return (
    <Card className="shadow-md border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-t-lg pb-1 pt-1 px-2">
        <CardTitle className="flex items-center text-xs">
          <Zap className="h-2 w-2 mr-1 text-yellow-500" />
          Solar Power Prediction
        </CardTitle>
        <CardDescription className="text-xs">
          Enter specifications for power estimates
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-1 space-y-1 p-2">
        <form onSubmit={handleSubmit} className="space-y-1">
          <div className="space-y-0.5">
            <Label htmlFor="durationType" className="text-xs font-medium">Duration Selection Method</Label>
            <Select value={durationType} onValueChange={handleDurationTypeChange}>
              <SelectTrigger className="h-5 text-xs">
                <SelectValue placeholder="Select duration type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preset">Preset Duration</SelectItem>
                <SelectItem value="custom">Custom Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={cn("space-y-0.5", durationType !== "preset" && "opacity-50 pointer-events-none")}>
            <Label htmlFor="duration" className="text-xs font-medium">Prediction Duration</Label>
            <Select 
              value={selectedDuration} 
              onValueChange={onDurationChange}
              disabled={durationType !== "preset"}
            >
              <SelectTrigger className="h-5 text-xs">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 week">Last 1 Week</SelectItem>
                <SelectItem value="3 months">Last 3 Months</SelectItem>
                <SelectItem value="6 months">Last 6 Months</SelectItem>
                <SelectItem value="1 year">Last 1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={cn("space-y-0.5", durationType !== "custom" && "opacity-50 pointer-events-none")}>
            <Label className="text-xs font-medium">Custom Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={durationType !== "custom"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-5 text-xs px-1",
                    !dateRange?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-2 w-2" />
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
                  onSelect={handleCustomDateChange}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="location" className="flex items-center text-xs font-medium">
              <MapPin className="h-2 w-2 mr-1" />
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="focus:border-blue-300 h-5 text-xs px-1"
            />
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="capacity" className="text-xs font-medium">Panel Capacity (kW)</Label>
            <Input
              id="capacity"
              type="number"
              min="0.1"
              step="0.1"
              value={capacity}
              onChange={(e) => setCapacity(parseFloat(e.target.value))}
              className="focus:border-blue-300 h-5 text-xs px-1"
            />
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="angle" className="text-xs font-medium">Tilt Angle (degrees)</Label>
            <Input
              id="angle"
              type="number"
              min="0"
              max="90"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="focus:border-blue-300 h-5 text-xs px-1"
            />
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="direction" className="text-xs font-medium">Panel Direction</Label>
            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger className="h-5 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="North">North</SelectItem>
                <SelectItem value="South">South</SelectItem>
                <SelectItem value="East">East</SelectItem>
                <SelectItem value="West">West</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-5 text-xs py-0.5">
            Generate Prediction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
