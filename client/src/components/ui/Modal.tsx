import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MaterialIcon, Button } from "./index";

interface ModalAction {
  label: string;
  onClick: () => void | Promise<void>;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  iconName?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  primaryAction,
  secondaryAction,
  footer, 
  size = "md" 
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-main-bg/60 backdrop-blur-sm transition-all"
          />

          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full ${sizeClasses[size]} bg-surface border border-border shadow-main rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] transition-all`}
          >
            
            <div className="px-8 py-6 flex items-center justify-between border-b border-border bg-main-bg/30">
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-main-text">
                {title}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-main-bg rounded-xl transition-all text-muted hover:text-primary active:scale-95"
              >
                <MaterialIcon iconName="close" size={24} />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 text-main-text italic opacity-90">
              {children}
            </div>

            {/* Actions Footer */}
            {(footer || primaryAction || secondaryAction) && (
              <div className="px-8 py-6 border-t border-border bg-main-bg/30 flex justify-end items-center gap-3">
                {footer ? (
                  footer
                ) : (
                  <>
                    {secondaryAction && (
                      <Button 
                        variant={secondaryAction.variant || "secondary"} 
                        onClick={secondaryAction.onClick}
                        size="md"
                      >
                        {secondaryAction.label}
                      </Button>
                    )}
                    {primaryAction && (
                      <Button 
                        variant={primaryAction.variant || "primary"} 
                        onClick={primaryAction.onClick}
                        isLoading={primaryAction.isLoading}
                        iconName={primaryAction.iconName}
                        size="md">
                        {primaryAction.label}
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;