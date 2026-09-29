import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Printer,
  Plus,
  Layers,
  Tag,
  CheckCircle2,
  Wrench,
  AlertOctagon,
  Boxes,
  UserCheck,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssetItem, AssetMaster, AssetCategory, AssetStatus } from '../../types';
import { AssetTagModal } from '../common/AssetTagModal';

export const SCR07_AssetRegistry: React.FC = () => {
  const {
    assetItems,
    assetMasters,
    categories,
    employees,
    departments,
    getEmployee,
    saveAssetMaster,
    saveAssetCategory
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ITEMS' | 'MASTERS' | 'CATEGORIES'>('ITEMS');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [selectedTagModal, setSelectedTagModal] = useState<{ item: AssetItem; master?: AssetMaster } | null>(null);

  // New Asset Master Modal
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [masterGenericName, setMasterGenericName] = useState('');
  const [masterCategoryId, setMasterCategoryId] = useState<number>(categories[0]?.id || 1);
  const [masterPartNumber, setMasterPartNumber] = useState('');
  const [masterDescription, setMasterDescription] = useState('');
  const [masterUom, setMasterUom] = useState<'UNIT' | 'SET' | 'MTR' | 'PACK'>('UNIT');

  // New Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catCode, setCatCode] = useState('');
  const [catDeprec, setCatDeprec] = useState<number>(20);

  // Filtered physical items
  const filteredItems = assetItems.filter(item => {
    const master = assetMasters.find(m => m.id === item.asset_master_id);
    const assignedEmp = getEmployee(item.current_assigned_emp_id);

    const matchesSearch =
      item.unique_asset_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (master?.generic_name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (assignedEmp?.emp_name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesCat =
      filterCategory === 'ALL' || (master && master.category_id === Number(filterCategory));

    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleSaveMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterGenericName.trim() || !masterPartNumber.trim()) return;

    saveAssetMaster({
      id: Date.now(),
      generic_name: masterGenericName,
      category_id: masterCategoryId,
      part_number: masterPartNumber,
      description: masterDescription,
      uom: masterUom,
      created_at: new Date().toISOString()
    });

    setIsMasterModalOpen(false);
    setMasterGenericName('');
    setMasterPartNumber('');
    setMasterDescription('');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catCode.trim()) return;

    saveAssetCategory({
      id: Date.now(),
      name: catName,
      code: catCode.toUpperCase(),
      depreciation_rate: catDeprec
    });

    setIsCategoryModalOpen(false);
    setCatName('');
    setCatCode('');
  };

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'ALLOCATED':
        return { label: 'Allocated', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'IN_STOCK':
        return { label: 'In Stock (Free)', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'UNDER_MAINTENANCE':
        return { label: 'Maintenance', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'SCRAPPED':
        return { label: 'Scrapped', bg: 'bg-red-50 text-red-700 border-red-200' };
      case 'IN_PROCUREMENT':
        return { label: 'Procurement', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              <span>Asset Master & Inventory Registry (SCR-07)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enterprise central catalog: Asset master definitions, part numbers, depreciation rates, physical hardware barcodes, and custodial assignment status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'MASTERS' && (
              <button
                onClick={() => setIsMasterModalOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Asset Master</span>
              </button>
            )}
            {activeTab === 'CATEGORIES' && (
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Category</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ITEMS')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ITEMS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Physical Asset Items ({assetItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('MASTERS')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'MASTERS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Asset Masters Catalog ({assetMasters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CATEGORIES')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'CATEGORIES'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Asset Categories ({categories.length})</span>
        </button>
      </div>

      {/* Tab 1: Physical Asset Items Table */}
      {activeTab === 'ITEMS' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by Barcode Tag, Serial No, Item Name, or Employee..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="text-xs p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="text-xs p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="ALLOCATED">Allocated</option>
                <option value="IN_STOCK">In Stock (Available)</option>
                <option value="UNDER_MAINTENANCE">Maintenance</option>
                <option value="SCRAPPED">Scrapped</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Asset Tag Code</th>
                    <th className="px-4 py-3">Generic Item & Part No</th>
                    <th className="px-4 py-3">Serial Number</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Current Custodian</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Warranty Expiry</th>
                    <th className="px-4 py-3 text-right">Cost</th>
                    <th className="px-4 py-3 text-center">Tag Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredItems.map(item => {
                    const master = assetMasters.find(m => m.id === item.asset_master_id);
                    const cat = categories.find(c => c.id === master?.category_id);
                    const assignedEmp = getEmployee(item.current_assigned_emp_id);
                    const badge = getStatusBadge(item.status);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                          {item.unique_asset_code}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{master?.generic_name}</div>
                          <div className="font-mono text-[10px] text-slate-400">Part: {master?.part_number}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700 max-w-[140px] truncate">
                          {item.serial_number}
                        </td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          {cat?.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {assignedEmp ? (
                            <div>
                              <span className="font-semibold text-slate-800">{assignedEmp.emp_name}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">({assignedEmp.emp_id})</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">None (In Warehouse)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {item.warranty_expiry_date || 'Standard'}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900">
                          ${item.purchase_cost.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedTagModal({ item, master })}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Print Barcode Sticker"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Asset Masters Catalog */}
      {activeTab === 'MASTERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assetMasters.map(master => {
            const cat = categories.find(c => c.id === master.category_id);
            const totalStock = assetItems.filter(i => i.asset_master_id === master.id).length;
            const allocatedCount = assetItems.filter(i => i.asset_master_id === master.id && i.status === 'ALLOCATED').length;

            return (
              <div key={master.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {cat?.name}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {master.uom}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-1">{master.generic_name}</h3>
                  <div className="font-mono text-xs text-slate-500 mb-2">Part #: {master.part_number}</div>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4">{master.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Total In Fleet: <strong>{totalStock}</strong></span>
                  <span className="text-emerald-700 font-semibold">Active: {allocatedCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Asset Categories */}
      {activeTab === 'CATEGORIES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const masterCount = assetMasters.filter(m => m.category_id === cat.id).length;
            const itemsCount = assetItems.filter(i => {
              const m = assetMasters.find(master => master.id === i.asset_master_id);
              return m?.category_id === cat.id;
            }).length;

            return (
              <div key={cat.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    Code: {cat.code}
                  </span>
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    Deprec: {cat.depreciation_rate}% / yr
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2 mb-3">{cat.name}</h3>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span>Masters: <strong>{masterCount}</strong></span>
                  <span>Physical Items: <strong>{itemsCount}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Asset Master Modal */}
      {isMasterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create New Asset Master Definition</h3>
            <form onSubmit={handleSaveMaster} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Generic Name</label>
                <input
                  type="text"
                  required
                  value={masterGenericName}
                  onChange={e => setMasterGenericName(e.target.value)}
                  placeholder="e.g. Dell Latitude 7440 Ultrabook"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={masterCategoryId}
                    onChange={e => setMasterCategoryId(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit of Measure (UOM)</label>
                  <select
                    value={masterUom}
                    onChange={e => setMasterUom(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="UNIT">UNIT</option>
                    <option value="SET">SET</option>
                    <option value="MTR">MTR</option>
                    <option value="PACK">PACK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Manufacturer Part Number</label>
                <input
                  type="text"
                  required
                  value={masterPartNumber}
                  onChange={e => setMasterPartNumber(e.target.value)}
                  placeholder="e.g. DL-LAT-7440-I7"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Technical Specification</label>
                <textarea
                  rows={3}
                  value={masterDescription}
                  onChange={e => setMasterDescription(e.target.value)}
                  placeholder="Provide base technical specs, CPU, RAM, physical dimensions..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMasterModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save Asset Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Asset Category</h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  placeholder="e.g. Server Rack Equipment"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category Code</label>
                  <input
                    type="text"
                    required
                    value={catCode}
                    onChange={e => setCatCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SRV"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Deprec. Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={catDeprec}
                    onChange={e => setCatDeprec(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Tag Modal */}
      {selectedTagModal && (
        <AssetTagModal
          item={selectedTagModal.item}
          master={selectedTagModal.master}
          onClose={() => setSelectedTagModal(null)}
        />
      )}
    </div>
  );
};
