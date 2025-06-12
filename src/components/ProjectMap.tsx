
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Zap, TrendingUp, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the mapbox types we need
declare global {
  interface Window {
    mapboxgl: any;
  }
}

const ProjectMap = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  // Real project data with actual coordinates
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

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    // Load Mapbox GL JS dynamically
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.onload = () => {
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Initialize map
      window.mapboxgl.accessToken = mapboxToken;
      
      map.current = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-104.9903, 38.0], // Center on US
        zoom: 4
      });

      // Add navigation controls
      map.current.addControl(new window.mapboxgl.NavigationControl());

      // Add markers for each project
      projects.forEach((project) => {
        const markerColor = project.status === "Active" ? "#22c55e" : 
                           project.status === "Maintenance" ? "#eab308" : "#ef4444";

        const marker = new window.mapboxgl.Marker({ color: markerColor })
          .setLngLat([project.coordinates.lng, project.coordinates.lat])
          .setPopup(
            new window.mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold text-sm">${project.name}</h3>
                  <p class="text-xs text-gray-600">${project.location}</p>
                  <p class="text-xs"><strong>Capacity:</strong> ${project.capacity}</p>
                  <p class="text-xs"><strong>Status:</strong> ${project.status}</p>
                  <p class="text-xs"><strong>Efficiency:</strong> ${project.efficiency}</p>
                </div>
              `)
          )
          .addTo(map.current);

        // Add click event to marker
        marker.getElement().addEventListener('click', () => {
          setSelectedProject(project.id);
        });
      });
    };
    document.head.appendChild(script);
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Mapbox Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To display the interactive map, please enter your Mapbox public token. 
              You can get one from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>
            </p>
            <Input
              type="text"
              placeholder="Enter your Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button onClick={handleTokenSubmit} className="w-full">
              Initialize Map
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3 pr-4">
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
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Map and Project Details */}
      <div className="lg:col-span-2 space-y-4">
        {/* Interactive Map */}
        <Card className="h-96">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-full p-0">
            <div ref={mapContainer} className="w-full h-full rounded-b-lg" />
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
