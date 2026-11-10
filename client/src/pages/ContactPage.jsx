import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  ChevronDown, 
  ShieldAlert, 
  Clock,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const [faqs, setFaqs] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    async function loadSupport() {
      try {
        const res = await api.getSupportData();
        if (res.success) {
          setFaqs(res.faqs || []);
          setEmergencyContacts(res.emergencyContacts || []);
        }
      } catch (err) {
        console.error('Failed to load support data:', err);
      }
    }
    loadSupport();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitContact({
        name,
        email,
        phone,
        subject,
        message
      });

      if (res.success) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
        setTimeout(() => setSubmitted(false), 6000);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-[#17243A] min-h-screen">
      
      {/* Banner (TRIVVIU Reference Visual Style) */}
      <section className="relative bg-[#17243A] py-16 sm:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Contact Support"
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17243A] via-[#17243A]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#FF7900]">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Travel Desk & Support</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Contact Kolhapur Tourism Support
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Have questions regarding temple darshan timings, registered fort guides, hotel bookings, or festival travel? Reach out to our tourism specialists.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">

        {/* Main Grid: Form + Office Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Working Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] shadow-card space-y-6">
            <div>
              <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
                GET IN TOUCH
              </span>
              <h2 className="text-2xl font-extrabold text-[#17243A]">Send Us a Message</h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                Your inquiry will be logged directly into our tourist assistance portal.
              </p>
            </div>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been recorded and an authorized specialist will get back to you shortly.</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Patil"
                    className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. vikram@example.com"
                    className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17243A] mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Navratri Darshan pass inquiry"
                    className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17243A] mb-1">Your Message or Enquiry</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about travel advice, best visiting times, wheelchair assistance, guide contacts, or hotel enquiries..."
                  className="w-full text-xs p-3 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0878D1] text-[#17243A]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

          {/* Right Col: Official Office & Helplines */}
          <div className="space-y-6">
            
            {/* Official Tourism Office */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-card space-y-4">
              <h3 className="font-extrabold text-base text-[#17243A] border-b border-[#E5E7EB] pb-2">
                Official Tourism Information
              </h3>

              <div className="space-y-3.5 text-xs text-[#6B7280]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0878D1] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#17243A]">MTDC Tourist Information Counter</strong><br />
                    Central Bus Stand (CBS) Premises, Kolhapur, Maharashtra 416001
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#0878D1] shrink-0" />
                  <span>+91 231 2652935 / +91 9021830410</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#0878D1] shrink-0" />
                  <span>info@kolhapurtourism.org</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#0878D1] shrink-0" />
                  <span>Monday - Saturday: 09:30 AM - 06:00 PM</span>
                </div>
              </div>
            </div>

            {/* Emergency Helplines Card */}
            <div className="bg-[#F5F8FC] rounded-3xl p-6 border border-[#E5E7EB] space-y-3">
              <h3 className="font-extrabold text-sm text-[#17243A] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FF7900]" />
                <span>Emergency Assistance Directory</span>
              </h3>

              <div className="space-y-2 text-xs">
                {emergencyContacts.map((contact, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-[#E5E7EB]">
                    <div className="font-bold text-[#17243A]">{contact.service}</div>
                    <div className="text-[#0878D1] font-extrabold mt-0.5">{contact.number}</div>
                    <div className="text-[10px] text-[#6B7280]">{contact.address}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Frequently Asked Questions (FAQ) Section */}
        <div className="bg-[#F5F8FC] rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#0878D1] uppercase tracking-wider block mb-1">
              HELP & FAQS
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#17243A]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Answers to common questions about visiting Kolhapur, dress codes, transportation, and cuisines.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex justify-between items-center text-xs sm:text-sm font-bold text-[#17243A] hover:bg-[#F5F8FC]/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-[#6B7280] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0878D1]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs text-[#6B7280] leading-relaxed border-t border-[#F5F8FC]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              to="/faq"
              className="text-xs font-bold text-[#0878D1] hover:underline"
            >
              Browse all dedicated FAQs and travel answers →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
