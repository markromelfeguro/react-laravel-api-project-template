import { useState, useEffect } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import AxiosInstance from "../../api/AxiosInstance";
import { Button, Input, Switch, MaterialIcon, SkeletonBox } from "../../components/ui";
import { notify } from "../../utils/notify";
import { useAuth } from "../../features/auth";

const SystemConfig = () => {
  const {setSiteName} = useAuth();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const BASE_PREFIX = 'system-configs';

  useEffect(() => {
    AxiosInstance.get(`${BASE_PREFIX}`).then(res => {
      setSettings(res.data.data);
      setLoading(false);
    });
  }, []);

  const handleUpdateValue = (key: string, newValue: any) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value: String(newValue) } : s));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      await AxiosInstance.post(`${BASE_PREFIX}/update`, { settings });
      const newSiteName = settings.find(s => s.key === 'site_name')?.value;

      if (newSiteName) {
        setSiteName(newSiteName);
      }

      notify.success("System Protocols Synchronized");
    } finally {
      setIsSaving(false);
    }
  };

  const content = (
    <div className="space-y-10 animate-reveal">
      <header className="flex items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-3xl border border-primary/20 shadow-main">
          <MaterialIcon iconName="settings_input_component" className="text-primary" size={32} />
        </div>
        <div>
          <h1 className="text-4xl text-primary font-black uppercase italic tracking-tighter">System Protocols</h1>
          <p className="text-muted text-sm font-medium italic opacity-60">Global environment variables.</p>
        </div>
      </header>

      <div className="bg-surface p-10 rounded-[3.5rem] border border-border shadow-main">
        {loading ? <SkeletonBox height="h-64" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {settings.map((config) => (
              <div key={config.id}>
                {config.type === 'boolean' ? (
                  <Switch 
                    label={config.key.replace(/_/g, ' ')}
                    checked={config.value === 'true'}
                    onChange={(val) => handleUpdateValue(config.key, val)}
                  />
                ) : (
                  <Input 
                    label={config.key.replace(/_/g, ' ').toUpperCase()}
                    value={config.value}
                    onChange={(e) => handleUpdateValue(config.key, e.target.value)}
                    fullWidth 
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-10">
          <Button variant="primary" size="lg" iconName="sync" isLoading={isSaving} onClick={saveChanges}>Apply Configs</Button>
        </div>
      </div>
    </div>
  );

  return <MainLayout content={content} />;
};

export default SystemConfig;