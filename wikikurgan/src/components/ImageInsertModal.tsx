import React, { useState } from 'react';
import { X, Check, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface ImageInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string, caption: string, align: string) => void;
}

export const ImageInsertModal: React.FC<ImageInsertModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [align, setAlign] = useState('center');
  const [preview, setPreview] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setPreview(value);
  };

  const handleConfirm = () => {
    if (url.trim()) {
      onConfirm(url.trim(), caption.trim(), align);
      setUrl('');
      setCaption('');
      setAlign('center');
      setPreview(null);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Rasm Qoʻshish (Inline Image)</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Rasm URL Manzili *</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={url}
              onChange={handleUrlChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Rasm Ta'rifi (Caption)</label>
            <input
              type="text"
              placeholder="CyberKurgan jang sahnasidan parcha..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Tekislash (Alignment)</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAlign('left')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-medium transition-all ${
                  align === 'left'
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlignLeft className="w-4 h-4" /> Left
              </button>
              <button
                type="button"
                onClick={() => setAlign('center')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-medium transition-all ${
                  align === 'center'
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlignCenter className="w-4 h-4" /> Center
              </button>
              <button
                type="button"
                onClick={() => setAlign('right')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-medium transition-all ${
                  align === 'right'
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlignRight className="w-4 h-4" /> Right
              </button>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="pt-3 border-t border-slate-800/80">
              <label className="block font-semibold text-slate-400 mb-2">Rasm ko'rinishi (Preview):</label>
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2 flex justify-center items-center max-h-48 overflow-hidden">
                <img 
                  src={preview} 
                  alt="Preview" 
                  onError={() => setPreview(null)}
                  className="max-h-40 w-auto object-contain rounded-lg" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end space-x-2 text-xs">
          <button 
            type="button"
            onClick={onClose} 
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium transition-colors"
          >
            Bekor qilish
          </button>
          <button 
            type="button"
            onClick={handleConfirm} 
            disabled={!url.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Kiritish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
