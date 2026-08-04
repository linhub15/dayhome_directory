import { createContext, useContext } from "react";

const DayhomeMapContext = createContext<{ thing: string } | null>(null);

function DayhomeMapProvider({ children }: { children: React.ReactNode }) {
  if (!children) {
    throw new Error("DayhomeMapProvider requires children");
  }

  return (
    <DayhomeMapContext.Provider value={{ thing: "value" }}>
      {children}
    </DayhomeMapContext.Provider>
  );
}

function useDayhomeMap() {
  const context = useContext(DayhomeMapContext);

  if (!context) {
    throw new Error("useDayhomeMap must be used within a DayhomeMapProvider");
  }

  return context;
}

export { DayhomeMapProvider, useDayhomeMap };
