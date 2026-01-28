import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-surface border-t border-border mt-auto transition-colors duration-200">
      <div className="flex flex-col md:flex-row items-center justify-center text-muted text-sm">
        <span>© {new Date().getFullYear()} | Dev. Mark Romel F. Feguro.</span>
      </div>
    </footer>
  );
};

export default Footer;