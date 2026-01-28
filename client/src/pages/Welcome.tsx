import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

import { 
  Button, 
  MaterialIcon, 
  LoadingSpinner, 
  SkeletonBox,
  Table, TableHeader, TableBody, TableRow, TableCell,
  Input,
  SearchInput,
  MultiSelect,
  Checkbox,
  Radio,
} from '../components/ui';

import Logo from '../assets/Logo MRF.png';

const Welcome = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Animation Refs
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
    <div className="min-h-screen bg-main-bg text-main-text transition-all duration-500 pb-32">
      
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-main-bg/80 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex gap-3 items-center">
              <img src={Logo} alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-black text-lg tracking-tighter uppercase italic">MRF Project Template</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <button onClick={toggleDarkMode} className="p-2 bg-surface border border-border rounded-xl hover:bg-main-bg transition-colors">
              <MaterialIcon iconName={darkMode ? 'light_mode' : 'dark_mode'} size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="max-w-7xl mx-auto pt-24 pb-20 px-6">
        <div ref={el => { revealRefs.current[0] = el as HTMLDivElement }} className="reveal-step space-y-6">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
            Full-Stack <br />
            <span className="text-primary">Excellence.</span>
          </h1>
          <p className="text-muted text-xl max-w-2xl font-medium italic opacity-60">
            A high-performance React-Laravel API project template designed for industrial-grade web applications with a robust custom design system.
          </p>
          <div className="flex gap-4 pt-4">
             <Link to="/login">
               <Button variant="primary" size="lg" iconName="rocket_launch" iconPosition="right">Get Started</Button>
             </Link>
             <Link to="/docs">
                <Button 
                  variant="outline" 
                  size="lg" 
                  isLoading={isBtnLoading} 
                  onClick={() => { setIsBtnLoading(true); setTimeout(() => setIsBtnLoading(false), 2000); }}>
                  Explore Docs
              </Button>
             </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-40">
        
        {/* --- SECTION 1: ARCHITECTURE --- */}
        <section ref={el => { revealRefs.current[1] = el as HTMLDivElement }} className="reveal-step space-y-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">01. Core Architecture</h2>
            <p className="text-muted text-sm font-medium italic">Synchronized frontend and backend technologies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface p-8 rounded-[2.5rem] border border-border space-y-4 shadow-main">
              <MaterialIcon iconName="code" className="text-primary" size={32} />
              <h3 className="font-black uppercase italic">React & TS</h3>
              <p className="text-sm text-muted">Strict TypeScript implementation for maximum reliability and developer experience.</p>
            </div>
            <div className="bg-surface p-8 rounded-[2.5rem] border border-border space-y-4 shadow-main">
              <MaterialIcon iconName="api" className="text-primary" size={32} />
              <h3 className="font-black uppercase italic">Laravel API</h3>
              <p className="text-sm text-muted">A robust backend powered by Laravel 12, utilizing Sanctum for secure authentication.</p>
            </div>
            <div className="bg-surface p-8 rounded-[2.5rem] border border-border space-y-4 shadow-main">
              <MaterialIcon iconName="bolt" className="text-primary" size={32} />
              <h3 className="font-black uppercase italic">Tailwind v4</h3>
              <p className="text-sm text-muted">Advanced styling using OKLCH color variables for seamless dark mode transitions.</p>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: BUILT-IN FEATURES --- */}
        <section ref={el => { revealRefs.current[2] = el as HTMLDivElement }} className="reveal-step space-y-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">02. Integrated Features</h2>
            <p className="text-muted text-sm font-medium italic">Everything you need to ship products faster.</p>
          </div>

          <div className="bg-surface p-10 rounded-[3rem] border border-border overflow-hidden">
             <Table>
                <TableHeader>
                   <TableRow>
                      <TableCell isHeader>Feature Module</TableCell>
                      <TableCell isHeader>Technology</TableCell>
                      <TableCell isHeader>Status</TableCell>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   <TableRow>
                      <TableCell className="font-bold italic uppercase">Authentication</TableCell>
                      <TableCell>Laravel Sanctum / Context API</TableCell>
                      <TableCell><span className="text-primary font-black italic">DEPLOYED</span></TableCell>
                   </TableRow>
                   <TableRow>
                      <TableCell className="font-bold italic uppercase">Real-Time Updates</TableCell>
                      <TableCell>Laravel Echo / Reverb</TableCell>
                      <TableCell><span className="text-primary font-black italic">CONNECTED</span></TableCell>
                   </TableRow>
                   <TableRow>
                      <TableCell className="font-bold italic uppercase">Theming System</TableCell>
                      <TableCell>OKLCH / CSS Variables</TableCell>
                      <TableCell><span className="text-primary font-black italic">ACTIVE</span></TableCell>
                   </TableRow>
                </TableBody>
             </Table>
          </div>
        </section>

        {/* --- SECTION 3: COMPONENT SHOWCASE --- */}
        <section ref={el => { revealRefs.current[3] = el as HTMLDivElement }} className="reveal-step space-y-12">
           <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">03. Component System</h2>
              <p className="text-muted text-sm font-medium italic">High-performance UI building blocks.</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-surface p-10 rounded-[3rem] border border-border space-y-8">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Dynamic States</p>
                 <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => setShowSkeleton(!showSkeleton)}>
                       {showSkeleton ? 'Show Content' : 'Reset Skeleton'}
                    </Button>
                    <LoadingSpinner variant="loop" size="sm" />
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
                    <div className="p-6 bg-main-bg border border-border rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                       <h4 className="font-black uppercase italic text-primary">Data Integrity Verified</h4>
                       <p className="text-sm text-muted italic">Components automatically inherit system-wide dark mode preferences.</p>
                    </div>
                 )}
              </div>

              <div className="bg-surface p-10 rounded-[3rem] border border-border space-y-8">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Infrastructure Inputs</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="System ID" iconName="fingerprint" placeholder="Enter key..." fullWidth />
                    <SearchInput suggestions={['Admin', 'User', 'Dev']} onSelect={() => {}} placeholder="Search Roles..." />
                 </div>
                 <MultiSelect 
                    label="Assigned Permissions" 
                    options={[{value: '1', label: 'Read'}, {value: '2', label: 'Write'}]} 
                    selectedValues={[]} 
                    onChange={() => {}} 
                 />
                 <div className="flex gap-6">
                    <Checkbox label="Auto-Sync" />
                    <Radio label="Protocol A" name="p"/>
                    <Radio label="Protocol B" name="p"/>
                 </div>
              </div>
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