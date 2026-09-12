import React, { useState } from 'react';
import { useTaskStore } from '@/lib/taskStore';
import { Task, ScheduledSlot } from '@/lib/mockData';
import { Edit2, Move, Clock, SplitSquareHorizontal, Copy, Check, Trash2, X, AlertTriangle, Undo2 } from 'lucide-react';

interface TaskEditModalProps {
  task: Task;
  slotIndex: number;
  onClose: () => void;
}

export default function TaskEditModal({ task, slotIndex, onClose }: TaskEditModalProps) {
  const [mode, setMode] = useState<'menu' | 'edit' | 'move' | 'resize' | 'split'>('menu');
  const slot = task.scheduledSlots[slotIndex];
  
  const updateTask = useTaskStore(s => s.updateTask);
  const moveSlot = useTaskStore(s => s.moveSlot);
  const splitSlot = useTaskStore(s => s.splitSlot);
  const duplicateTask = useTaskStore(s => s.duplicateTask);
  const deleteTask = useTaskStore(s => s.deleteTask);
  const undo = useTaskStore(s => s.undo);
  const tasks = useTaskStore(s => s.tasks);

  // Form states
  const [editTitle, setEditTitle] = useState(task.title);
  const [moveDate, setMoveDate] = useState(slot.date);
  const [moveStart, setMoveStart] = useState(slot.startTime);
  const [moveEnd, setMoveEnd] = useState(slot.endTime);
  const [resizeStart, setResizeStart] = useState(slot.startTime);
  const [resizeEnd, setResizeEnd] = useState(slot.endTime);
  const [splitTime, setSplitTime] = useState(slot.startTime); // Time to split at

  const checkConflict = (date: string, start: string, end: string) => {
    // Basic conflict check
    const startMins = timeToMins(start);
    const endMins = timeToMins(end);
    
    for (const t of tasks) {
      if (t.id === task.id) continue;
      for (const s of t.scheduledSlots) {
        if (s.date === date) {
          const sStart = timeToMins(s.startTime);
          const sEnd = timeToMins(s.endTime);
          if ((startMins >= sStart && startMins < sEnd) || 
              (endMins > sStart && endMins <= sEnd) ||
              (startMins <= sStart && endMins >= sEnd)) {
            return t.title;
          }
        }
      }
    }
    return null;
  };

  const conflict = mode === 'move' ? checkConflict(moveDate, moveStart, moveEnd) : 
                   mode === 'resize' ? checkConflict(slot.date, resizeStart, resizeEnd) : null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const timeToMins = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  return (
    <div className="fixed inset-y-0 z-[60] flex flex-col justify-end" style={{ width: '375px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-t-3xl" style={{ padding: '24px 24px 100px 24px', maxHeight: '80vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-lg font-bold text-[#1A1A3E]">{task.title}</p>
            <p className="text-sm text-[#8B8FB5]">
              📅 {slot.date} • 🕐 {slot.startTime} - {slot.endTime}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={18} color="#1A1A3E" />
          </button>
        </div>

        {/* Undo banner if past states exist? We'll put a global undo somewhere else or here */}
        <div className="flex justify-end mb-4">
           <button onClick={undo} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#6C63FF]">
             <Undo2 size={14} /> Undo Last Action
           </button>
        </div>

        {/* Conflict Warning */}
        {conflict && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 flex gap-3 items-start">
            <AlertTriangle size={16} color="#FF4444" className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-600">⚠️ Schedule Conflict</p>
              <p className="text-xs text-red-500 mt-1">Overlaps with <strong>{conflict}</strong>.</p>
            </div>
          </div>
        )}

        {mode === 'menu' && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <SquareButton icon={<Edit2 size={20}/>} label="Edit Task" onClick={() => setMode('edit')} />
              <SquareButton icon={<Move size={20}/>} label="Move" onClick={() => {}} />
              <SquareButton icon={<Clock size={20}/>} label="Duration" onClick={() => {}} />
              <SquareButton icon={<SplitSquareHorizontal size={20}/>} label="Split Task" onClick={() => setMode('split')} />
              <SquareButton icon={<Copy size={20}/>} label="Duplicate" onClick={() => handleAction(() => duplicateTask(task.id, slot.date))} />
              <SquareButton icon={<Check size={20}/>} label="Complete" onClick={() => handleAction(() => updateTask(task.id, { status: 'done' }))} />
            </div>
            <MenuButton icon={<Trash2 size={16} color="#FF4444"/>} label="Delete Task" onClick={() => handleAction(() => deleteTask(task.id))} textStyle={{ color: '#FF4444' }} />
          </>
        )}

        {mode === 'edit' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Task Name</label>
              <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setMode('menu')} className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700">Cancel</button>
              <button onClick={() => handleAction(() => updateTask(task.id, { title: editTitle }))} className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#6C63FF] text-white">Save Edit</button>
            </div>
          </div>
        )}

        {mode === 'move' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">New Date</label>
              <input type="date" value={moveDate} onChange={e => setMoveDate(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Start</label>
                <input type="time" value={moveStart} onChange={e => setMoveStart(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase">End</label>
                <input type="time" value={moveEnd} onChange={e => setMoveEnd(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setMode('menu')} className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700">Cancel</button>
              <button onClick={() => handleAction(() => moveSlot(task.id, slotIndex, moveDate, moveStart, moveEnd))} className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#6C63FF] text-white">Move Task</button>
            </div>
          </div>
        )}

        {mode === 'resize' && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Start Time</label>
                <input type="time" value={resizeStart} onChange={e => setResizeStart(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase">End Time</label>
                <input type="time" value={resizeEnd} onChange={e => setResizeEnd(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setMode('menu')} className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700">Cancel</button>
              <button onClick={() => handleAction(() => moveSlot(task.id, slotIndex, slot.date, resizeStart, resizeEnd))} className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#6C63FF] text-white">Save Duration</button>
            </div>
          </div>
        )}

        {mode === 'split' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-gray-500">Choose a time to split this {slot.startTime} - {slot.endTime} block into two separate tasks.</p>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Split At</label>
              <input type="time" value={splitTime} onChange={e => setSplitTime(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setMode('menu')} className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700">Cancel</button>
              <button onClick={() => handleAction(() => {
                const s1 = { ...slot, endTime: splitTime };
                const s2 = { ...slot, startTime: splitTime };
                splitSlot(task.id, slotIndex, s1, s2);
              })} className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#6C63FF] text-white">Split Task</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function MenuButton({ icon, label, onClick, textStyle = {} }: { icon: React.ReactNode, label: string, onClick: () => void, textStyle?: React.CSSProperties }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="text-gray-500">{icon}</div>
      <span className="text-sm font-bold text-[#1A1A3E]" style={textStyle}>{label}</span>
    </button>
  );
}

function SquareButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="aspect-square flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="text-gray-500">{icon}</div>
      <span className="text-xs font-bold text-[#1A1A3E] text-center leading-tight">{label}</span>
    </button>
  );
}
