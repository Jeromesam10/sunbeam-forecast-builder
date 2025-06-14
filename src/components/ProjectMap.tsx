
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, TrendingUp, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the Leaflet types we need
declare global {
  interface Window {
    L: any;
  }
}

const ProjectMap = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to selected project in the list
  const scrollToProject = (projectId: string) => {
    if (scrollAreaRef.current) {
      const projectElement = document.querySelector(`[data-project-id="${projectId}"]`);
      if (projectElement) {
        projectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    
    // Zoom to project on map
    if (map.current) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        map.current.setView([project.coordinates.lat, project.coordinates.lng], 10);
      }
    }
  };

  const handleMapMarkerClick = (projectId: string) => {
    setSelectedProject(projectId);
    scrollToProject(projectId);
  };

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    // Load Leaflet CSS and JS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      // Initialize map with OpenStreetMap
      map.current = window.L.map(mapContainer.current).setView([38.0, -104.9903], 5);

      // Add OpenStreetMap tile layer (completely free)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map.current);

      // Add markers for each project
      projects.forEach((project) => {
        const markerColor = project.status === "Active" ? "green" : 
                           project.status === "Maintenance" ? "orange" : "red";

        // Create custom icon based on status
        const customIcon = window.L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: 'custom-div-icon',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = window.L.marker([project.coordinates.lat, project.coordinates.lng], {
          icon: customIcon
        }).addTo(map.current);

        // Add popup
        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${project.name}</h3>
            <p class="text-xs text-gray-600">${project.location}</p>
            <p class="text-xs"><strong>Capacity:</strong> ${project.capacity}</p>
            <p class="text-xs"><strong>Status:</strong> ${project.status}</p>
            <p class="text-xs"><strong>Efficiency:</strong> ${project.efficiency}</p>
          </div>
        `);

        // Add click event to marker
        marker.on('click', () => {
          handleMapMarkerClick(project.id);
        });

        markersRef.current.push(marker);
      });
    };
    document.head.appendChild(script);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeMap();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      markersRef.current = [];
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      {/* Project List */}
      <div className="space-y-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Project Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64" ref={scrollAreaRef}>
              <div className="space-y-2 pr-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    data-project-id={project.id}
                    className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                      selectedProject === project.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleProjectSelect(project.id)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-xs">{project.name}</h4>
                      <Badge className={`${getStatusColor(project.status)} text-xs px-1 py-0`}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{project.location}</p>
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
      <div className="lg:col-span-2 space-y-3">
        {/* Interactive Map */}
        <Card className="h-80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-full p-0">
            <div ref={mapContainer} className="w-full h-full rounded-b-lg" />
          </CardContent>
        </Card>

        {/* Project Details */}
        {selectedProject && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const project = projects.find(p => p.id === selectedProject);
                if (!project) return null;
                
                return (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-blue-500" />
                        <div>
                          <p className="text-xs font-medium">Capacity</p>
                          <p className="text-xs text-gray-600">{project.capacity}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <div>
                          <p className="text-xs font-medium">Efficiency</p>
                          <p className="text-xs text-gray-600">{project.efficiency}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-orange-500" />
                        <div>
                          <p className="text-xs font-medium">Monthly Output</p>
                          <p className="text-xs text-gray-600">{project.monthlyOutput}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-purple-500" />
                        <div>
                          <p className="text-xs font-medium">Last Maintenance</p>
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
