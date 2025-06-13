
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, CirclePercent } from "lucide-react";

interface KPIDisplayProps {
  results: {
    dailyOutput: number[];
    totalOutput: number;
    efficiency: number;
    weatherConditions: string[];
    duration: string;
  } | null;
}

const KPIDisplay = ({ results }: KPIDisplayProps) => {
  if (!results) {
    return (
      <Card className="h-full shadow-lg border-blue-100 flex items-center justify-center min-h-[300px]">
        <CardContent className="text-center p-4">
          <div className="bg-blue-50 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2">
            <Gauge className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">No KPIs Available</h3>
          <p className="text-gray-500 text-xs">
            Generate a solar prediction to view detailed performance metrics
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate KPIs based on results
  const totalYield = results.totalOutput;
  const performanceRatio = results.efficiency;
  const insolation = 5.2; // kWh/m²/day (simulated)
  const irradiance = 800; // W/m² (simulated)
  const ambientTemp = 25; // °C (simulated)
  const moduleTemp = 45; // °C (simulated)
  const uptime = 98.5; // % (simulated)
  const downtime = 1.5; // % (simulated)
  const capacityFactor = (totalYield / (7 * 5 * 24)) * 100; // Assuming 5kW system
  const roi = 15.2; // % (simulated)
  const technicalAvailability = 99.2; // % (simulated)

  const kpis = [
    { title: "Total Yield", value: `${totalYield} kWh`, unit: results.duration, color: "bg-green-50 text-green-700", icon: <Gauge className="h-3 w-3" /> },
    { title: "Performance Ratio", value: `${performanceRatio}%`, unit: "Efficiency", color: "bg-blue-50 text-blue-700", icon: <CirclePercent className="h-3 w-3" /> },
    { title: "Insolation (Sky Facing)", value: `${insolation} kWh/m²`, unit: "Daily", color: "bg-yellow-50 text-yellow-700", icon: <Gauge className="h-3 w-3" /> },
    { title: "Irradiance (Sky Facing)", value: `${irradiance} W/m²`, unit: "Current", color: "bg-orange-50 text-orange-700", icon: <Gauge className="h-3 w-3" /> },
    { title: "Ambient Temperature", value: `${ambientTemp}°C`, unit: "Current", color: "bg-red-50 text-red-700", icon: <Gauge className="h-3 w-3" /> },
    { title: "Module Temperature", value: `${moduleTemp}°C`, unit: "Current", color: "bg-red-50 text-red-700", icon: <Gauge className="h-3 w-3" /> },
    { title: "Uptime", value: `${uptime}%`, unit: "Operational", color: "bg-green-50 text-green-700", icon: <CirclePercent className="h-3 w-3" /> },
    { title: "Downtime", value: `${downtime}%`, unit: "Maintenance", color: "bg-red-50 text-red-700", icon: <CirclePercent className="h-3 w-3" /> },
    { title: "Capacity Factor", value: `${capacityFactor.toFixed(1)}%`, unit: "Utilization", color: "bg-purple-50 text-purple-700", icon: <CirclePercent className="h-3 w-3" /> },
    { title: "ROI", value: `${roi}%`, unit: "Annual", color: "bg-green-50 text-green-700", icon: <CirclePercent className="h-3 w-3" /> },
    { title: "Technical Availability", value: `${technicalAvailability}%`, unit: "System", color: "bg-blue-50 text-blue-700", icon: <CirclePercent className="h-3 w-3" /> }
  ];

  return (
    <Card className="shadow-lg border-blue-100 h-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-t-lg pb-1 pt-2 px-2">
        <CardTitle className="text-sm">Solar Power KPIs - {results.duration}</CardTitle>
        <CardDescription className="text-xs">
          Key Performance Indicators for your solar power system over {results.duration.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 px-2 pb-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {kpis.map((kpi, index) => (
            <div key={index} className={`p-2 rounded-lg border ${kpi.color}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  {kpi.icon}
                  <span className="ml-1 text-xs font-medium">{kpi.title}</span>
                </div>
              </div>
              <div className="text-sm font-bold mb-0.5">{kpi.value}</div>
              <div className="text-xs opacity-75">{kpi.unit}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Performance Summary - {results.duration}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">System Status:</span>
              <span className="ml-1 text-green-600">Operational</span>
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>
              <span className="ml-1 text-gray-600">{new Date().toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium">Weather Impact:</span>
              <span className="ml-1 text-blue-600">Favorable</span>
            </div>
            <div>
              <span className="font-medium">Maintenance Due:</span>
              <span className="ml-1 text-yellow-600">30 days</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIDisplay;
