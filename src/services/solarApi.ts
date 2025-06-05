
export interface SolarMetrics {
  totalYield: number;
  performanceRatio: number;
  insolation: number;
  irradiance: number;
  ambientTemperature: number;
  moduleTemperature: number;
  uptime: number;
  downtime: number;
  capacityFactor: number;
  roi: number;
  technicalAvailability: number;
}

export const fetchSolarMetrics = async (apiUrl: string): Promise<SolarMetrics> => {
  try {
    console.log('Fetching solar metrics from:', apiUrl);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    // Map your API response to our interface
    // Adjust these field names to match your actual API response structure
    return {
      totalYield: data.totalYield || data['Total Yield'] || 0,
      performanceRatio: data.performanceRatio || data['Performance Ratio'] || 0,
      insolation: data.insolation || data['Insolation (Sky Facing)'] || 0,
      irradiance: data.irradiance || data['Irradiance (Sky Facing)'] || 0,
      ambientTemperature: data.ambientTemperature || data['Ambient Temperature'] || 0,
      moduleTemperature: data.moduleTemperature || data['Module Temperature'] || 0,
      uptime: data.uptime || data['Uptime'] || 0,
      downtime: data.downtime || data['Downtime'] || 0,
      capacityFactor: data.capacityFactor || data['Capacity Factor'] || 0,
      roi: data.roi || data['ROI'] || 0,
      technicalAvailability: data.technicalAvailability || data['Technical Availability'] || 0
    };
  } catch (error) {
    console.error('Error fetching solar metrics:', error);
    throw error;
  }
};
