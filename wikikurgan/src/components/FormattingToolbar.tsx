import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Image, Link, List, Heading } from 'lucide-react';

interface FormattingToolbarProps {
  onAction: (actionType: string) => void;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({ onAction }) => {
  const buttons = [
    { type: 'bold', icon: <Bold className="w-3.5 h-3.5" />, label: 'Qalin (Bold) - \'\'\'matn\'\'\'' },
    { type: 'italic', icon: <Italic className="w-3.5 h-3.5" />, label: 'Yotiq (Italic) - \'\'matn\'\'' },
    { type: 'underline', icon: <Underline className="w-3.5 h-3.5" />, label: 'Ostki chiziq (Underline) - <u>matn</u>' },
    { type: 'divider1', isDivider: true },
    { type: 'align-left', icon: <AlignLeft className="w-3.5 h-3.5" />, label: 'Chapdan tekislash - <left>matn</left>' },
    { type: 'align-center', icon: <AlignCenter className="w-3.5 h-3.5" />, label: 'Oʻrtadan tekislash - <center>matn</center>' },
    { type: 'align-right', icon: <AlignRight className="w-3.5 h-3.5" />, label: 'Oʻngdan tekislash - <right>matn</right>' },
    { type: 'divider2', isDivider: true },
    { type: 'heading', icon: <Heading className="w-3.5 h-3.5" />, label: 'Sarlavha (Heading) - == Sarlavha ==' },
    { type: 'bullet', icon: <List className="w-3.5 h-3.5" />, label: 'Roʻyxat (List) - * element' },
    { type: 'link', icon: <Link className="w-3.5 h-3.5" />, label: 'Wikipedia Havola - [[Sahifa]]' },
    { type: 'image', icon: <Image className="w-3.5 h-3.5 text-cyan-400" />, label: 'Rasm qoʻshish (Insert Image) - [[Image:url|ta\'rif|tekislash]]' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 rounded-t-xl bg-slate-950 border-t border-x border-slate-800/80">
      {buttons.map((btn, idx) => {
        if (btn.isDivider) {
          return <div key={`div-${idx}`} className="w-[1px] h-4 bg-slate-800/80 mx-1.5" />;
        }
        return (
          <button
            key={btn.type}
            type="button"
            onClick={() => onAction(btn.type)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            title={btn.label}
          >
            {btn.icon}
          </button>
        );
      })}
    </div>
  );
};
