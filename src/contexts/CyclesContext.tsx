import { createContext, useState } from "react";

interface createCycleData {
  task: string;
  minutesAmount: number;
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSeconsPassed: number;
  setSecondsPassed: (seconds: number) => void;
  markCurrentlyCycleAsFinished: () => void;
  createNewCycle: (data: createCycleData) => void;
  interruptCycle: () => void;
}

interface CyclesContextProviderProps {
  children: React.ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCyles] = useState<Cycle[]>([]);
  const [amountSeconsPassed, setAmountSeconsPassed] = useState(0);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function markCurrentlyCycleAsFinished() {
    setCyles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interruptedDate: new Date(),
          };
        } else {
          return cycle;
        }
      })
    );
  }

  function setSecondsPassed(seconds: number) {
    setAmountSeconsPassed(seconds);
  }

  function createNewCycle(data: createCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCyles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSeconsPassed(0);
  }

  function interruptCycle() {
    setCyles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interruptedDate: new Date(),
          };
        } else {
          return cycle;
        }
      })
    );

    setActiveCycleId(null);
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentlyCycleAsFinished,
        amountSeconsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
