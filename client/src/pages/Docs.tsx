import { useState, useEffect } from "react";
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { 
  MaterialIcon,
  Badge, 
  Button,
  Table, TableHeader, TableBody, TableRow, TableCell,
  LoadingSpinner,
  Image, 
  SkeletonBox,
} from "../components/ui";
import { 
  Input,
  PasswordInput, 
  Textarea, 
  Checkbox, 
  Radio, 
  FileUpload, 
  MultiSelect, 
  SearchInput,
  DatePicker,
  DateTimePicker,
} from "../components/ui/forms";
import { notify } from "../utils/notify";

import Logo from '../assets/Logo MRF.png';

const Docs = () => {
  // --- STATES FOR INTERACTIVE DOCUMENTATION ---
  const { darkMode, toggleDarkMode } = useTheme();
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [singleProgress, setSingleProgress] = useState(0);
  const [isSingleUploading, setIsSingleUploading] = useState(false);
  const [multiProgress, setMultiProgress] = useState(0);
  const [isMultiUploading, setIsMultiUploading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(true);

  //DATE PICKER EXAMPLE
  type RentalRange = {
    start: Date | null;
    end: Date | null;
  };

  const getDefaultRentalRange = (): RentalRange => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return {
      start: new Date(year, month, 1),
      end: new Date(year, month, 10),
    };
  };

  const [rental, setRental] = useState<RentalRange>(getDefaultRentalRange);

  const [birthDate, setBirthDate] = useState<Date | null>(
    new Date(2000, 9, 16)
  );

  //DATE TIME PICKER EXAMPLE
  const [appointment, setAppointment] = useState(new Date());

  // FILE UPLOAD EXAMPLE 
  const simulateUpload = (type: 'single' | 'multi') => {
    if (type === 'single') {
      setIsSingleUploading(true);
      setSingleProgress(0);
    } else {
      setIsMultiUploading(true);
      setMultiProgress(0);
    }
  };

  useEffect(() => {
    if (isSingleUploading && singleProgress < 100) {
      const timer = setTimeout(() => setSingleProgress(p => p + 10), 200);
      return () => clearTimeout(timer);
    } 
    else if (isSingleUploading && singleProgress === 100) {
      const timer = setTimeout(() => {
        setIsSingleUploading(false);
        notify.success("File synchronized.");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [singleProgress, isSingleUploading]);

  // --- MULTI UPLOAD LOGIC ---
  useEffect(() => {
    if (isMultiUploading && multiProgress < 100) {
      const timer = setTimeout(() => setMultiProgress(p => p + 5), 100);
      return () => clearTimeout(timer);
    } 
    else if (isMultiUploading && multiProgress === 100) {
      const timer = setTimeout(() => {
        setIsMultiUploading(false);
        notify.success("Batch assets uploaded.");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [multiProgress, isMultiUploading]);

  const UsageBlock = ({ code }: { code: string }) => (
    <pre className="bg-main-bg border border-border p-4 rounded-2xl overflow-x-auto text-xs font-mono italic text-main-text leading-relaxed">
      {code}
    </pre>
  );

  const content = (
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
      <div className="space-y-24 p-6 pb-40 animate-reveal">
        {/* --- 01. DESIGN SYSTEM --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <MaterialIcon iconName="palette" className="text-primary" size={40} />
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">01. Design System (App.css)</h2>
          </div>
          <div className="bg-surface p-8 rounded-[3rem] border border-border shadow-main space-y-6">
            <div className="space-y-2">
              <p className="text-main-text font-medium italic opacity-70">
                Branding is defined in <code>src/styles/App.css</code>. Use semantic classes to ensure automatic dark mode support:
              </p>
              <p className="text-xs text-muted italic">
                <strong>When to use:</strong> Use these classes when creating new custom components to maintain visual consistency across themes. Functional colors like <code>bg-surface</code> automatically swap between light and dark modes.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary text-main-bg rounded-2xl font-black uppercase text-center text-[10px]">bg-primary</div>
              <div className="p-4 bg-accent text-main-bg rounded-2xl font-black uppercase text-center text-[10px]">bg-accent</div>
              <div className="p-4 bg-surface text-main-text border border-border rounded-2xl font-black uppercase text-center text-[10px]">bg-surface</div>
              <div className="p-4 bg-main-bg text-main-text border border-border rounded-2xl font-black uppercase text-center text-[10px]">bg-main-bg</div>
              <div className="p-4 bg-main-text/20 text-main-text rounded-2xl font-black uppercase text-center text-[10px]">text-main-text</div>
              <div className="p-4 bg-muted/20 text-muted rounded-2xl font-black uppercase text-center text-[10px]">text-muted</div>
            </div>
          </div>
        </section>

        {/* --- 02. ACTION COMPONENTS --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <MaterialIcon iconName="smart_button" className="text-primary" size={40} />
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">02. Buttons & Icons</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-surface p-10 rounded-[3rem] border border-border space-y-8">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="outline" iconName="add">Icon Support</Button>
                  <Button variant="danger" isLoading={isBtnLoading} loadingType="loop" loadingText="Loading..." onClick={() => { setIsBtnLoading(true); setTimeout(() => setIsBtnLoading(false), 2000); }}>Loading Demo</Button>
                </div>
                <p className="text-xs text-muted italic pt-2">
                  <strong>When to use:</strong> Use <code>Button</code> for any user-triggered action, such as form submissions, navigation, or state toggles. Use <code>isLoading</code> to prevent double submissions during async operations.
                </p>
              </div>
              <UsageBlock code={`<Button\n\tvariant="primary"\n\ticonName="save"\n\tisLoading={false}\n\tloadingType="circle"\n\tloadingText="Loading..."\n>\n  Label\n</Button>`} />
            </div>
            <div className="bg-surface p-10 rounded-[3rem] border border-border space-y-8">
              <div className="space-y-2">
                <div className="flex gap-6 items-center">
                  <MaterialIcon iconName="bolt" type="rounded" size={40} />
                  <MaterialIcon iconName="settings" type="outlined" size={40} />
                </div>
                <p className="text-xs text-muted italic pt-2">
                  <strong>When to use:</strong> Use <code>MaterialIcon</code> to provide visual context to text or as standalone triggers. Supports multiple styles including rounded and outlined.
                </p>
              </div>
              <UsageBlock code={`<MaterialIcon\n\ticonName="bolt"\n\ttype="rounded"\n\tsize={40}\n/>`} />
            </div>
          </div>
        </section>

        {/* --- 03. FORM COMPONENTS --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <MaterialIcon iconName="edit_note" className="text-primary" size={40} />
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">03. Form Infrastructure</h2>
          </div>
          <div className="bg-surface p-10 rounded-[4rem] border border-border shadow-main space-y-16">
            
            {/* Inputs & Textarea */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Input & Textarea</h4>
                  <p className="text-xs text-muted italic">
                    <strong>When to use:</strong> Use <code>Input</code> for short, standardized data entry (email, names). Use <code>Textarea</code> for long-form content like descriptions or logs.
                  </p>
                </div>
                <Input label="Authentication" iconName="key" placeholder="Enter key..." fullWidth />
                <UsageBlock code={`<Input \n  label="Label" \n  iconName="lock" \n  placeholder="..." \n  error="Message" \n/>`} />
                <PasswordInput label="Password" placeholder="••••••••" iconName="lock" fullWidth/>
                <UsageBlock code={`\n<PasswordInput\n\tlabel="Password"\n\tplaceholder="••••••••"\n\ticonName="lock"\n/>`}/>
                <Textarea label="Notes" placeholder="Enter logs..." />
                <UsageBlock code={`<Textarea \n  label="Notes" \n  placeholder="..." \n/>`} />
                <hr/>
                <div className="flex flex-col gap-1">
                  <strong>Date Picker</strong>
                  <p>
                    The DatePicker is a lightweight control for selecting dates without a time element. It is ideal for birthdays, identity documents, or rental durations.
                    you can use the range mode to let customers select their rental "Check-in" and "Check-out" dates while automatically blocking past dates and specific holidays.
                  </p>
                  <div className="flex gap-3">
                    <DatePicker 
                      mode="range" 
                      label="Rental Duration" 
                      startDate={rental.start} 
                      endDate={rental.end} 
                      disablePastDates={true} 
                      disabledDates={[new Date(2026, 1, 14)]} 
                      onChange={(data) => setRental({ start: data.start ?? null, end: data.end ?? null })} 
                    />
                  </div>
                  <UsageBlock code={`Example:

import { 
  DatePicker,
} from "../components/ui/forms";


type RentalRange = {
  start: Date | null;
  end: Date | null;
};

const [rental, setRental] = useState<RentalRange>({
  start: new Date(2026, 0, 31),
  end: new Date(2026, 1, 10),
});

<DatePicker 
  mode="range" 
  label="Rental Duration" 
  startDate={rental.start} 
  endDate={rental.end} 
  disablePastDates={true} // Disabled All past dates
  disabledDates={[new Date(2026, 1, 14, 2026)]} // Disabled Selected Date (February 14)
  onChange={(data) => setRental({ start: data.start ?? null, end: data.end ?? null })} 
/> `} 
                  />
                  <p>
                    Use the single mode for static dates like birthdays.
                  </p>
                  <DatePicker 
                    mode="single" 
                    label="Date of Birth" 
                    selectedDate={birthDate} 
                    onChange={(data) => setBirthDate(data.date ?? null)} 
                  />
                  <UsageBlock code={`

import { 
  DatePicker,
} from "../components/ui/forms";

const [birthDate, setBirthDate] = useState(new Date());

<DatePicker 
  mode="single" 
  label="Date of Birth" 
  selectedDate={birthDate} 
  onChange={(data) => setBirthDate(data.date)} 
/> `} />
                </div>
                <hr/>
                <div className="flex flex-col gap-1">
                  <strong>Date Time Picker</strong>
                  <p>
                    Used for platforms that handle booking services at specific times. It allows certain time slots—such as lunch breaks to be disabled.
                  </p>
                  <div className="flex gap-3">
                    <DateTimePicker 
                      mode="single" 
                      label="Book Appointment" 
                      selectedDate={appointment} 
                      disabledTimes={[ { hour: '12', minute: '30', ampm: 'PM' }]} 
                      onChange={(data) => setAppointment(data.date)} 
                    />
                    <DateTimePicker 
                      mode="range"
                      label="Reservation" 
                      startDate={rental.start}   
                      endDate={rental.end}  
                      onChange={(data) => setRental({ start: data.start ?? null, end: data.end ?? null })}
                    />
                  </div>
                  <UsageBlock code={`Example:

import { 
  Date Time Picker,
} from "../components/ui/forms";
                  
const [appointment, setAppointment] = useState(new Date());

<DateTimePicker 
  mode="single" 
  label="Book Appointment" 
  selectedDate={appointment} 
  disabledTimes={[ { hour: '12', minute: '00', ampm: 'PM' }]} 
  onChange={(data) => setAppointment(data.date)} 
/> 

---------
import { 
  Date Time Picker,
} from "../components/ui/forms";

type RentalRange = {
  start: Date | null;
  end: Date | null;
};

const getDefaultRentalRange = (): RentalRange => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return {
    start: new Date(year, month, 1),
    end: new Date(year, month, 10),
  };
};

const [rental, setRental] = useState<RentalRange>(getDefaultRentalRange);

<DateTimePicker 
  mode="range"
  label="Reservation" 
  startDate={rental.start}   
  endDate={rental.end}
  onChange={(data) => setRental({ start: data.start ?? null, end: data.end ?? null })} 
/>
`} />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Selection Controls</h4>
                  <p className="text-xs text-muted italic">
                    <strong>When to use:</strong> Use <code>Checkbox</code> for multiple selections or binary toggles. Use <code>Radio</code> for single choices within a group. <code>MultiSelect</code> and <code>SearchInput</code> are best for picking items from large datasets.
                  </p>
                </div>
                <div className="flex gap-10">
                  <div className="space-y-4">
                    <Checkbox label="Active Mode" />
                    <Radio label="Option A" name="demo" />
                    <Radio label="Option B" name="demo" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <SearchInput suggestions={['React', 'Laravel']} onSelect={() => {}} placeholder="Search..." />
                    <MultiSelect label="Roles" options={[{value:'1', label:'Admin'}]} selectedValues={selectedRoles} onChange={setSelectedRoles} />
                  </div>
                </div>
                <UsageBlock code={`<Checkbox label="..." checked />\n<Radio label="..." name="..." />`} />
              </div>
            </div>

            {/* FILE UPLOAD SHOWCASE */}
            <div className="pt-12 border-t border-border/50 space-y-6">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary text-center italic">Asset Transfer System</h4>
                <p className="text-xs text-muted italic text-center max-w-xl mx-auto">
                  <strong>When to use:</strong> Use <code>FileUpload</code> for single profile assets or batch gallery uploads. It provides integrated progress feedback during synchronization.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <FileUpload label="Single Upload" onFileSelect={() => simulateUpload('single')} isUploading={isSingleUploading} progress={singleProgress} multiple={false} />
                  <UsageBlock code={`<FileUpload \n  multiple={false} \n  isUploading={true} \n  progress={45} \n/>`} />
                </div>
                <div className="space-y-4">
                  <FileUpload label="Batch Sync" onFileSelect={() => simulateUpload('multi')} isUploading={isMultiUploading} progress={multiProgress} multiple={true} />
                  <UsageBlock code={`<FileUpload \n  multiple={true} \n  onFileSelect={(files) => ...} \n/>`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 04. FEEDBACK SYSTEMS --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <MaterialIcon iconName="sync" className="text-primary" size={40} />
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">04. Feedback & Loading</h2>
          </div>
          <div className="bg-surface p-10 rounded-[3.5rem] border border-border shadow-main space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">LoadingSpinner Variants</h4>
                  <p className="text-xs text-muted italic">
                    <strong>When to use:</strong> Use <code>LoadingSpinner</code> during API calls or any asynchronous process where the user must wait. Supports various animation styles like <code>loop</code>, <code>dots</code>, and <code>wave</code>.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-10">
                  <LoadingSpinner variant="loop" size="sm" />
                  <LoadingSpinner variant="dots" size="sm" />
                  <LoadingSpinner variant="wave" size="sm" />
                  <LoadingSpinner variant="circle" size="sm" />
                  <LoadingSpinner variant="pulse-grid" size="sm" />
                  <LoadingSpinner variant="progress" size="sm" />
                </div>
                <UsageBlock code={`<LoadingSpinner \n  variant="loop" \n  size="md" \n  text="Loading..." \n/>`} />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">SkeletonBox</h4>
                    <Button size="sm" variant="outline" onClick={() => setShowSkeleton(!showSkeleton)}>Toggle state</Button>
                  </div>
                  <p className="text-xs text-muted italic">
                    <strong>When to use:</strong> Use <code>SkeletonBox</code> as a shimmering placeholder while content is still fetching to improve perceived performance and reduce layout shift.
                  </p>
                </div>
                {showSkeleton ? (
                  <div className="space-y-4">
                    <SkeletonBox height="h-14" rounded="rounded-3xl" />
                    <div className="flex gap-4">
                      <SkeletonBox width="w-14" height="h-14" rounded="rounded-full" />
                      <SkeletonBox className="flex-1" height="h-14" />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-main-bg border border-border rounded-3xl animate-in fade-in duration-500">
                    <p className="font-black uppercase italic text-primary">Assets Verified</p>
                  </div>
                )}
                <UsageBlock code={`<SkeletonBox \n  width="w-full" \n  height="h-4" \n  rounded="rounded-md" \n/>`} />
              </div>
            </div>
          </div>
        </section>

        {/* --- 05. DATA DISPLAY (TABLE) --- */}
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-6">
            <MaterialIcon iconName="analytics" className="text-primary" size={40} />
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">05. Data Infrastructure</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2 px-2">
              <p className="text-xs text-muted italic">
                <strong>When to use:</strong> Use the <code>Table</code> stack to display structured lists of records. <code>BreadCrumbs</code> are automatically generated based on your route definitions to provide easy navigation paths.
              </p>
            </div>
            <div className="bg-surface rounded-3xl border border-border shadow-main overflow-hidden mb-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader>Module</TableCell>
                    <TableCell isHeader>Value</TableCell>
                    <TableCell isHeader>Badge</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow onClick={() => {}}>
                    <TableCell className="font-bold uppercase italic">BreadCrumbs</TableCell>
                    <TableCell>Automatic</TableCell>
                    <TableCell>
                      <Badge variant="success">
                        Success
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow onClick={() => {}}>
                    <TableCell className="font-bold uppercase italic">Integrity</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>
                      <Badge variant="warning">
                        Warning
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <UsageBlock code={`<Table>\n  <TableHeader>\n    <TableRow>\n      <TableCell isHeader>...</TableCell>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow onClick={() => {}}>\n      <TableCell>...</TableCell>\n    </TableRow>\n  </TableBody>\n</Table>`} />
            <UsageBlock code={` import { Badge } from "../components/ui";\n// variants = 'brand' | 'alternative' | 'gray' | 'danger' | 'success' | 'warning'\n<Badge variant="brand">Verified</Badge>`} />
          </div>
        </section>
        
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-6">
            <MaterialIcon iconName="image" className="text-primary" size={40} />
            <h2 className="text-3xl font-black uppercase italic tracking-tighter max-h-">06. Image</h2>
          </div>
          <div className="space-y-6">
              <p>
                Use the aspect-video ratio for high-quality resort photos. The lazy loading ensures the page remains fast even with many images.
              </p>
              
                <Image src="./" alt="Image" aspectRatio="aspect-square" containerClassName="max-h-32 max-w-32"/>
              
              <UsageBlock code={` import { Image } from "../components/ui";\n<Image src="yoursource" alt="Image" aspectRatio="aspect-square" containerClassName="shadow-main" /> `} />
              <p>
                aspect-auto	- Original	Default; uses the image's natural dimensions.<br></br>
                aspect-square	- 1 / 1	Profile pictures, avatars, or grid thumbnails.<br></br>
                aspect-video - 16 / 9	Resort banners (Ivisan Getaways) or video placeholders.<br></br>
                aspect-[3/4] - 3 / 4	Portrait fashion photography (Gown Gallera catalog).<br></br>
                aspect-[4/3] -	4 / 3	Standard digital camera photos or blog post cards.<br></br>
                aspect-[21/9]	- 21 / 9	Ultra-wide cinematic banners for landing pages.
              </p>
          </div>
        </section>
      </div>
    </div>
  );

  return content;
};

export default Docs;