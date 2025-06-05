
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ExternalLink } from "lucide-react";
import { fetchSolarMetrics, SolarMetrics } from "@/services/solarApi";

interface ApiDataFetcherProps {
  onDataFetched: (data: SolarMetrics) => void;
}

const ApiDataFetcher = ({ onDataFetched }: ApiDataFetcherProps) => {
  const [apiUrl, setApiUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchData = async () => {
    if (!apiUrl.trim()) {
      setError("Please enter a valid API URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchSolarMetrics(apiUrl);
      onDataFetched(data);
      console.log("Successfully fetched solar metrics:", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data from API");
      console.error("Error fetching API data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-green-100">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-t-lg">
        <CardTitle className="flex items-center">
          <ExternalLink className="h-5 w-5 mr-2" />
          Real-Time API Data
        </CardTitle>
        <CardDescription>
          Fetch live solar power metrics from your Postman API endpoint
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">API Endpoint URL</Label>
            <Input
              id="api-url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://your-api-endpoint.com/solar-metrics"
              className="border-green-200 focus:border-green-400"
            />
          </div>
          
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleFetchData}
            disabled={isLoading || !apiUrl.trim()}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Fetching Data...
              </>
            ) : (
              "Fetch Real-Time Data"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiDataFetcher;
