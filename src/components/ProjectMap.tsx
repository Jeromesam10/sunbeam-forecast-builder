
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, TrendingUp, Calendar } from "lucide-react";

const ProjectMap = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Mock project data
  const projects = [
    {
      id: "1",
      name: "Downtown Solar Farm",
      location: "Los Angeles, CA",
      coordinates: { lat: 34.0522, lng: -118.2437 },
      capacity: "2.5 MW",
      status: "Active",
      efficiency: "94.2%",
      monthlyOutput: "450 MWh",
      lastMaintenance: "2024-01-15"
    },
    {
      id: "2",
      name: "Coastal Energy Project",
      location: "San Diego, CA",
      coordinates: { lat: 32.7157, lng: -117.1611 },
      capacity: "1.8 MW",
      status: "Active",
      efficiency: "91.8%",
      monthlyOutput: "320 MWh",
      lastMaintenance: "2024-01-20"
    },
    {
      id: "3",
      name: "Mountain View Installation",
      location: "Denver, CO",
      coordinates: { lat: 39.7392, lng: -104.9903 },
      capacity: "3.2 MW",
      status: "Maintenance",
      efficiency: "88.5%",
      monthlyOutput: "520 MWh",
      lastMaintenance: "2024-01-10"
    },
    {
      id: "4",
      name: "Desert Power Station",
      location: "Phoenix, AZ",
      coordinates: { lat: 33.4484, lng: -112.0740 },
      capacity: "4.1 MW",
      status: "Active",
      efficiency: "96.1%",
      monthlyOutput: "680 MWh",
      lastMaintenance: "2024-01-25"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Project List */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Project Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedProject === project.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{project.name}</h4>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{project.location}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Capacity: {project.capacity}</span>
                  <span className="text-green-600 font-medium">{project.efficiency}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Map Visualization */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="h-96">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
              {/* Simple map visualization */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 opacity-50"></div>
              
              {/* Project markers */}
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                    selectedProject === project.id ? "z-10" : "z-0"
                  }`}
                  style={{
                    left: `${20 + (index * 20)}%`,
                    top: `${30 + (index * 15)}%`,
                  }}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                      project.status === "Active"
                        ? "bg-green-500"
                        : project.status === "Maintenance"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    } ${selectedProject === project.id ? "scale-150" : "scale-100"} transition-transform`}
                  ></div>
                  {selectedProject === project.id && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg border min-w-max">
                      <p className="text-xs font-medium">{project.name}</p>
                      <p className="text-xs text-gray-600">{project.location}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Map grid overlay */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        {selectedProject && (
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const project = projects.find(p => p.id === selectedProject);
                if (!project) return null;
                
                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Capacity</p>
                          <p className="text-xs text-gray-600">{project.capacity}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Efficiency</p>
                          <p className="text-xs text-gray-600">{project.efficiency}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium">Monthly Output</p>
                          <p className="text-xs text-gray-600">{project.monthlyOutput}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium">Last Maintenance</p>
                          <p className="text-xs text-gray-600">{project.lastMaintenance}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectMap;
