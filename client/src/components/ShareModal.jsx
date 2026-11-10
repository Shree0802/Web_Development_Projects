import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, title, url }) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const currentUrl = url || window.location.href;
  const shareText = `Discover ${title || 'Kolhapur Tourism'} - Explore Heritage, Sacred Temples, Forts and Culture: ${currentUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 relative border border-[#E5E7EB]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-[#F5F8FC] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-extrabold text-lg text-[#17243A] mb-1">
          Share this Destination
        </h3>
        <p className="text-xs text-[#6B7280] mb-5">
          Share with your friends and family planning their trip to Kolhapur.
        </p>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-xs font-bold"
          >
            <span className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
              W
            </span>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={shareTwitter}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#0878D1]/10 text-[#0878D1] hover:bg-[#0878D1]/20 transition-colors text-xs font-bold"
          >
            <span className="w-9 h-9 rounded-full bg-[#0878D1] text-white flex items-center justify-center font-bold">
              X
            </span>
            <span>X / Twitter</span>
          </button>

          <button
            onClick={shareFacebook}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-bold"
          >
            <span className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              f
            </span>
            <span>Facebook</span>
          </button>
        </div>

        {/* Direct Link Copy */}
        <div className="flex items-center gap-2 bg-[#F5F8FC] p-2 rounded-xl border border-[#E5E7EB]">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="bg-transparent text-[11px] text-[#6B7280] flex-1 outline-none px-2 truncate"
          />
          <button
            onClick={copyToClipboard}
            className="bg-[#0878D1] hover:bg-[#1267B0] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
