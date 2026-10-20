"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { BUSINESS, whatsappUrl } from "@/lib/rdk";
import { useLanguage } from "./language";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create WhatsApp message
    const whatsappMessage = `*Need Guide Request*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*How can we help:*\n${formData.message}`;
    
    // Open WhatsApp
    window.open(whatsappUrl(whatsappMessage), "_blank");
    
    // Reset form and close modal
    setFormData({ name: "", phone: "", message: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="rdk-modal-overlay" onClick={onClose}>
      <div className="rdk-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="rdk-modal-header">
          <h2>{t(["Need Guide?", "வழிகாட்டுதல் தேவையா?"])}</h2>
          <button
            className="rdk-modal-close"
            onClick={onClose}
            aria-label={t(["Close", "மூடு"])}
          >
            <X size={24} />
          </button>
        </div>
        
        <p className="rdk-modal-description">
          {t([
            "Tell us how we can help you with your loan needs.",
            "உங்கள் கடன் தேவைகளுக்கு நாங்கள் எவ்வாறு உதவலாம் என்று எங்களுக்கு தெரிவிக்கவும்.",
          ])}
        </p>

        <form onSubmit={handleSubmit} className="rdk-guide-form">
          <div className="rdk-form-group">
            <label htmlFor="guide-name">
              {t(["Your Name", "உங்கள் பெயர்"])} <span>*</span>
            </label>
            <input
              id="guide-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t(["Enter your name", "உங்கள் பெயரை உள்ளிடவும்"])}
              required
            />
          </div>

          <div className="rdk-form-group">
            <label htmlFor="guide-phone">
              {t(["Phone Number", "தொலைபேசி எண்"])} <span>*</span>
            </label>
            <input
              id="guide-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t(["Enter your phone number", "உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்"])}
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div className="rdk-form-group">
            <label htmlFor="guide-message">
              {t(["How can we help?", "நாங்கள் எப்படி உதவலாம்?"])} <span>*</span>
            </label>
            <textarea
              id="guide-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={t([
                "Tell us about your loan requirements...",
                "உங்கள் கடன் தேவைகளைப் பற்றி எங்களிடம் கூறுங்கள்...",
              ])}
              rows={4}
              required
            />
          </div>

          <button type="submit" className="rdk-button rdk-guide-submit">
            <Send size={16} />
            {t(["Send to WhatsApp", "WhatsApp-க்கு அனுப்பவும்"])}
          </button>
        </form>
      </div>
    </div>
  );
}
