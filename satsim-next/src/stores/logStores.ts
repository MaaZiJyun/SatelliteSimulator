import { create } from 'zustand';

interface LogState {
    logs: string[];
    setLog: (logs: string[]) => void;
    addLog: (log: string) => void;
    reset: () => void;
}

export const useLogStore = create<LogState>((set) => ({
    logs: [],
    setLog: (logs) => set({ logs }),
    addLog: (log) =>
        set((state) => ({
            logs: [...state.logs, `${formatDate(new Date())} - ${log}`.toUpperCase()], // 在现有logs后添加新log
        })),
    reset: () => set({ logs: [] }),
}));

export function formatDate(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
        )} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
            date.getSeconds()
        )}`
    );
}