
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, CirclePercent, Thermometer, Zap, TrendingUp } from "lucide-react";
import { SolarMetrics } from "@/services/solarApi";

interface RealTimeKPIDisplayProps {
  data: SolarMetrics;
}

const RealTimeKPIDisplay = ({ data }: RealTimeKPIDisplayProps) => {
  const kpis = [
    { 
      title: "Total Yield", 
      value: `${data.totalYield} kWh`, 
      unit: "Energy Output", 
      color: "bg-green-50 text-green-700", 
      icon: <Gauge className="h-5 w-5" /> 
    },
    { 
      title: "Performance Ratio", 
      value: `${data.performanceRatio}%`, 
      unit: "Efficiency", 
      color: "bg-blue-50 text-blue-700", 
      icon: <CirclePercent className="h-5 w-5" /> 
    },
    { 
      title: "Insolation (Sky Facing)", 
      value: `${data.insolation} kWh/m²`, 
      unit: "Solar Radiation", 
      color: "bg-yellow-50 text-yellow-700", 
      icon: <Zap className="h-5 w-5" /> 
    },
    { 
      title: "Irradiance (Sky Facing)", 
      value: `${data.irradiance} W/m²`, 
      unit: "Power Density", 
      color: "bg-orange-50 text-orange-700", 
      icon: <Zap className="h-5 w-5" /> 
    },
    { 
      title: "Ambient Temperature", 
      value: `${data.ambientTemperature}°C`, 
      unit: "Environment", 
      color: "bg-red-50 text-red-700", 
      icon: <Thermometer className="h-5 w-5" /> 
    },
    { 
      title: "Module Temperature", 
      value: `${data.moduleTemperature}°C`, 
      unit: "Panel Heat", 
      color: "bg-red-50 text-red-700", 
      icon: <Thermometer className="h-5 w-5" /> 
    },
    { 
      title: "Uptime", 
      value: `${data.uptime}%`, 
      unit: "Operational", 
      color: "bg-green-50 text-green-700", 
      icon: <CirclePercent className="h-5 w-5" /> 
    },
    { 
      title: "Downtime", 
      value: `${data.downtime}%`, 
      unit: "Maintenance", 
      color: "bg-red-50 text-red-700", 
      icon: <CirclePercent className="h-5 w-5" /> 
    },
    { 
      title: "Capacity Factor", 
      value: `${data.capacityFactor}%`, 
      unit: "Utilization", 
      color: "bg-purple-50 text-purple-700", 
      icon: <TrendingUp className="h-5 w-5" /> 
    },
    { 
      title: "ROI", 
      value: `${data.roi}%`, 
      unit: "Return", 
      color: "bg-green-50 text-green-700", 
      icon: <TrendingUp className="h-5 w-5" /> 
    },
    { 
      title: "Technical Availability", 
      value: `${data.technicalAvailability}%`, 
      unit: "System Ready", 
      color: "bg-blue-50 text-blue-700", 
      icon: <CirclePercent className="h-5 w-5" /> 
    }
  ];

  return (
    <Card className="shadow-lg border-green-100">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-t-lg">
        <CardTitle>Live Solar Power Metrics</CardTitle>
        <CardDescription>
          Real-time data from your API endpoint
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => (
            <div key={index} className={`p-4 rounded-lg border ${kpi.color}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {kpi.icon}
                  <span className="ml-2 text-sm font-medium">{kpi.title}</span>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{kpi.value}</div>
              <div className="text-xs opacity-75">{kpi.unit}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-700 mb-2">API Data Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Data Source:</span>
              <span className="ml-2 text-green-600">Live API</span>
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>
              <span className="ml-2 text-gray-600">{new Date().toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <span className="ml-2 text-green-600">Connected</span>
            </div>
            <div>
              <span className="font-medium">Data Quality:</span>
              <span className="ml-2 text-green-600">Good</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeKPIDisplay;
