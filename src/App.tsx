import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/common/Header';
import { NavigationTabs } from './components/common/NavigationTabs';
import { SCR01_EmployeeDashboard } from './components/screens/SCR01_EmployeeDashboard';
import { SCR02_RequestStudio } from './components/screens/SCR02_RequestStudio';
import { SCR03_ApprovalHub } from './components/screens/SCR03_ApprovalHub';
import { SCR04_ProcurementDesk } from './components/screens/SCR04_ProcurementDesk';
import { SCR05_FinanceBudgetHub } from './components/screens/SCR05_FinanceBudgetHub';
import { SCR06_IntakeAllocationConsole } from './components/screens/SCR06_IntakeAllocationConsole';
import { SCR07_AssetRegistry } from './components/screens/SCR07_AssetRegistry';
import { SCR08_DynamicFormBuilder } from './components/screens/SCR08_DynamicFormBuilder';
import { SCR09_OrgHierarchyMatrix } from './components/screens/SCR09_OrgHierarchyMatrix';
import { ArrowRight, CheckCircle2, Zap, Info, ShieldCheck } from 'lucide-react';

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<string>('SCR-01');
  const [guideDismissed, setGuideDismissed] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

      {/* Screen Navigation Tabs */}
      <NavigationTabs activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

      {/* Enterprise Interactive Workflow Guided Walkthrough Bar */}
      {!guideDismissed && (
        <div className="bg-blue-900 text-white text-xs px-4 py-2.5 shadow-xs border-b border-blue-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold uppercase tracking-wider bg-blue-700 px-2 py-0.5 rounded text-[10px] text-blue-100 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-300" />
                <span>Enterprise Flow</span>
              </span>
              <span className="text-blue-100">
                Test the end-to-end lifecycle:
              </span>
              <span className="font-medium text-white">
                1. Raise Ticket (SCR-02) → 2. Line Approval & MD Short-Circuit Bypass (SCR-03) → 3. IT Vendor Sourcing (SCR-04) → 4. CFO Direct Budget Clearance (SCR-05) → 5. Barcode Intake & Handover (SCR-06)
              </span>
            </div>
            <button
              onClick={() => setGuideDismissed(true)}
              className="text-blue-200 hover:text-white underline text-[11px] shrink-0 self-start sm:self-auto cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeScreen === 'SCR-01' && (
          <SCR01_EmployeeDashboard onNavigateToRequest={() => setActiveScreen('SCR-02')} />
        )}

        {activeScreen === 'SCR-02' && (
          <SCR02_RequestStudio
            onSuccess={(ticketNo) => {
              // Option to view in tracker
            }}
          />
        )}

        {activeScreen === 'SCR-03' && <SCR03_ApprovalHub />}

        {activeScreen === 'SCR-04' && <SCR04_ProcurementDesk />}

        {activeScreen === 'SCR-05' && <SCR05_FinanceBudgetHub />}

        {activeScreen === 'SCR-06' && <SCR06_IntakeAllocationConsole />}

        {activeScreen === 'SCR-07' && <SCR07_AssetRegistry />}

        {activeScreen === 'SCR-08' && <SCR08_DynamicFormBuilder />}

        {activeScreen === 'SCR-09' && <SCR09_OrgHierarchyMatrix />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Aegis Enterprise Asset Management</span>
            <span>·</span>
            <span>PostgreSQL ERD Architecture & Dynamic Form Engine</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Multi-tier hierarchy approvals · Direct executive pre-emption · Thermal barcode printing
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
