
import { useLocation, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import KPIDisplay from "@/components/KPIDisplay";

const Metrics = () => {
  const location = useLocation();
  const results = location.state?.results;

  if (!results) {
    return <Navigate to="/" replace />;
  }

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
          <p className="text-gray-600">Detailed performance indicators for your solar power system</p>
        </div>
        
        <KPIDisplay results={results} />
      </div>
    </div>
  );
};

export default Metrics;
