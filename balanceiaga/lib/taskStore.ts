import { create } from 'zustand';
import { Task, mockTasks, ScheduledSlot } from './mockData';

interface TaskState {
  tasks: Task[];
  pastStates: Task[][]; // For Undo
  
  // Actions
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateSlot: (taskId: string, slotIndex: number, newSlot: ScheduledSlot) => void;
  moveSlot: (taskId: string, slotIndex: number, newDate: string, newStartTime: string, newEndTime: string) => void;
  splitSlot: (taskId: string, slotIndex: number, slot1: ScheduledSlot, slot2: ScheduledSlot) => void;
  duplicateTask: (taskId: string, newDate: string) => void;
  deleteTask: (taskId: string) => void;
  undo: () => void;
  saveState: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: mockTasks,
  pastStates: [],

  saveState: () => {
    set((state) => ({
      pastStates: [...state.pastStates, JSON.parse(JSON.stringify(state.tasks))],
    }));
  },

  updateTask: (taskId, updates) => {
    get().saveState();
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
  },

  updateSlot: (taskId, slotIndex, newSlot) => {
    get().saveState();
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        const newSlots = [...task.scheduledSlots];
        newSlots[slotIndex] = newSlot;
        return { ...task, scheduledSlots: newSlots };
      }),
    }));
  },

  moveSlot: (taskId, slotIndex, newDate, newStartTime, newEndTime) => {
    get().saveState();
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        const newSlots = [...task.scheduledSlots];
        newSlots[slotIndex] = {
          ...newSlots[slotIndex],
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
        };
        return { ...task, scheduledSlots: newSlots };
      }),
    }));
  },

  splitSlot: (taskId, slotIndex, slot1, slot2) => {
    get().saveState();
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        const newSlots = [...task.scheduledSlots];
        newSlots.splice(slotIndex, 1, slot1, slot2);
        return { ...task, scheduledSlots: newSlots };
      }),
    }));
  },

  duplicateTask: (taskId, newDate) => {
    get().saveState();
    set((state) => {
      const taskToDuplicate = state.tasks.find((t) => t.id === taskId);
      if (!taskToDuplicate) return state;

      const newTask = JSON.parse(JSON.stringify(taskToDuplicate)) as Task;
      newTask.id = `${taskId}-copy-${Date.now()}`;
      
      // Duplicate all slots to the new date as a basic approach
      newTask.scheduledSlots = newTask.scheduledSlots.map(s => ({
        ...s,
        date: newDate
      }));

      return { tasks: [...state.tasks, newTask] };
    });
  },

  deleteTask: (taskId) => {
    get().saveState();
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));
  },

  undo: () => {
    set((state) => {
      if (state.pastStates.length === 0) return state;
      const previousState = state.pastStates[state.pastStates.length - 1];
      return {
        tasks: previousState,
        pastStates: state.pastStates.slice(0, -1),
      };
    });
  },
}));
