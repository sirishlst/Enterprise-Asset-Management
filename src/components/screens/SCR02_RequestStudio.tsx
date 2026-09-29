import React, { useState, useMemo } from 'react';
import {
  FilePlus,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Zap,
  UploadCloud,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FormField } from '../../types';

interface SCR02Props {
  onSuccess: (ticketNo: string) => void;
}

export const SCR02_RequestStudio: React.FC<SCR02Props> = ({ onSuccess }) => {
  const {
    currentEmployee,
    departments,
    categories,
    assetMasters,
    getTemplateFor,
    getReportingChain,
    createRequest
  } = useApp();

  const [selectedDeptId, setSelectedDeptId] = useState<number>(currentEmployee.department_id);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(categories[0]?.id || 1);
  const [selectedMasterId, setSelectedMasterId] = useState<number>(0);
  const [purpose, setPurpose] = useState<string>('');
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent' | 'Critical'>('Standard');
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Available asset masters for category
  const filteredMasters = useMemo(() => {
    return assetMasters.filter(m => m.category_id === selectedCategoryId);
  }, [assetMasters, selectedCategoryId]);

  // Set default master if not selected
  React.useEffect(() => {
    if (filteredMasters.length > 0 && (!selectedMasterId || !filteredMasters.some(m => m.id === selectedMasterId))) {
      setSelectedMasterId(filteredMasters[0].id);
    }
  }, [filteredMasters, selectedMasterId]);

  // Dynamic template resolution
  const currentTemplate = useMemo(() => {
    return getTemplateFor(selectedDeptId, selectedCategoryId);
  }, [getTemplateFor, selectedDeptId, selectedCategoryId]);

  // Reporting hierarchy chain
  const chain = useMemo(() => {
    return getReportingChain(currentEmployee.emp_id);
  }, [getReportingChain, currentEmployee.emp_id]);

  const handleFieldChange = (key: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCheckboxToggle = (key: string, option: string) => {
    const existing: string[] = formValues[key] || [];
    const updated = existing.includes(option)
      ? existing.filter(item => item !== option)
      : [...existing, option];
    handleFieldChange(key, updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMasterId || !purpose.trim()) {
      alert('Please select an asset master item and state the business justification purpose.');
      return;
    }

    const newReq = createRequest({
      department_id: selectedDeptId,
      category_id: selectedCategoryId,
      asset_master_id: selectedMasterId,
      purpose,
      urgency,
      custom_field_values: formValues
    });

    setSubmittedTicket(newReq.request_ticket_no);
    onSuccess(newReq.request_ticket_no);
  };

  return (
    <div className="space-y-6">
      {/* Screen Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FilePlus className="w-6 h-6 text-blue-600" />
          <span>Dynamic Asset Request Studio (SCR-02)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Intelligent dynamic schema engine generates tailored procurement specifications based on selected Department & Asset Category
        </p>
      </div>

      {submittedTicket ? (
        <div className="bg-white rounded-xl border border-emerald-200 p-8 shadow-xs text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Asset Request Successfully Submitted!</h2>
          <div className="font-mono text-blue-700 font-extrabold text-base my-2">
            Ticket No: {submittedTicket}
          </div>
          <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
            Your request has entered the hierarchical line approval pipeline. Reporting Manager ({chain.l1Manager?.emp_name}) has been notified.
            Higher-tier approvers (MD / Dept Head) can also pre-empt or directly approve.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setPurpose('');
                setFormValues({});
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Raise Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Fields: Column 1 & 2 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Classification & Master selection */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
                <span>Department & Asset Classification</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requesting Department
                  </label>
                  <select
                    value={selectedDeptId}
                    onChange={e => setSelectedDeptId(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Asset Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asset Category
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={e => setSelectedCategoryId(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Asset Master Catalog Selection */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Standard Asset Master Catalog Item
                  </label>
                  <select
                    value={selectedMasterId}
                    onChange={e => setSelectedMasterId(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                  >
                    {filteredMasters.map(master => (
                      <option key={master.id} value={master.id}>
                        {master.generic_name} — Part #{master.part_number} ({master.uom})
                      </option>
                    ))}
                  </select>

                  {/* Selected Master Description Preview */}
                  {selectedMasterId > 0 && (
                    <div className="mt-2 p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-slate-600">
                      <span className="font-semibold text-blue-900 block">Catalog Description:</span>
                      {assetMasters.find(m => m.id === selectedMasterId)?.description}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Dynamic Form Engine (EAV-lite Form Schema) */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">2</span>
                  <span>Dynamic Form Engine: Custom Specifications</span>
                </h2>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Schema v{currentTemplate?.version || 1} Active
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                <strong>{currentTemplate?.form_schema.title || 'Dynamic Asset Specification Form'}</strong>
                {currentTemplate?.form_schema.description && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{currentTemplate.form_schema.description}</p>
                )}
              </div>

              {/* Dynamic Field Renderer */}
              <div className="space-y-4 pt-2">
                {currentTemplate?.form_schema.fields.map(field => {
                  const val = formValues[field.field_key];

                  return (
                    <div key={field.field_key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-800">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {field.help_text && (
                          <span className="text-[10px] text-slate-400">{field.help_text}</span>
                        )}
                      </div>

                      {/* Select Dropdown */}
                      {field.ui_component === 'select' && (
                        <select
                          required={field.required}
                          value={val || ''}
                          onChange={e => handleFieldChange(field.field_key, e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Choose {field.label} --</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Number Input */}
                      {field.ui_component === 'number_input' && (
                        <input
                          type="number"
                          required={field.required}
                          min={field.validation?.min}
                          max={field.validation?.max}
                          value={val !== undefined ? val : ''}
                          onChange={e => handleFieldChange(field.field_key, Number(e.target.value))}
                          placeholder={field.placeholder || 'Enter value'}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {/* Text Input */}
                      {field.ui_component === 'text_input' && (
                        <input
                          type="text"
                          required={field.required}
                          value={val || ''}
                          onChange={e => handleFieldChange(field.field_key, e.target.value)}
                          placeholder={field.placeholder || 'Type here...'}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {/* Checkbox Group */}
                      {field.ui_component === 'checkbox_group' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {field.options?.map(opt => {
                            const isChecked = Array.isArray(val) && val.includes(opt);
                            return (
                              <label
                                key={opt}
                                className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-medium'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleCheckboxToggle(field.field_key, opt)}
                                  className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Textarea */}
                      {field.ui_component === 'textarea' && (
                        <textarea
                          rows={3}
                          required={field.required}
                          value={val || ''}
                          onChange={e => handleFieldChange(field.field_key, e.target.value)}
                          placeholder={field.placeholder || 'Enter details...'}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {/* File Upload Simulator */}
                      {field.ui_component === 'file_upload' && (
                        <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer">
                          <UploadCloud className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                          <div className="text-[11px] text-slate-600 font-medium">
                            {val ? `Uploaded: ${val}` : 'Attach Technical Spec or Quote Reference (.pdf, .xlsx)'}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleFieldChange(
                                field.field_key,
                                `spec-sheet-${Date.now().toString().slice(-4)}.pdf`
                              )
                            }
                            className="mt-1 text-[10px] text-blue-600 hover:underline font-semibold"
                          >
                            Simulate File Attachment
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Purpose & Justification */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">3</span>
                <span>Operational Purpose & Urgency</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Purpose & Operational Justification <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={purpose}
                    onChange={e => setPurpose(e.target.value)}
                    placeholder="Clearly explain the business need, project deliverable, or operational requirement..."
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ticket Priority / Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={e => setUrgency(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Standard">Standard (7-14 Days)</option>
                    <option value="Urgent">Urgent (3-5 Days)</option>
                    <option value="Critical">Critical (Immediate Production Blocker)</option>
                  </select>
                  <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                    Critical tickets alert MD and Line Managers simultaneously.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reporting Hierarchy & Short-Circuit Architecture */}
          <div className="space-y-6">
            {/* Visual Approval Chain */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Approval Hierarchy Path</span>
              </h3>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 before:z-0">
                {/* 1. Requester */}
                <div className="relative z-10 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    0
                  </div>
                  <div className="text-xs">
                    <span className="text-[10px] uppercase font-bold text-blue-600 block">Requester</span>
                    <span className="font-bold text-slate-900">{chain.requester.emp_name}</span>
                    <span className="text-slate-500 block text-[11px] font-mono">({chain.requester.emp_id})</span>
                  </div>
                </div>

                {/* 2. L1 Reporting Manager */}
                <div className="relative z-10 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    L1
                  </div>
                  <div className="text-xs">
                    <span className="text-[10px] uppercase font-bold text-amber-600 block">Reporting Manager</span>
                    <span className="font-bold text-slate-900">
                      {chain.l1Manager ? chain.l1Manager.emp_name : 'Direct to MD'}
                    </span>
                    {chain.l1Manager && (
                      <span className="text-slate-500 block text-[11px] font-mono">({chain.l1Manager.emp_id})</span>
                    )}
                  </div>
                </div>

                {/* 3. L2 Dept Head */}
                {chain.l2Head && (
                  <div className="relative z-10 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      L2
                    </div>
                    <div className="text-xs">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 block">Department Head</span>
                      <span className="font-bold text-slate-900">{chain.l2Head.emp_name}</span>
                      <span className="text-slate-500 block text-[11px] font-mono">({chain.l2Head.emp_id})</span>
                    </div>
                  </div>
                )}

                {/* 4. MD Final Approver */}
                <div className="relative z-10 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    MD
                  </div>
                  <div className="text-xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">Managing Director</span>
                    <span className="font-bold text-slate-900">
                      {chain.md ? chain.md.emp_name : 'Executive Approver'}
                    </span>
                    {chain.md && (
                      <span className="text-slate-500 block text-[11px] font-mono">({chain.md.emp_id})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Short-Circuit Explanation Card */}
              <div className="mt-5 p-3.5 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Short-Circuit / Pre-emption Rule</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  The <strong>Managing Director (MD)</strong> can directly approve this ticket at any stage, immediately bypassing L1 and L2 line managers.
                  Similarly, <strong>L2</strong> can approve directly with pre-emption of L1.
                </p>
              </div>
            </div>

            {/* Submit Action Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Submit Asset Ticket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                Upon submission, audit logs and email alerts are dispatched to the line hierarchy.
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
