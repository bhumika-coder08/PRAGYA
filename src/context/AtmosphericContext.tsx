import React, { createContext, useContext, useState, useEffect } from 'react';
import { atmosphericService } from '../services/atmosphericService';
import { StormCell, PredictabilityState, EnsembleFuture } from '../types';

export type TimelinePoint = '-3h' | '-2h' | '-1h' | 'NOW' | '+30m' | '+1h' | '+3h' | '+6h';

export interface VisualLayerState {
  cloud: boolean;
  moisture: boolean;
  wind: boolean;
  temperature: boolean;
  updraft: boolean;
  downdraft: boolean;
  lightning: boolean;
  precipitation: boolean;
  hailZone: boolean;
}

interface AtmosphericContextType {
  cells: StormCell[];
  selectedCell: StormCell;
  setSelectedCellId: (id: string) => void;
  timelinePoint: TimelinePoint;
  setTimelinePoint: React.Dispatch<React.SetStateAction<TimelinePoint>>;
  layers: VisualLayerState;
  toggleLayer: (layer: keyof VisualLayerState) => void;
  resetLayers: () => void;
  isDemoMode: boolean;
  dataSource: string;
  utcTime: string;
  istTime: string;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const defaultLayers: VisualLayerState = {
  cloud: true,
  moisture: true,
  wind: true,
  temperature: true,
  updraft: true,
  downdraft: true,
  lightning: true,
  precipitation: true,
  hailZone: true,
};

const AtmosphericContext = createContext<AtmosphericContextType | undefined>(undefined);

export const AtmosphericProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cells = atmosphericService.getActiveStormCells();
  const [selectedCellId, setSelectedCellId] = useState<string>('CX-017');
  const [timelinePoint, setTimelinePoint] = useState<TimelinePoint>('NOW');
  const [layers, setLayers] = useState<VisualLayerState>(defaultLayers);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedCell = cells.find(c => c.id === selectedCellId) || cells[0];

  const toggleLayer = (layer: keyof VisualLayerState) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const resetLayers = () => {
    setLayers(defaultLayers);
  };

  const utcTimeString = currentTime.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  const istTimeString = currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';

  return (
    <AtmosphericContext.Provider
      value={{
        cells,
        selectedCell,
        setSelectedCellId,
        timelinePoint,
        setTimelinePoint,
        layers,
        toggleLayer,
        resetLayers,
        isDemoMode: true,
        dataSource: atmosphericService.getDataSourceName(),
        utcTime: utcTimeString,
        istTime: istTimeString,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </AtmosphericContext.Provider>
  );
};

export const useAtmosphere = (): AtmosphericContextType => {
  const context = useContext(AtmosphericContext);
  if (!context) {
    throw new Error('useAtmosphere must be used within an AtmosphericProvider');
  }
  return context;
};
