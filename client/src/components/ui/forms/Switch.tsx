import React from "react";

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between p-5 bg-main-bg rounded-4xl border border-border/50 transition-all hover:border-primary/30">
    <span className="text-[10px] font-black uppercase italic tracking-widest text-muted">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        checked ? "bg-primary" : "bg-muted/30"
      }`}>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);