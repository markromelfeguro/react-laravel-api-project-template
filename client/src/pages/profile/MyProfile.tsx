import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layouts/MainLayout";
import { useAuth } from "../../features/auth/context/AuthContext";
import UserService from "../../features/users/api/UserService";
import { notify } from "../../utils/notify";
import { 
  MaterialIcon, 
  Button, 
  Input,
  CustomPhoneInput,
  Textarea, 
  FileUpload,
  Modal,
} from "../../components/ui";
import MyProfileSkeleton from "./components/MyProfileSkeleton";

const MyProfile = () => {
  const { user, logout, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // --- UI STATES ---
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    avatar: null as File | null
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.profile?.bio || "",
        phone: user.profile?.phone || "",
        avatar: null
      });
    }
  }, [user]);

  if (loading) {
    return <MyProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  // --- ACTIONS ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrors({});
    setUploadProgress(0);

    try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('bio', formData.bio || "");
        data.append('phone', formData.phone || "");
        
        data.append('_method', 'PUT');

        if (formData.avatar) {
            data.append('avatar', formData.avatar);
        }

        const response = await UserService.update(
            user.id.toString(), 
            data, 
            (percent) => setUploadProgress(percent)
        );
        updateUser(response.data);
        notify.success(response.message);
        setUploadProgress(0);
    } catch (error: any) {
        if (error.response?.status === 422) {
            setErrors(error.response.data.errors);
        }
    } finally {
      setIsUpdating(false);
    }
  };

  const executeDeletion = async () => {
    setIsDeleting(true);
    try {
      await UserService.delete(user.id.toString());
      notify.success("Account permanently purged.");
      logout();
      navigate("/");
    } catch (error) {
       console.error(`Decommissioning Error: ${error}`);
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  
  const content = (
    <div className="space-y-12 pb-20 animate-reveal">
      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-3xl border border-primary/20 shadow-main">
          <MaterialIcon iconName="account_circle" className="text-primary" size={32} />
        </div>
        <div>
          <h1 className="text-4xl text-primary font-black uppercase italic tracking-tighter">User Information</h1>
          <p className="text-muted text-sm font-medium italic opacity-60">Control your infrastructure profile and visual protocols.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-surface p-8 rounded-[3rem] border border-border shadow-main space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Visual Assets</h3>
            
            <FileUpload 
              label="Avatar" 
              onFileSelect={(files) => setFormData({...formData, avatar: files[0]})}
              accept="image/*"
              error={errors.avatar?.[0]}
              isUploading={isUpdating && !!formData.avatar}
              progress={uploadProgress}
            />
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-10">
          <form onSubmit={handleUpdate} className="bg-surface p-10 rounded-[3.5rem] border border-border shadow-main space-y-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Core Identity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input 
                label="Full Name" 
                iconName="badge" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                error={errors.name?.[0]}
                fullWidth 
              />
             <CustomPhoneInput 
                label="Contact Number"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value || "" })}
                error={errors.phone?.[0]}
                fullWidth 
              />
            </div>

            <Textarea 
              label="Professional Bio" 
              placeholder="Tell us about your expertise..." 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              error={errors.bio?.[0]}
            />

            <div className="flex justify-end pt-4">
              <Button variant="primary" size="lg" isLoading={isUpdating} loadingType="loop" loadingText="Saving Changes..." iconName="sync">
                Save Changes
              </Button>
            </div>
          </form>

          {/* DANGER ZONE */}
          <section className="bg-surface/30 p-10 rounded-[3.5rem] border border-red-500/20 shadow-main space-y-6">
            <div className="flex items-center gap-3">
              <MaterialIcon iconName="dangerous" className="text-red-500" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-red-500">Terminal Commands</h3>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-1 max-w-md">
                <p className="text-sm font-bold text-main-text uppercase italic">Purge Account Permanently</p>
                <p className="text-xs text-muted font-medium italic leading-relaxed">
                  Decommissioning your account will wipe all associated metadata from the server. This action is irreversible.
                </p>
              </div>
              <Button 
                variant="danger" 
                size="lg" 
                iconName="delete_forever" 
                onClick={() => setIsModalOpen(true)}>
                Permanently Delete
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Permanently Delete"
        size="md"
        primaryAction={{
          label: "Yes, Delete it.",
          variant: "danger",
          iconName: "delete_forever",
          isLoading: isDeleting,
          onClick: executeDeletion
        }}
        secondaryAction={{
          label: "No, Cancel",
          onClick: () => setIsModalOpen(false)
        }}>
        <p className="text-sm italic opacity-70 leading-relaxed">
          You are about to permanently decommission your account. <strong>This action will disconnect you from all system modules immediately.</strong>
        </p>
      </Modal>
    </div>
  );

  return <MainLayout content={content} />;
};

export default MyProfile;