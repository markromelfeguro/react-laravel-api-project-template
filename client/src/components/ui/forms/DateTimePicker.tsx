import React, { useState, useMemo } from 'react';
import { DatePicker, MaterialIcon, Modal } from '../index';

type BlockedTime = { hour: string; minute: string; ampm: string };

interface DateTimePickerProps {
  mode?: 'single' | 'range';
  selectedDate?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  disabledDates?: Date[];
  disabledTimes?: BlockedTime[];
  disablePastDates?: boolean;
  minuteStep?: number;
  onChange: (data: any) => void;
  label?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
  const { minuteStep = 1 } = props;
  const [activePicker, setActivePicker] = useState<'start' | 'end' | null>(null);
  const [time, setTime] = useState({ hour: '12', minute: '00', ampm: 'PM' });
  const [endTime, setEndTime] = useState({ hour: '12', minute: '00', ampm: 'PM' });

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = useMemo(() => 
    Array.from({ length: 60 / minuteStep }, (_, i) => (i * minuteStep).toString().padStart(2, '0')),
    [minuteStep]
  );

  const isTimeDisabled = (h: string, m: string, a: string) => {
    return props.disabledTimes?.some(t => t.hour === h && t.minute === m && t.ampm === a);
  };

  const TimeDisplayTrigger = ({ label, values, type }: any) => (
    <div className="flex flex-col gap-1 flex-1">
      <span className="text-[9px] font-bold text-muted uppercase tracking-widest px-1">{label}</span>
      <button 
        type="button"
        onClick={() => setActivePicker(type)}
        className="flex items-center justify-between bg-main-bg/40 p-4 rounded-3xl border border-border hover:border-primary transition-all group active:scale-95"
      >
        <div className="flex items-center gap-3">
          <MaterialIcon iconName="schedule" size={18} className="text-muted group-hover:text-primary" />
          <span className="text-xs font-black uppercase italic tracking-tighter text-main-text">
            {values.hour}:{values.minute} {values.ampm}
          </span>
        </div>
        <MaterialIcon iconName="keyboard_arrow_down" size={20} className="text-muted" />
      </button>
    </div>
  );

  const activeValues = activePicker === 'start' ? time : endTime;
  const setActiveValues = activePicker === 'start' ? setTime : setEndTime;

  return (
    <div className="flex flex-col bg-surface border border-border rounded-[2.5rem] shadow-main overflow-hidden w-[320px]">
      <DatePicker {...props} />
      
      <div className="p-6 pt-2 border-t border-border mt-2 bg-main-bg/10">
        <div className="flex flex-col gap-4 py-3">
          <TimeDisplayTrigger label={props.mode === 'range' ? "Check-in" : "Time"} values={time} type="start" />
          {props.mode === 'range' && (
            <TimeDisplayTrigger label="Check-out" values={endTime} type="end" />
          )}
        </div>
      </div>

      {/* Time Selector Modal */}
      <Modal 
        isOpen={!!activePicker} 
        onClose={() => setActivePicker(null)}
        title={activePicker === 'start' ? "Set Entry Time" : "Set Exit Time"}
        size="sm"
        primaryAction={{
          label: "Confirm Time",
          onClick: () => setActivePicker(null),
          variant: "primary"
        }}
      >
        <div className="space-y-8">
          {/* AM/PM Toggle */}
          <div className="flex bg-main-bg p-1.5 rounded-3xl border border-border">
            {['AM', 'PM'].map(period => (
              <button
                key={period}
                type="button"
                onClick={() => setActiveValues({ ...activeValues, ampm: period })}
                className={`flex-1 py-3 text-xs font-black uppercase italic rounded-2xl transition-all ${activeValues.ampm === period ? 'bg-primary text-main-bg shadow-lg' : 'text-muted hover:text-main-text'}`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Hour Grid */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4 block">Hour</span>
            <div className="grid grid-cols-4 gap-2">
              {hours.map(h => {
                const disabled = isTimeDisabled(h, activeValues.minute, activeValues.ampm);
                return (
                  <button
                    key={h}
                    type="button"
                    disabled={disabled}
                    onClick={() => setActiveValues({ ...activeValues, hour: h })}
                    className={`py-4 text-sm font-black italic rounded-2xl border transition-all active:scale-90 ${disabled ? 'opacity-10 cursor-not-allowed line-through' : activeValues.hour === h ? 'bg-primary border-primary text-main-bg shadow-lg' : 'bg-surface border-border text-main-text hover:border-primary'}`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minute Grid */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4 block">Minute</span>
            <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {minutes.map(m => {
                const disabled = isTimeDisabled(activeValues.hour, m, activeValues.ampm);
                return (
                  <button
                    key={m}
                    type="button"
                    disabled={disabled}
                    onClick={() => setActiveValues({ ...activeValues, minute: m })}
                    className={`py-3 text-[11px] font-bold rounded-xl border transition-all active:scale-90 ${disabled ? 'opacity-10 cursor-not-allowed border-transparent' : activeValues.minute === m ? 'bg-primary border-primary text-main-bg' : 'bg-surface border-border text-main-text hover:border-primary'}`}>
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};