import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AtmosphericProvider } from './context/AtmosphericContext';
import { AppShell } from './layouts/AppShell';

import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { LiveAtmospherePage } from './pages/LiveAtmospherePage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { PredictabilityPage } from './pages/PredictabilityPage';
import { FutureEnsemblesPage } from './pages/FutureEnsemblesPage';
import { StormLaboratoryPage } from './pages/StormLaboratoryPage';
import { HistoricalReplayPage } from './pages/HistoricalReplayPage';
import { ImpactSimulatorPage } from './pages/ImpactSimulatorPage';
import { ObservationGapsPage } from './pages/ObservationGapsPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { CitizenAlertsPage } from './pages/CitizenAlertsPage';
import { ResearchPage } from './pages/ResearchPage';
import { AuthorityCommandPage } from './pages/AuthorityCommandPage';
import { CitizenSafetyPage } from './pages/CitizenSafetyPage';

export const App: React.FC = () => {
  return (
    <AtmosphericProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Experience */}
          <Route path="/" element={<LandingPage />} />

          {/* Main Command Centre Workspace Shell */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="live" element={<LiveAtmospherePage />} />
            <Route path="digital-twin" element={<DigitalTwinPage />} />
            <Route path="authority" element={<AuthorityCommandPage />} />
            <Route path="predictability" element={<PredictabilityPage />} />
            <Route path="ensembles" element={<FutureEnsemblesPage />} />
            <Route path="laboratory" element={<StormLaboratoryPage />} />
            <Route path="replay" element={<HistoricalReplayPage />} />
            <Route path="impact" element={<ImpactSimulatorPage />} />
            <Route path="gaps" element={<ObservationGapsPage />} />
            <Route path="performance" element={<ModelPerformancePage />} />
            <Route path="citizen" element={<CitizenSafetyPage />} />
            <Route path="alerts" element={<CitizenAlertsPage />} />
            <Route path="research" element={<ResearchPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AtmosphericProvider>
  );
};

export default App;
