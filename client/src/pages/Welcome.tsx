import { useState, useEffect, useRef } from 'react';
import { Reorder, AnimatePresence } from "framer-motion";
import { useTheme } from '../context/ThemeContext';
import { notify } from '../utils/notify';

import { 
  Button, 
  MaterialIcon, 
  LoadingSpinner, 
  SkeletonBox,
  Table, TableHeader, TableBody, TableRow, TableCell,
  Input,
  Textarea,
  SearchInput,
  MultiSelect,
  Checkbox,
  Radio,
  FileUpload
} from '../components/ui';

import Logo from '../assets/Logo MRF.png';

const Welcome = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  // Interactive States
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [spinnerVar, setSpinnerVar] = useState<'loop' | 'dots' | 'wave' | 'pulse-grid' | 'circle' | 'progress'>('loop');

  // --- FORM STATES ---
  const [searchSelection, setSearchSelection] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [radioVal, setRadioVal] = useState('standard');

  const mockSuggestions = ['Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'Astro', 'ERPNext', 'Ubuntu'];
  const multiOptions = [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Apps' },
    { value: 'desktop', label: 'Desktop Software' },
    { value: 'iot', label: 'IoT Systems' }
  ];

  // --- INDEPENDENT UPLOAD STATES ---
const [singleProgress, setSingleProgress] = useState(0);
const [isSingleUploading, setIsSingleUploading] = useState(false);

const [stagedFiles, setStagedFiles] = useState<File[]>([]);
const [multiProgress, setMultiProgress] = useState(0);
const [isMultiUploading, setIsMultiUploading] = useState(false);

// Handler for Single Upload
const handleSingleUpload = (files: File[]) => {
  setIsSingleUploading(true);
  setSingleProgress(0);
  notify.info(`Uploading: ${files[0].name}`); // Focus on the specific file

  const interval = setInterval(() => {
    setSingleProgress(prev => {
      if (prev >= 100) { clearInterval(interval); return 100; }
      return prev + 10;
    });
  }, 300);
};

  // Handler for Multiple Upload
  const handleMultiUpload = (newFiles: File[]) => {
    setStagedFiles((prev) => [...prev, ...newFiles]);
    notify.info(`${newFiles.length} assets staged for transfer.`);
  };

  const removeFile = (indexToRemove: number) => {
    setStagedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleReorder = (newOrder: File[]) => {
    setStagedFiles(newOrder);
  };

  const startGlobalSync = () => {
    if (stagedFiles.length === 0) return;
    setIsMultiUploading(true);
    setMultiProgress(0);

    const interval = setInterval(() => {
      setMultiProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  useEffect(() => {
    if (singleProgress === 100 && isSingleUploading) {
      setIsSingleUploading(false);
      notify.success("Document Uploaded Successfully");
    }
  }, [singleProgress, isSingleUploading]);

  useEffect(() => {
    if (multiProgress === 100 && isMultiUploading) {
      setIsMultiUploading(false);
      notify.success("Infrastructure Synchronized");
    }
  }, [multiProgress, isMultiUploading]);
  

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

        {/* --- 02. FORMS & INPUTS --- */}
        <section ref={el => { revealRefs.current[4] = el as HTMLDivElement }} className="reveal-step space-y-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">02. Forms & Inputs</h2>
            <p className="text-muted text-sm font-medium italic">High-contrast data entry components.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-surface p-10 rounded-[3rem] border border-border space-y-8">
              {/* Text Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Username" placeholder="e.g. markromelf" iconName="person" fullWidth />
                <Input label="Password" type="password" placeholder="••••••••" iconName="lock" fullWidth />
              </div>
              
              {/* Advanced Smart Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary italic">Search Suggestion (Input)</p>
                  <SearchInput 
                    label="Search Tech Stack" 
                    suggestions={mockSuggestions} 
                    onSelect={(v) => { setSearchSelection(v); notify.info(`Selected: ${v}`); }} 
                    placeholder="Type to search..."
                  />
                  {searchSelection && <p className="text-[10px] font-mono opacity-50 uppercase">Active: {searchSelection}</p>}
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary italic">Multi-Select Dropdown</p>
                  <MultiSelect 
                    label="Project Categories"
                    options={multiOptions}
                    selectedValues={selectedOptions}
                    onChange={setSelectedOptions}
                  />
                  <div className="flex flex-wrap gap-1">
                    {selectedOptions.map(v => (
                      <span key={v} className="px-2 py-0.5 bg-primary/10 rounded text-[9px] font-bold text-primary uppercase">{v}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selection Controls */}
              <div className="flex flex-wrap gap-10 py-4 border-y border-border/50">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Checkboxes</p>
                  <Checkbox label="Remember Me" defaultChecked />
                  <Checkbox label="Accept Terms" />
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Radio Group</p>
                  <div className="flex flex-col gap-3">
                    <Radio label="Standard Mode" name="mode" checked={radioVal === 'standard'} onChange={() => setRadioVal('standard')} />
                    <Radio label="Developer Mode" name="mode" checked={radioVal === 'dev'} onChange={() => setRadioVal('dev')} />
                  </div>
                </div>
              </div>

              <Textarea label="Project Description" placeholder="Describe requirements..." />
            </div>

            <div className="space-y-6">
              <UsageBlock title="Search Suggestion" code={`<SearchInput \n  label="Search..."\n  suggestions={['React', 'Laravel']}\n  onSelect={(val) => handleSelect(val)}\n/>`} />
              <UsageBlock title="Multi-Select Dropdown" code={`<MultiSelect \n  label="Categories"\n  options={optionsArray}\n  selectedValues={selectedArray}\n  onChange={setSelectedArray}\n/>`} />
              <UsageBlock title="Input with Icon" code={`<Input \n  label="Email Address"\n  iconName="mail"\n  placeholder="user@mrf.dev"\n/>`} />
            </div>
          </div>
        </section>

        {/* --- 03. INFRASTRUCTURE & UPLOADS --- */}
        <section ref={el => { revealRefs.current[5] = el as HTMLDivElement }} className="reveal-step space-y-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">03. Infrastructure</h2>
            <p className="text-muted text-sm font-medium italic">Asset management and loading patterns.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LIVE DEMOS */}
            <div className="space-y-6">
              <div className="bg-surface p-8 rounded-[3rem] border border-border flex flex-col gap-6">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">01. Single File Mode</p>
                <FileUpload 
                  label="Profile Document" 
                  accept=".pdf,.doc,.docx"
                  onFileSelect={(files) => {
                    handleSingleUpload(files);
                    notify.info("Single file received.");
                  }}
                  isUploading={isSingleUploading}
                  progress={singleProgress}
                  multiple={false}
                />
              </div>

              <div className="bg-surface p-8 rounded-[3rem] border border-border flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">02. Multiple Files Mode</p>
                    <p className="text-[9px] italic opacity-30 uppercase">Drag items to prioritize</p>
                  </div>
                  
                  {/* Sync Button: Only appears when assets are ready */}
                  <AnimatePresence>
                    {stagedFiles.length > 0 && !isMultiUploading && (
                      <button 
                        onClick={startGlobalSync}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.15em] transition-all"
                      >
                        Sync {stagedFiles.length} Assets →
                      </button>
                    )}
                  </AnimatePresence>
                </div>

                <FileUpload 
                  label="Project Gallery Assets" 
                  accept="image/*"
                  onFileSelect={handleMultiUpload}
                  isUploading={isMultiUploading}
                  progress={multiProgress}
                  multiple={true}
                />

                {/* DRAGGABLE FILE LIST */}
                <Reorder.Group 
                  axis="y" 
                  values={stagedFiles} 
                  onReorder={handleReorder}
                  className="flex flex-col gap-2 max-h-105 overflow-y-auto pr-2 custom-scrollbar"
                >
                  <AnimatePresence>
                    {stagedFiles.map((file, idx) => (
                      <Reorder.Item 
                        key={`${file.name}-${file.lastModified}`} // Stable unique key
                        value={file}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group flex items-center gap-4 p-3 bg-background/40 border border-border/50 rounded-2xl cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors"
                      >
                        {/* Drag Indicator Icon */}
                        <div className="text-muted/20 group-hover:text-primary/40 transition-colors">
                          <MaterialIcon iconName="drag_indicator" size={20} />
                        </div>

                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-xl bg-surface border border-border overflow-hidden shrink-0 pointer-events-none">
                          {file.type.startsWith('image/') ? (
                            <img 
                              src={URL.createObjectURL(file)} 
                              className="w-full h-full object-cover"
                              onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MaterialIcon iconName="description" size={20} />
                            </div>
                          )}
                        </div>

                        {/* Meta */}
                        <div className="flex-1 min-w-0 pointer-events-none">
                          <p className="text-[11px] font-bold uppercase truncate tracking-tighter">{file.name}</p>
                          <p className="text-[9px] opacity-40 font-mono tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>

                        {/* Actions */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="p-2 opacity-0 group-hover:opacity-100 text-muted hover:text-error transition-all"
                        >
                          <MaterialIcon iconName="delete_outline" size={20} />
                        </button>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              </div>
            </div>

            {/* USAGE DOCUMENTATION */}
            <div className="space-y-6">
              <UsageBlock 
                title="Single Upload Usage" 
                code={`<FileUpload \n  label="User Avatar"\n  multiple={false} \n  onFileSelect={(files) => handleUpload(files[0])}\n/>`} 
              />
              
              <UsageBlock 
                title="Multiple Upload Usage" 
                code={`<FileUpload \n  label="Gallery Upload"\n  multiple={true} \n  onFileSelect={(files) => handleBatch(files)}\n/>`} 
              />

              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <MaterialIcon iconName="info" size={18} />
                  <p className="text-xs font-black uppercase tracking-widest">Implementation Note</p>
                </div>
                <p className="text-xs italic text-primary/70 leading-relaxed">
                  The <code>onFileSelect</code> callback always returns a <code>File[]</code> array. For single mode, simply access the first element: <code>files[0]</code>. The progress bar animation is automatically handled via the <code>animate-progress</code> keyframes in your <code>App.css</code>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 04. SPINNERS (LOGO & VARIANTS) --- */}
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

        {/* --- 05. TABLES & SKELETONS --- */}
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