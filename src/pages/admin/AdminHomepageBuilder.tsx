import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, ArrowDown, Eye, EyeOff, Save, 
  Sparkles, LayoutTemplate, Check, Settings 
} from 'lucide-react';
import { HomepageSectionConfig } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminHomepageBuilder: React.FC = () => {
  const { showToast } = useToast();
  const [sections, setSections] = useState<HomepageSectionConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    try {
      const data = await api.getHomepageSections();
      setSections(data.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Update order numbers
    const reordered = updated.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setSections(reordered);
  };

  const toggleEnabled = (id: string) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, enabled: !sec.enabled } : sec));
  };

  const updateTitle = (id: string, title: string) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, title } : sec));
  };

  const updateSubtitle = (id: string, subtitle: string) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, subtitle } : sec));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveHomepageSections(sections);
      showToast('Homepage Layout Saved!', 'Changes are now live on the public storefront.', 'success');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C3829]">Visual Homepage Builder (CMS)</h2>
          <p className="text-xs text-[#5E6E64]">Reorder, toggle visibility, and customize headline copy for homepage sections.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] active:bg-[#12241A] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#7A8A7F]">Loading CMS homepage modules...</div>
        ) : (
          sections.map((section, idx) => (
            <div
              key={section.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                section.enabled
                  ? 'bg-white border-[#EAE5DA] shadow-2xs'
                  : 'bg-stone-100 border-stone-200 opacity-60'
              }`}
            >
              
              {/* Order & Drag Indicator */}
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#EAEFEA] text-[#1C3829] text-xs font-bold flex items-center justify-center">
                  #{idx + 1}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {section.type.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${section.enabled ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {section.enabled ? '● Visible' : '○ Hidden'}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={section.title || ''}
                      onChange={(e) => updateTitle(section.id, e.target.value)}
                      placeholder="Section Header Title..."
                      className="text-xs font-bold text-[#1C3829] p-1.5 rounded border border-stone-200 bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                    />
                    <input
                      type="text"
                      value={section.subtitle || ''}
                      onChange={(e) => updateSubtitle(section.id, e.target.value)}
                      placeholder="Subtitle or tag description..."
                      className="text-xs text-[#5E6E64] p-1.5 rounded border border-stone-200 bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => toggleEnabled(section.id)}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    section.enabled ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                  }`}
                  title={section.enabled ? 'Hide Section' : 'Show Section'}
                >
                  {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{section.enabled ? 'Active' : 'Disabled'}</span>
                </button>

                <button
                  onClick={() => moveSection(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  title="Move Section Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  onClick={() => moveSection(idx, 'down')}
                  disabled={idx === sections.length - 1}
                  className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  title="Move Section Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
