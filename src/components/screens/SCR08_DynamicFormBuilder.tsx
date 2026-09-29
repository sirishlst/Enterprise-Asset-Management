import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Code,
  Eye,
  CheckCircle2,
  Layers,
  Building,
  MoveUp,
  MoveDown,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DynamicFormTemplate, FormField, UIComponentType } from '../../types';

export const SCR08_DynamicFormBuilder: React.FC = () => {
  const {
    departments,
    categories,
    dynamicTemplates,
    saveDynamicTemplate,
    getTemplateFor
  } = useApp();

  const [selectedDeptId, setSelectedDeptId] = useState<number>(departments[0]?.id || 1);
  const [selectedCatId, setSelectedCatId] = useState<number>(categories[0]?.id || 1);

  // Active form schema being edited
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [version, setVersion] = useState(1);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  // New field creator state
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newComponent, setNewComponent] = useState<UIComponentType>('text_input');
  const [newRequired, setNewRequired] = useState(true);
  const [newOptionsStr, setNewOptionsStr] = useState('');
  const [newPlaceholder, setNewPlaceholder] = useState('');
  const [newHelpText, setNewHelpText] = useState('');
  const [newMin, setNewMin] = useState<number | undefined>(undefined);
  const [newMax, setNewMax] = useState<number | undefined>(undefined);

  // Load existing template when department or category changes
  useEffect(() => {
    const existing = dynamicTemplates.find(
      t => t.department_id === selectedDeptId && t.category_id === selectedCatId
    );

    if (existing) {
      setTemplateTitle(existing.form_schema.title);
      setTemplateDesc(existing.form_schema.description || '');
      setFields([...existing.form_schema.fields]);
      setVersion(existing.version);
    } else {
      const dept = departments.find(d => d.id === selectedDeptId);
      const cat = categories.find(c => c.id === selectedCatId);
      setTemplateTitle(`${dept?.name || 'Department'} ${cat?.name || 'Asset'} Request Form`);
      setTemplateDesc(`Custom attributes and validation requirements for ${cat?.name}.`);
      setFields([
        {
          field_key: 'item_spec_notes',
          label: 'Specialist Performance Specs',
          ui_component: 'textarea',
          required: true,
          placeholder: 'List technical and environment requirements...'
        }
      ]);
      setVersion(1);
    }
  }, [selectedDeptId, selectedCatId, dynamicTemplates, departments, categories]);

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newLabel.trim()) {
      alert('Field Key and Label are required.');
      return;
    }

    const cleanKey = newKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (fields.some(f => f.field_key === cleanKey)) {
      alert('A field with this key already exists in the template.');
      return;
    }

    const parsedOptions = ['select', 'checkbox_group'].includes(newComponent)
      ? newOptionsStr.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const newField: FormField = {
      field_key: cleanKey,
      label: newLabel.trim(),
      ui_component: newComponent,
      required: newRequired,
      options: parsedOptions,
      placeholder: newPlaceholder.trim() || undefined,
      help_text: newHelpText.trim() || undefined,
      validation: newComponent === 'number_input' ? { min: newMin, max: newMax } : undefined
    };

    setFields(prev => [...prev, newField]);

    // Reset new field inputs
    setNewKey('');
    setNewLabel('');
    setNewOptionsStr('');
    setNewPlaceholder('');
    setNewHelpText('');
    setNewMin(undefined);
    setNewMax(undefined);
  };

  const handleRemoveField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveField = (index: number, direction: 'UP' | 'DOWN') => {
    if (direction === 'UP' && index === 0) return;
    if (direction === 'DOWN' && index === fields.length - 1) return;

    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    const copy = [...fields];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setFields(copy);
  };

  const handleSave = () => {
    const existing = dynamicTemplates.find(
      t => t.department_id === selectedDeptId && t.category_id === selectedCatId
    );

    const updatedTemplate: DynamicFormTemplate = {
      id: existing ? existing.id : Date.now(),
      department_id: selectedDeptId,
      category_id: selectedCatId,
      version: existing ? existing.version + 1 : 1,
      is_active: true,
      created_at: new Date().toISOString(),
      form_schema: {
        title: templateTitle,
        description: templateDesc,
        fields
      }
    };

    saveDynamicTemplate(updatedTemplate);
    setVersion(updatedTemplate.version);
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-6 h-6 text-blue-600" />
              <span>Dynamic Form Template Builder (SCR-08)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Design tailored input schemas per (Department × Asset Category) combination without database migrations or code deployment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJsonPreview(!showJsonPreview)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Code className="w-4 h-4 text-slate-600" />
              <span>{showJsonPreview ? 'Hide JSON Schema' : 'Inspect JSON Schema'}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Publish Version</span>
            </button>
          </div>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Template version {version} saved and activated! Any employee requesting this department/category will instantly see these updated fields.</span>
        </div>
      )}

      {/* Target Department × Category Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Department</label>
            <select
              value={selectedDeptId}
              onChange={e => setSelectedDeptId(Number(e.target.value))}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800"
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Asset Category</label>
            <select
              value={selectedCatId}
              onChange={e => setSelectedCatId(Number(e.target.value))}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Form Template Title</label>
            <input
              type="text"
              value={templateTitle}
              onChange={e => setTemplateTitle(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subtext / Guidance</label>
            <input
              type="text"
              value={templateDesc}
              onChange={e => setTemplateDesc(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* JSON Schema Inspection View */}
      {showJsonPreview && (
        <div className="bg-slate-900 text-emerald-400 p-5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-md">
          <div className="text-slate-400 mb-2 font-sans flex justify-between">
            <span>JSON Schema Contract (`form_schema`)</span>
            <span>Version: {version}</span>
          </div>
          <pre>{JSON.stringify({ title: templateTitle, description: templateDesc, fields }, null, 2)}</pre>
        </div>
      )}

      {/* Main Grid: Form Canvas & Real-time Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Fields Canvas & Add Field */}
        <div className="space-y-6">
          {/* Active Fields List */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Form Fields Canvas ({fields.length} items)
              </h3>
              <span className="text-[11px] text-slate-400">Reorder with arrows</span>
            </div>

            {fields.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-lg">
                No custom fields defined yet. Add your first field below.
              </div>
            ) : (
              <div className="space-y-2.5">
                {fields.map((field, idx) => (
                  <div
                    key={field.field_key}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">{field.label}</span>
                        {field.required && (
                          <span className="text-[10px] text-red-600 bg-red-50 px-1.5 rounded font-semibold">
                            Req
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 rounded">
                          {field.ui_component}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        key: {field.field_key}
                        {field.options && ` · options: [${field.options.join(', ')}]`}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveField(idx, 'UP')}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveField(idx, 'DOWN')}
                        disabled={idx === fields.length - 1}
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveField(idx)}
                        className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 ml-1"
                        title="Delete Field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Field Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Add Custom Dynamic Field</span>
            </h3>

            <form onSubmit={handleAddField} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Field Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newLabel}
                    onChange={e => {
                      setNewLabel(e.target.value);
                      if (!newKey) {
                        setNewKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'));
                      }
                    }}
                    placeholder="e.g. Operating Voltage"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    JSON Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newKey}
                    onChange={e => setNewKey(e.target.value)}
                    placeholder="e.g. operating_voltage"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">UI Component</label>
                  <select
                    value={newComponent}
                    onChange={e => setNewComponent(e.target.value as UIComponentType)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="text_input">Text Input</option>
                    <option value="number_input">Number Input</option>
                    <option value="select">Dropdown Select</option>
                    <option value="checkbox_group">Checkbox Group</option>
                    <option value="textarea">Textarea (Long text)</option>
                    <option value="date_picker">Date Picker</option>
                    <option value="file_upload">File Upload Reference</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRequired}
                      onChange={e => setNewRequired(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Required Field</span>
                  </label>
                </div>
              </div>

              {['select', 'checkbox_group'].includes(newComponent) && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selectable Options (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newOptionsStr}
                    onChange={e => setNewOptionsStr(e.target.value)}
                    placeholder="110V Single Phase, 220V Single Phase, 440V 3-Phase"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              )}

              {newComponent === 'number_input' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Min Value</label>
                    <input
                      type="number"
                      value={newMin ?? ''}
                      onChange={e => setNewMin(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 1"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Max Value</label>
                    <input
                      type="number"
                      value={newMax ?? ''}
                      onChange={e => setNewMax(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 256"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={newPlaceholder}
                    onChange={e => setNewPlaceholder(e.target.value)}
                    placeholder="e.g. Choose option..."
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Help Text</label>
                  <input
                    type="text"
                    value={newHelpText}
                    onChange={e => setNewHelpText(e.target.value)}
                    placeholder="e.g. Recommended for high-load server"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Field to Form</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Live Interactive Form Preview */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Live Requester View Preview
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Interactive Mock
              </span>
            </div>

            <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-900">{templateTitle}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{templateDesc}</p>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {fields.map(f => (
                <div key={f.field_key} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-800">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  {f.help_text && <p className="text-[10px] text-slate-400">{f.help_text}</p>}

                  {f.ui_component === 'select' && (
                    <select className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg">
                      <option value="">-- Choose {f.label} --</option>
                      {f.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  )}

                  {f.ui_component === 'text_input' && (
                    <input
                      type="text"
                      placeholder={f.placeholder || 'Type here...'}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  )}

                  {f.ui_component === 'number_input' && (
                    <input
                      type="number"
                      placeholder={f.placeholder || '0'}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  )}

                  {f.ui_component === 'textarea' && (
                    <textarea
                      rows={2}
                      placeholder={f.placeholder || 'Enter specification details...'}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  )}

                  {f.ui_component === 'checkbox_group' && (
                    <div className="space-y-1 pt-1">
                      {f.options?.map(opt => (
                        <label key={opt} className="flex items-center gap-2 text-xs text-slate-700">
                          <input type="checkbox" className="rounded text-blue-600" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {f.ui_component === 'file_upload' && (
                    <div className="border border-dashed border-slate-300 rounded p-2 text-center text-[11px] text-slate-500 bg-slate-50">
                      Simulated document attachment (.pdf, .xlsx)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
