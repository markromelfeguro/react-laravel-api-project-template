import { MaterialIcon } from "../components/ui";

const Maintenance = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-main-bg text-center p-6 select-none">
      <div className="p-8 bg-primary/10 rounded-full mb-8 animate-pulse border border-primary/20 shadow-main">
        <MaterialIcon iconName="construction" size={80} className="text-primary" />
      </div>
      
      <h1 className="text-6xl font-black uppercase italic tracking-tighter text-primary leading-none">
        System Offline
      </h1>
      
      <div className="mt-6 space-y-2">
        <p className="text-xl font-bold italic text-main-text uppercase tracking-widest">
          Maintenance Protocol Active
        </p>
        <p className="max-w-md mx-auto text-muted font-medium italic opacity-70">
          The infrastructure is currently undergoing scheduled upgrades. 
          Access is temporarily restricted to Level 1 Admin personnel.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-border w-full max-w-xs">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted opacity-40">
          Ref: INFRA-LOG-2026-X
        </p>
      </div>
    </div>
  );
};

export default Maintenance;