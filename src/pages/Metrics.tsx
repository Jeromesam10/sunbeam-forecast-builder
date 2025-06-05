
import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KPIDisplay from "@/components/KPIDisplay";
import ApiDataFetcher from "@/components/ApiDataFetcher";
import RealTimeKPIDisplay from "@/components/RealTimeKPIDisplay";
import { SolarMetrics } from "@/services/solarApi";

const Metrics = () => {
  const location = useLocation();
  const results = location.state?.results;
  const [apiData, setApiData] = useState<SolarMetrics | null>(null);

  if (!results) {
    return <Navigate to="/" replace />;
  }

  const handleApiDataFetched = (data: SolarMetrics) => {
    setApiData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Prediction
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Solar Power Metrics</h1>
          <p className="text-gray-600">View simulated predictions and fetch real-time data from your API</p>
        </div>
        
        <Tabs defaultValue="simulated" className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="simulated">Simulated Data</TabsTrigger>
            <TabsTrigger value="api-fetch">Fetch API Data</TabsTrigger>
            <TabsTrigger value="real-time" disabled={!apiData}>
              Real-Time Data {apiData && "✓"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulated">
            <KPIDisplay results={results} />
          </TabsContent>
          
          <TabsContent value="api-fetch">
            <ApiDataFetcher onDataFetched={handleApiDataFetched} />
          </TabsContent>
          
          <TabsContent value="real-time">
            {apiData ? (
              <RealTimeKPIDisplay data={apiData} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Please fetch API data first to view real-time metrics
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Metrics;
