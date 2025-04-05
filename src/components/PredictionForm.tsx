
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface PredictionFormProps {
  onSubmit: (data: {
    location: string;
    capacity: number;
    angle: number;
    direction: string;
  }) => void;
}

const PredictionForm = ({ onSubmit }: PredictionFormProps) => {
  const [location, setLocation] = useState("New York");
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
        <CardTitle>Solar Panel Details</CardTitle>
        <CardDescription>
          Enter your solar panel specifications to get an accurate prediction
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your city"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity">Solar System Capacity (kW)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="capacity"
                type="number"
                min={0.5}
                max={50}
                step={0.5}
                value={capacity}
                onChange={(e) => setCapacity(parseFloat(e.target.value))}
                className="border-blue-200 focus:border-blue-400"
              />
              <span className="font-medium text-gray-600">kW</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="angle">Panel Angle (Tilt)</Label>
              <span className="text-sm font-medium text-blue-600">{angle}°</span>
            </div>
            <Slider
              id="angle"
              min={0}
              max={60}
              step={1}
              value={[angle]}
              onValueChange={(values) => setAngle(values[0])}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0°</span>
              <span>15°</span>
              <span>30°</span>
              <span>45°</span>
              <span>60°</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="direction">Panel Direction</Label>
            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger id="direction" className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="North">North</SelectItem>
                <SelectItem value="East">East</SelectItem>
                <SelectItem value="South">South</SelectItem>
                <SelectItem value="West">West</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Generate Prediction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
