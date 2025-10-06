import React, { useRef, useEffect, useState } from 'react';
import { Image, Video, FileText, X } from 'lucide-react';

interface AttachmentMenuProps {
  onClose: () => void;
  onFileSelect: (file: File) => void;
  anchorElement: HTMLElement | null;
  position?: DOMRect | null;
}

export const AttachmentMenu: React.FC<AttachmentMenuProps> = ({ onClose, onFileSelect, anchorElement, position: propPosition }) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate position based on anchor element or propPosition
  useEffect(() => {
    if (propPosition) {
      setPosition({
        top: propPosition.top + window.scrollY,
        left: propPosition.left + window.scrollX,
      });
      return;
    }

    if (!anchorElement) return;

    const updatePosition = () => {
      const rect = anchorElement.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorElement, propPosition]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && 
          !menuRef.current.contains(event.target as Node) && 
          anchorElement && 
          !anchorElement.contains(event.target as Node)) {
        onClose();
      }
    };

    // Add a small delay to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, anchorElement]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
      onClose();
      // Reset the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLabelClick = (e: React.MouseEvent, accept: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.multiple = false;
      fileInputRef.current.click();
    }
  };

  if (!position || !anchorElement) return null;

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    left: 0,
    zIndex: 1000,
    opacity: position ? 1 : 0,
    pointerEvents: position ? 'auto' : 'none',
  };

  return (
    <div
      ref={menuRef}
      className="bg-[#2A2A2A] rounded-lg shadow-lg border border-[#444444] p-2 w-48 transition-opacity duration-200"
      style={menuStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-2 px-2">
        <span className="text-sm font-medium text-white">Send File</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }} 
          className="text-[#A0A0A0] hover:text-white focus:outline-none"
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>
      <div className="space-y-1">
        <div className="relative">
          <label 
            onClick={(e) => handleLabelClick(e, 'image/*,video/*')}
            className="flex items-center w-full px-3 py-2 text-sm text-left text-white rounded cursor-pointer hover:bg-[#3A3A3A] select-none"
          >
            <Image className="w-4 h-4 mr-3 flex-shrink-0" />
            <span>Photo & Video</span>
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="relative">
          <label 
            onClick={(e) => handleLabelClick(e, '.pdf,.doc,.docx,.txt,.wps')}
            className="flex items-center w-full px-3 py-2 text-sm text-left text-white rounded cursor-pointer hover:bg-[#3A3A3A] select-none"
          >
            <FileText className="w-4 h-4 mr-3 flex-shrink-0" />
            <span>Document</span>
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.wps"
            className="hidden"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};
