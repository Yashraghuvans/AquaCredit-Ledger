import React, { useState } from 'react';
import { FiCpu, FiEdit, FiX } from 'react-icons/fi';

const dummyDrones = [
  { id: 'AQ-DR-01', name: 'AquaMapper Pro', status: 'Online', specs: { range: '5 km', flightTime: '45 mins', camera: '4K Multispectral', payload: '2 kg' } },
  { id: 'AQ-DR-02', name: 'Coastal Scout', status: 'Online', specs: { range: '3 km', flightTime: '30 mins', camera: '1080p HD', payload: '1 kg' } },
  { id: 'AQ-DR-03', name: 'Delta Wing X', status: 'Charging', specs: { range: '10 km', flightTime: '90 mins', camera: 'Thermal + RGB', payload: '5 kg' } },
  { id: 'AQ-DR-04', name: 'Coastal Scout', status: 'Maintenance', specs: { range: '3 km', flightTime: '30 mins', camera: '1080p HD', payload: '1 kg' } },
];

const DroneDetailsModal = ({ drone, onClose }: { drone: typeof dummyDrones[0], onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg">
      <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full text-muted-foreground hover:bg-accent">
        <FiX />
      </button>
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary"><FiCpu size={24}/></div>
        <div>
          <h3 className="text-lg font-semibold">{drone.name}</h3>
          <p className="text-sm text-muted-foreground">ID: {drone.id}</p>
        </div>
      </div>
      <div className="mt-6 space-y-2 border-t pt-4">
        <h4 className="text-sm font-medium text-muted-foreground">Specifications</h4>
        <div className="text-sm"><strong>Range:</strong> {drone.specs.range}</div>
        <div className="text-sm"><strong>Max Flight Time:</strong> {drone.specs.flightTime}</div>
        <div className="text-sm"><strong>Camera:</strong> {drone.specs.camera}</div>
        <div className="text-sm"><strong>Payload Capacity:</strong> {drone.specs.payload}</div>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="h-9 rounded-md border px-4 text-sm">Close</button>
      </div>
    </div>
  </div>
);

// Main DeviceList Component
export default function DeviceList() {
  const [viewingDrone, setViewingDrone] = useState<typeof dummyDrones[0] | null>(null);

  return (
    <>
      {viewingDrone && <DroneDetailsModal drone={viewingDrone} onClose={() => setViewingDrone(null)} />}

      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold mb-4">Drone Fleet Status</h2>
        <div className="space-y-3">
          {dummyDrones.map(drone => (
            <div key={drone.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors duration-200">
              <div>
                <p className="font-medium text-sm">{drone.name}</p>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${
                    drone.status === 'Online' ? 'bg-emerald-500' :
                    drone.status === 'Charging' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}></span>
                  <p className="text-xs text-muted-foreground">{drone.status}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingDrone(drone)}
                className="h-8 w-8 grid place-items-center rounded-md border text-muted-foreground hover:bg-background transition-colors duration-200"
                title="View Specifications"
              >
                <FiEdit size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}