import { useState, useEffect, useRef } from "react";
import { NotificationService } from "../../features/notifications";
import { MaterialIcon, LoadingSpinner, Button } from "../ui";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { notify } from "../../utils/notify";
import { useTabNotification } from "../../hooks/useTabNotification";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  useTabNotification(notifications.length);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await NotificationService.getUnread();
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      notify.success("Marked as read.");
    } catch (error) {
      notify.error("Failed to update notification.");
    }
  };

   useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-primary rounded-xl hover:bg-main-bg transition-colors focus:outline-none">
        <MaterialIcon iconName="notifications" size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black italic text-surface shadow-main">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 origin-top-right divide-y divide-border rounded-4xl bg-surface border border-border shadow-main z-50 animate-reveal">
          <div className="px-6 py-4 flex items-center justify-between bg-main-bg/30 rounded-t-4xl">
            <h3 className="text-sm font-black uppercase italic tracking-tighter text-main-text">
              System Alerts
            </h3>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-lg">
              {notifications.length} New
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto py-2 custom-scrollbar">
            {loading ? (
              <div className="py-10 flex justify-center">
                <LoadingSpinner variant="dots" size="sm" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center space-y-2 opacity-50">
                <MaterialIcon iconName="notifications_off" size={32} className="mx-auto" />
                <p className="text-xs font-medium italic">No pending alerts.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className="px-6 py-4 hover:bg-main-bg transition-colors flex gap-4 group cursor-pointer"
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-black uppercase italic tracking-tighter text-main-text">
                      {n.subject}
                    </p>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest pt-1">
                      {n.sent_at}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-main-bg/10 rounded-b-4xl">
            <Button variant="ghost" size="sm" fullWidth className="text-[10px] font-black italic uppercase">
              View All Clearances
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;