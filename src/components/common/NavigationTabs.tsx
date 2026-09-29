import React from 'react';
import {
  LayoutDashboard,
  FilePlus,
  CheckCheck,
  ShoppingBag,
  DollarSign,
  Barcode,
  Package,
  Sliders,
  Network
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavigationTabsProps {
  activeScreen: string;
  setActiveScreen: (screenId: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeScreen, setActiveScreen }) => {
  const { currentEmployee, roles, requests } = useApp();
  const currentRole = roles.find(r => r.id === currentEmployee.role_id);

  // Compute live badges
  const pendingApprovalsCount = requests.filter(req => {
    if (req.current_stage !== 'PENDING_LINE_APPROVAL' && req.current_stage !== 'PENDING_MD_APPROVAL') {
      return false;
    }
    if (currentRole?.name === 'MD') return true;
    if (currentRole?.name === 'DEPT_HEAD') return req.department_id === currentEmployee.department_id;
    return req.line_approval_step === 'L1';
  }).length;

  const pendingSourcingCount = requests.filter(r => r.current_stage === 'IT_SOURCING').length;
  const pendingBudgetCount = requests.filter(r => r.current_stage === 'PENDING_FINANCE_BUDGET').length;
  const pendingIntakeCount = requests.filter(r => r.current_stage === 'DELIVERED_PENDING_TAGGING').length;

  const screens = [
    {
      id: 'SCR-01',
      title: 'My Dashboard',
      subtitle: 'Assigned Assets',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'SCR-02',
      title: 'Request Studio',
      subtitle: 'Dynamic Form',
      icon: FilePlus,
      badge: null
    },
    {
      id: 'SCR-03',
      title: 'Approval Hub',
      subtitle: 'Short-Circuit Chain',
      icon: CheckCheck,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'SCR-04',
      title: 'IT Sourcing',
      subtitle: 'Quotes & Vendors',
      icon: ShoppingBag,
      badge: pendingSourcingCount > 0 ? pendingSourcingCount : null,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'SCR-05',
      title: 'Finance Clearance',
      subtitle: 'Budget & PO',
      icon: DollarSign,
      badge: pendingBudgetCount > 0 ? pendingBudgetCount : null,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'SCR-06',
      title: 'Intake & Barcodes',
      subtitle: 'Label & Handover',
      icon: Barcode,
      badge: pendingIntakeCount > 0 ? pendingIntakeCount : null,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'SCR-07',
      title: 'Asset Registry',
      subtitle: 'Catalog & Stock',
      icon: Package,
      badge: null
    },
    {
      id: 'SCR-08',
      title: 'Form Builder',
      subtitle: 'Dept EAV Schemas',
      icon: Sliders,
      badge: null
    },
    {
      id: 'SCR-09',
      title: 'Org Matrix',
      subtitle: 'Hierarchy & Roles',
      icon: Network,
      badge: null
    }
  ];

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-thin">
          {screens.map(screen => {
            const Icon = screen.icon;
            const isActive = activeScreen === screen.id;

            return (
              <button
                key={screen.id}
                onClick={() => setActiveScreen(screen.id)}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="font-semibold leading-tight">{screen.title}</div>
                  <div className="text-[10px] text-slate-500 hidden sm:block font-normal">
                    {screen.subtitle}
                  </div>
                </div>
                {screen.badge !== null && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      screen.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {screen.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
