import { useState, useEffect } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { 
  MaterialIcon, 
  Button, 
  Table, TableHeader, TableBody, TableRow, TableCell,
  SkeletonBox,
} from "../../components/ui";
import { notify } from "../../utils/notify";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: "Active Nodes", value: "12", icon: "hub", color: "text-primary" },
    { label: "Storage Capacity", value: "84%", icon: "storage", color: "text-blue-500" },
    { label: "System Uptime", value: "99.9%", icon: "sensors", color: "text-green-500" },
    { label: "Pending Tasks", value: "05", icon: "pending_actions", color: "text-yellow-500" },
  ];

  const content = (
    <div className="space-y-12 pb-20 animate-reveal">
      {/* --- HEADER SECTION --- */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Command Center</h1>
          <p className="text-muted text-sm font-medium italic opacity-60">
            System overview and real-time infrastructure metrics.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" iconName="refresh" onClick={() => notify.success("Data Refreshed")}>Sync</Button>
          <Button variant="primary" iconName="add_chart">Generate Report</Button>
        </div>
      </header>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-surface p-6 rounded-[2.5rem] border border-border shadow-main hover:border-primary/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-main-bg rounded-2xl group-hover:scale-110 transition-transform`}>
                <MaterialIcon iconName={stat.icon} className={stat.color} size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Live</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">{stat.label}</p>
            <h3 className="text-3xl text-primary font-black italic tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* RECENT ACTIVITY TABLE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Recent Infrastructure Logs</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</button>
          </div>
          
          <div className="bg-surface rounded-[2.5rem] border border-border shadow-main overflow-hidden">
            {isLoading ? (
              <div className="p-10 space-y-4">
                <SkeletonBox height="h-10" />
                <SkeletonBox height="h-10" />
                <SkeletonBox height="h-10" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader>Resource</TableCell>
                    <TableCell isHeader>Status</TableCell>
                    <TableCell isHeader>Timestamp</TableCell>
                    <TableCell isHeader className="text-right">Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Database Cluster A", status: "Operational", time: "2 mins ago" },
                    { name: "Frontend Assets", status: "Synchronizing", time: "15 mins ago" },
                    { name: "Auth Service", status: "Operational", time: "1 hour ago" },
                  ].map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-bold italic uppercase">{row.name}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${row.status === 'Operational' ? 'bg-green-500' : 'bg-primary animate-pulse'}`} />
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted italic text-xs">{row.time}</TableCell>
                      <TableCell className="text-right">
                        <button className="p-2 hover:bg-main-bg rounded-xl text-muted hover:text-primary transition-all">
                          <MaterialIcon iconName="more_vert" size={20} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* SYSTEM STATUS / QUICK ACTIONS */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-surface p-8 rounded-[3rem] border border-border shadow-main space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">System Integrity</h3>
            
            <div className="space-y-6">
              {[
                { label: "CPU Usage", value: 45 },
                { label: "Memory Sync", value: 72 },
                { label: "Network IO", value: 28 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase italic">
                    <span>{item.label}</span>
                    <span className="text-primary">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-main-bg rounded-full overflow-hidden border border-border/50">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out" 
                      style={{ width: isLoading ? '0%' : `${item.value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-border/50">
              <Button variant="outline" fullWidth iconName="terminal" size="sm">Open System Console</Button>
            </div>
          </section>

          {/* QUICK NOTIFICATION PREVIEW */}
          <div className="bg-primary p-8 rounded-[3rem] text-main-bg shadow-main space-y-4">
             <div className="flex items-center gap-3">
                <MaterialIcon iconName="security" size={24} />
                <h4 className="font-black uppercase italic tracking-tighter">Security Alert</h4>
             </div>
             <p className="text-xs font-bold italic opacity-90">3 failed login attempts detected from unauthorized IP. Review logs immediately.</p>
             <button className="text-[10px] font-black uppercase tracking-widest bg-main-bg text-primary px-4 py-2 rounded-xl">Review</button>
          </div>
        </div>

      </div>
    </div>
  );

  return <MainLayout content={content} />;
};

export default Dashboard;