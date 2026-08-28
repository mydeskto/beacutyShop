import React, { useState } from 'react';
import { Facebook, Instagram, Youtube, Copy, Check } from 'lucide-react';
import { StoreSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

interface Props {
  settings: StoreSettings;
  onCouponClick?: (code: string) => void;
}

export const TopAnnouncementBar: React.FC<Props> = ({ settings, onCouponClick }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!settings.announcementActive) return null;

  const copyCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    const code = settings.announcementCoupon || 'PURE20';
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (onCouponClick) {
      onCouponClick(code);
    } else {
      showToast('Code Copied!', `Use code ${code} at checkout for 20% discount.`, 'success');
    }
    setTimeout(() => setCopied(false), 3000);
  };

  const displayText = settings.announcementText || 'Free shipping on orders over ₹499 | Use code: PURE20 for 20% OFF 🌿';

  return (
    <aside aria-label="Announcement" className="bg-[#132B1E] text-[#E0EBE3] py-2 px-3 sm:px-6 text-[11px] sm:text-xs tracking-wider border-b border-[#1E3E2B]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Announcement Text with clickable promo code */}
        <div className="flex items-center gap-2 font-medium overflow-hidden">
          <span className="truncate">
            {displayText}
          </span>
          <button
            onClick={copyCoupon}
            className="inline-flex items-center gap-1 bg-[#1E3E2B] hover:bg-[#2B543B] text-[#F3F7F4] px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer border border-[#3E6C52] shrink-0"
            title="Click to copy code"
          >
            {copied ? (
              <>
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-2.5 h-2.5 text-[#A8C2B0]" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Social Icons Matching Screenshot */}
        <div className="hidden sm:flex items-center gap-3 text-[#A8C2B0]">
          <a
            href={settings.facebookUrl || "https://facebook.com"}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:text-white transition-colors cursor-pointer"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>
          <a
            href={settings.instagramUrl || "https://instagram.com"}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:text-white transition-colors cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
          <a
            href={settings.youtubeUrl || "https://youtube.com"}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="hover:text-white transition-colors cursor-pointer"
          >
            <Youtube className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </aside>
  );
};
