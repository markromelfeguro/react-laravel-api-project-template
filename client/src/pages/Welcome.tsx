import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

import { 
  Button, 
  MaterialIcon, 
  FontSizeControl, 
  SkeletonBox,
  Table, TableHeader, TableBody, TableRow, TableCell,
  Input,
  SearchInput,
  Checkbox,
  Radio,
} from '../components/ui';

import Logo from '../assets/Logo MRF.png';

const Welcome = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [textSize, setTextSize] = useState(16);

  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('reveal-visible');
      });
    }, { threshold: 0.1 });
    revealRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="min-h-screen bg-main-bg text-main-text transition-colors duration-500 pb-32 selection:bg-primary selection:text-white" 
      style={{ fontSize: `${textSize}px` }}
    >
      
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-main-bg/80 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex gap-3 items-center group">
              <img src={Logo} alt="Logo" className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform" />
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter uppercase italic leading-none">MRF</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Starter Kit</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <FontSizeControl value={textSize} onChange={setTextSize} />
            <Button 
              variant='ghost' 
              onClick={toggleDarkMode}
              className="hover:bg-surface border border-transparent hover:border-border"
            >
              <MaterialIcon iconName={darkMode ? 'light_mode' : 'dark_mode'} size={20} className="text-primary" />
            </Button>
            <Link to="/login">
              <Button variant="primary" size="sm" className="font-black italic uppercase">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <header className="max-w-7xl mx-auto pt-32 pb-24 px-6">
        <div ref={el => { revealRefs.current[0] = el as HTMLDivElement }} className="reveal-step space-y-8">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85]">
            Industrial <br />
            <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--color-primary),0.3)]">Logic.</span>
          </h1>
          <p className="text-muted text-xl max-w-3xl font-medium italic opacity-70 leading-relaxed">
            A high-performance boilerplate leveraging <span className="text-main-text border-b-2 border-primary/30">Laravel 12 & React</span>. 
            Designed for Capstone excellence and rapid prototyping.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <Link to="/login">
               <Button variant="primary" size="lg" className="h-16 px-10 shadow-lg shadow-primary/20">Launch Console</Button>
             </Link>
             <div className="bg-surface border border-border rounded-2xl flex items-center px-6 font-mono text-sm">
                <span className="text-primary mr-3">❯</span>
                <code className="opacity-80">git clone https://github.com/markromelfeguro/react-laravel-api-project-template.git</code>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-48">
        
        <section ref={el => { revealRefs.current[1] = el as HTMLDivElement }} className="reveal-step">
          <div className="bg-surface border border-border rounded-[3rem] p-12 shadow-2xl overflow-hidden relative group">
            
             <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-colors duration-700"></div>
             
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                   <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Core Engine</div>
                   <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-tight">Theme-Aware <br/>Components</h2>
                   <p className="text-muted italic leading-relaxed">Every UI element—from buttons to deep-nested tables—is synchronized with your <code>App.css</code> variables. Zero flickering during mode transitions.</p>
                </div>

                <div className="space-y-6 bg-main-bg/50 p-8 rounded-4xl border border-border">
                   <Table>
                      <TableHeader>
                         <TableRow>
                            <TableCell isHeader>Module</TableCell>
                            <TableCell isHeader>Status</TableCell>
                         </TableRow>
                      </TableHeader>
                      <TableBody>
                         <TableRow>
                            <TableCell className="font-bold uppercase italic">Dark Mode</TableCell>
                            <TableCell><span className="text-primary font-black italic">SYNCED</span></TableCell>
                         </TableRow>
                         <TableRow>
                            <TableCell className="font-bold uppercase italic">OKLCH Colors</TableCell>
                            <TableCell><span className="text-primary font-black italic">ACTIVE</span></TableCell>
                         </TableRow>
                      </TableBody>
                   </Table>
                </div>
             </div>
          </div>
        </section>

        {/* --- SECTION 2: INPUT PLAYGROUND --- */}
        <section ref={el => { revealRefs.current[2] = el as HTMLDivElement }} className="reveal-step space-y-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-surface p-12 rounded-[3rem] border border-border space-y-8">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black uppercase italic">Skeleton States</h3>
                    <Button variant="outline" size="sm" onClick={() => setShowSkeleton(!showSkeleton)}>Toggle</Button>
                 </div>
                 {showSkeleton ? (
                    <div className="space-y-4">
                       <SkeletonBox height="h-12" rounded="rounded-2xl" />
                       <div className="flex gap-4">
                          <SkeletonBox width="w-12" height="h-12" rounded="rounded-full" />
                          <SkeletonBox className="flex-1" height="h-12" />
                       </div>
                    </div>
                 ) : (
                    <div className="p-10 bg-main-bg border-2 border-dashed border-border rounded-3xl flex flex-col items-center text-center animate-in fade-in zoom-in-95">
                       <MaterialIcon iconName="auto_awesome" className="text-primary mb-2" size={32} />
                       <p className="font-bold uppercase italic">Ready for Data</p>
                    </div>
                 )}
              </div>

              <div className="bg-surface p-12 rounded-[3rem] border border-border space-y-8">
                 <h3 className="text-2xl font-black uppercase italic">Form Primitives</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="System Key" iconName="key" placeholder="MRF-001" fullWidth />
                    <SearchInput 
                      suggestions={['Admin', 'Student', 'Faculty']} 
                      placeholder="Access Level..." 
                      onSelect={(val) => console.log(val)}
                    />
                 </div>
                 <div className="flex gap-8 items-center p-6 bg-main-bg/40 rounded-2xl border border-border">
                    <Checkbox label="Auto-Deploy" />
                    <div className="flex gap-4">
                       <Radio label="v1" name="ver" checked />
                       <Radio label="v2" name="ver" />
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <footer className="mt-48 pt-20 border-t border-border text-center">
        <p className="text-primary text-[10px] font-black tracking-[1em] uppercase">MRF CORE • {new Date().getFullYear()}</p>
        <p className="text-muted text-[10px] font-bold uppercase mt-4 opacity-40">Filamer Christian University, Inc. - College of Computer Studies</p>
      </footer>
    </div>
  );
};

export default Welcome;