import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { notify } from '../utils/notify';

import { 
  Button, 
  MaterialIcon, 
  LoadingSpinner, 
  SkeletonBox,
  Table, TableHeader, TableBody, TableRow, TableCell 
} from '../components/ui';

import Logo from '../assets/Logo MRF.png';

const Welcome = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  // Interactive States
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [spinnerVar, setSpinnerVar] = useState<'loop' | 'dots' | 'wave' | 'pulse-grid' | 'circle' | 'progress'>('loop');

  // Intersection Observer for Scroll Animations
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

  const UsageBlock = ({ title, code }: { title: string; code: string }) => (
    <div className="space-y-4 group">
      <div className="flex justify-between items-center px-2">
        <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">{title}</p>
        <button 
          onClick={() => { navigator.clipboard.writeText(code); notify.success("Copied!"); }}
          className="text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-all text-muted hover:text-primary"
        >
          Copy Code
        </button>
      </div>
      <pre className="bg-surface border border-border p-6 rounded-4xl overflow-x-auto">
        <code className="text-sm font-mono text-main-text italic leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-main-bg text-main-text transition-all duration-500 pb-32">
      
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-main-bg/80 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-black text-lg tracking-tighter uppercase italic">MRF Design System</span>
          </div>
          <button onClick={toggleDarkMode} className="p-3 bg-surface border border-border rounded-xl">
            <MaterialIcon iconName={darkMode ? 'light_mode' : 'dark_mode'} size={20} />
          </button>
        </div>
      </nav>

      {/* --- HERO --- */}
      <header className="max-w-7xl mx-auto pt-24 pb-20 px-6">
        <div ref={el => { revealRefs.current[0] = el as HTMLDivElement }} className="reveal-step space-y-6">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">
            Core <span className="text-primary">Components</span>
          </h1>
          <p className="text-muted text-xl max-w-2xl font-medium italic opacity-60">
            A high-performance library for industrial web applications. Built with React and Tailwind CSS.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-40">
        
        {/* --- 01. BUTTONS (FULL USAGE) --- */}
        <section ref={el => { revealRefs.current[1] = el as HTMLDivElement }} className="reveal-step space-y-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">01. Buttons</h2>
            <p className="text-muted text-sm font-medium italic">Comprehensive styles for every action.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-surface p-10 rounded-[3rem] border border-border space-y-10">
                {/* Variants Gallery */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Variants</p>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="danger">Danger</Button>
                    </div>
                </div>

                {/* Sizes Gallery */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Sizes</p>
                    <div className="flex items-end gap-3">
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                    </div>
                </div>

                {/* Interactive States */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">States & Icons</p>
                    <div className="flex flex-wrap gap-3">
                        <Button 
                            isLoading={isBtnLoading} 
                            onClick={() => { setIsBtnLoading(true); setTimeout(() => setIsBtnLoading(false), 2000); }}
                        >
                            Click to Load
                        </Button>
                        <Button iconName="send">Icon Left</Button>
                        <Button iconName="arrow_forward" iconPosition="right">Icon Right</Button>
                        <Button disabled iconName="lock">Disabled</Button>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <UsageBlock title="Basic Implementation" code={`<Button variant="primary" size="md">\n  Standard Button\n</Button>`} />
                <UsageBlock title="Icons & Loading" code={`<Button \n  variant="outline" \n  iconName="bolt" \n  iconPosition="right" \n  isLoading={true}\n>\n  Processing\n</Button>`} />
            </div>
          </div>
        </section>

        {/* --- 02. SPINNERS (LOGO & VARIANTS) --- */}
        <section ref={el => { revealRefs.current[2] = el as HTMLDivElement }} className="reveal-step space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">02. Loading Spinners</h2>
                <p className="text-muted text-sm font-medium italic">Showcasing Logo integration and motion variants.</p>
            </div>
            <div className="flex bg-surface p-1.5 rounded-xl border border-border gap-1 overflow-x-auto">
                {(['loop', 'dots', 'wave', 'circle', 'progress', 'pulse-grid'] as const).map(v => (
                    <button 
                      key={v} 
                      onClick={() => setSpinnerVar(v)} 
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap ${spinnerVar === v ? 'bg-primary text-main-bg' : 'opacity-40 hover:opacity-100'}`}
                    >
                      {v}
                    </button>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-surface aspect-video rounded-[3rem] border border-border flex flex-col items-center justify-center relative group">
                {/* Showcase Logo Property vs Variant */}
                <LoadingSpinner 
                    variant={spinnerVar} 
                    size="lg" 
                    logo={Logo} 
                    text={`System ${spinnerVar}`} 
                    color="primary"
                />
                
                {/* Branding note */}
                <div className="absolute bottom-6 text-[9px] font-bold opacity-30 uppercase tracking-[0.3em]">
                    Branded Component Ready
                </div>
            </div>
            
            <div className="space-y-6">
                <UsageBlock title="Logo Integration" code={`<LoadingSpinner \n  variant="${spinnerVar}" \n  logo={LogoAsset} \n  text="Loading Mainframe..." \n  size="lg" \n/>`} />
                <UsageBlock title="Button Loading logic" code={`{/* Spinner size automatically adjusts to Button size */}\n<Button isLoading={true}> \n  Saving Changes \n</Button>`} />
            </div>
          </div>
        </section>

        {/* --- 03. TABLES & SKELETONS --- */}
        <section ref={el => { revealRefs.current[3] = el as HTMLDivElement }} className="reveal-step grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">03. Content States</h2>
            <div className="bg-surface rounded-3xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader>Attribute</TableCell>
                            <TableCell isHeader>Value</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-bold text-primary italic uppercase">Logo Support</TableCell>
                            <TableCell>Prop-based</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-bold text-primary italic uppercase">Typescript</TableCell>
                            <TableCell>Strict</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
          </div>

          <div className="bg-surface p-10 rounded-[3rem] border border-border min-h-75 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Skeleton Placeholder</p>
                <Button size="sm" variant="outline" onClick={() => setShowSkeleton(!showSkeleton)}>Toggle State</Button>
            </div>
            {showSkeleton ? (
                <div className="space-y-4">
                    <SkeletonBox width="w-20" height="h-20" rounded="rounded-2xl" />
                    <SkeletonBox width="w-full" height="h-4" />
                    <SkeletonBox width="w-2/3" height="h-4" />
                </div>
            ) : (
                <div className="animate-in fade-in duration-500 flex items-center gap-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <MaterialIcon iconName="check_circle" className="text-primary" size={40} />
                    </div>
                    <div>
                        <h4 className="font-black uppercase italic">Assets Loaded</h4>
                        <p className="text-sm text-muted italic">Infrastructure ready.</p>
                    </div>
                </div>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-40 pt-20 border-t border-border text-center">
        <p className="text-primary text-[10px] font-black tracking-[1em] uppercase">MRF Core • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Welcome;