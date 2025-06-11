
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Zap } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      location,
      capacity,
      angle,
      direction,
    });
  };

  return (
    <Card className="shadow-lg border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-t-lg">
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Solar Power Prediction
        </CardTitle>
        <CardDescription>
          Enter your solar panel specifications to get power generation estimates
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="duration">Prediction Duration</Label>
            <Select value={selectedDuration} onValueChange={onDurationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 week">1 Week</SelectItem>
                <SelectItem value="3 months">3 Months</SelectItem>
                <SelectItem value="6 months">6 Months</SelectItem>
                <SelectItem value="1 year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="focus:border-blue-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Panel Capacity (kW)</Label>
            <Input
              id="capacity"
              type="number"
              min="0.1"
              step="0.1"
              value={capacity}
              onChange={(e) => setCapacity(parseFloat(e.target.value))}
              className="focus:border-blue-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="angle">Tilt Angle (degrees)</Label>
            <Input
              id="angle"
              type="number"
              min="0"
              max="90"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="focus:border-blue-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direction">Panel Direction</Label>
            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger>
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

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Generate Prediction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
