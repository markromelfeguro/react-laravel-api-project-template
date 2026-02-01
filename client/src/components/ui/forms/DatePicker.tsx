import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../button/Button';
import { MaterialIcon } from '../MaterialIcon';

type PickerMode = 'single' | 'range';
type ViewMode = 'calendar' | 'year';

interface DatePickerProps {
  mode?: PickerMode;
  selectedDate?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  disabledDates?: Date[];
  disablePastDates?: boolean;
  onChange: (data: { date?: Date | null; start?: Date | null; end?: Date | null }) => void;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  mode = 'single',
  selectedDate,
  startDate,
  endDate,
  disabledDates = [],
  disablePastDates = false,
  onChange,
  label
}) => {

  const [viewDate, setViewDate] = useState(() => {
    if (mode === 'single' && selectedDate) return new Date(selectedDate);
    if (mode === 'range' && startDate) return new Date(startDate);
      return new Date();
    });
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isWithinRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  }, [viewDate]);

  const yearRange = useMemo(() => {
    const startYear = viewDate.getFullYear() - 5;
    return Array.from({ length: 12 }, (_, i) => startYear + i);
  }, [viewDate]);

  const isDateDisabled = (date: Date) => {
    if (disablePastDates) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) return true;
    }
    return disabledDates.some(disabled => isSameDay(date, disabled));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);

    if (isDateDisabled(clickedDate)) return;

    if (mode === 'single') {
      onChange({ date: clickedDate });
    } else {
      if (!startDate || (startDate && endDate)) {
        onChange({ start: clickedDate, end: null });
      } else if (clickedDate < startDate) {
        onChange({ start: clickedDate, end: null });
      } else {
        onChange({ start: startDate, end: clickedDate });
      }
    }
  };

  useEffect(() => {
    if (mode === 'single' && selectedDate) {
      setViewDate(new Date(selectedDate));
    } else if (mode === 'range' && startDate) {
      setViewDate(new Date(startDate));
    }
  }, [selectedDate, startDate, mode]);

  return (
    <div className="flex flex-col gap-2 p-4 bg-surface border border-border rounded-2xl shadow-main w-[320px]">
      {label && <span className="text-[10px] font-bold uppercase tracking-widest text-muted px-1">{label}</span>}

      <div className="flex items-center justify-between mb-2">
        <Button variant="ghost" size="sm" onClick={() => viewMode === 'calendar' ? setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1))) : setViewDate(new Date(viewDate.setFullYear(viewDate.getFullYear() - 12)))} className="p-1!">
          <MaterialIcon iconName="chevron_left" size={20} />
        </Button>
        <button onClick={() => setViewMode(viewMode === 'calendar' ? 'year' : 'calendar')} className="text-xs font-bold uppercase tracking-tighter text-main-text hover:text-primary">
          {viewMode === 'calendar' ? viewDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : "Select Year"}
        </button>
        <Button variant="ghost" size="sm" onClick={() => viewMode === 'calendar' ? setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1))) : setViewDate(new Date(viewDate.setFullYear(viewDate.getFullYear() + 12)))} className="p-1!">
          <MaterialIcon iconName="chevron_right" size={20} />
        </Button>
      </div>

      {viewMode === 'year' ? (
        <div className="grid grid-cols-3 gap-2 py-2">
          {yearRange.map(y => (
            <button key={y} onClick={() => { setViewDate(new Date(viewDate.setFullYear(y))); setViewMode('calendar'); }} className={`py-2 text-sm font-bold rounded-xl ${y === viewDate.getFullYear() ? 'bg-primary text-main-bg' : 'hover:bg-main-bg text-main-text'}`}>
              {y}
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1 text-center">
          {[{ key: 'sun', label: 'S' },
          { key: 'mon', label: 'M' },
          { key: 'tue', label: 'T' },
          { key: 'wed', label: 'W' },
          { key: 'thu', label: 'T' },
          { key: 'fri', label: 'F' },
          { key: 'sat', label: 'S' }]
          .map(d => <span key={d.key} className="text-[9px] font-bold text-muted pb-2">{d.key}</span>)}
          {Array.from({ length: daysInMonth.firstDay }).map((_, i) => <div key={i} />)}
          {Array.from({ length: daysInMonth.totalDays }).map((_, i) => {
            const day = i + 1;
            const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
            
            const isDisabled = isDateDisabled(current);
            const isSelected = !isDisabled && (mode === 'single' 
              ? selectedDate && isSameDay(current, selectedDate)
              : (startDate && isSameDay(current, startDate)) || (endDate && isSameDay(current, endDate)));
            
            const inRange = !isDisabled && mode === 'range' && isWithinRange(current);

            return (
              <button
                key={day}
                disabled={isDisabled}
                onClick={() => handleDateClick(day)}
                className={`
                  h-9 w-9 text-xs font-bold rounded-xl transition-all duration-200
                  ${isDisabled ? 'unavailable opacity-20 cursor-not-allowed line-through' : 'available'}
                  ${isSelected ? 'bg-primary text-main-bg scale-110 z-10' : ''}
                  ${inRange ? 'bg-primary/10 text-primary rounded-none' : ''}
                  ${!isSelected && !inRange && !isDisabled ? 'hover:bg-main-bg text-main-text' : ''}
                  ${isSameDay(current, new Date()) && !isSelected && !isDisabled ? 'border border-primary/30' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};