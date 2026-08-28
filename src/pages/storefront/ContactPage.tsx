import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { StoreSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

interface Props {
  settings: StoreSettings;
}

export const ContactPage: React.FC<Props> = ({ settings }) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does standard shipping take?',
      a: 'Orders are processed within 24-48 business hours in our climate-controlled facility. Standard carbon-neutral ground delivery takes 3 to 5 business days across the domestic United States.'
    },
    {
      q: 'What is your return & gentle satisfaction policy?',
      a: 'We want you to love your ritual. We offer a 30-day gentle guarantee on all skincare bottles and home kitchen essentials. If it doesn’t suit your skin or kitchen, contact us for a complimentary prepaid return label.'
    },
    {
      q: 'Are your botanical formulas tested on animals?',
      a: 'Never. Purelis is 100% cruelty-free certified. We never test on animals, nor do we source raw botanicals from suppliers that conduct animal testing.'
    },
    {
      q: 'How should I care for the Enameled Cast Iron Dutch Oven?',
      a: 'Wash with warm soapy water and a soft non-scratch sponge. Avoid harsh steel wool abrasives. The premium porcelain enamel interior naturally resists sticking without synthetic toxic Teflon coatings.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Missing Fields', 'Please complete all required contact fields.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Message Received', 'Our botanical concierge team will respond within 24 hours.', 'success');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase font-bold tracking-[0.24em] text-[#8DA792] block mb-1">
            Client Concierge & Care
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C3829]">
            We're Here to Help
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6E64] mt-2">
            Have questions about an ingredient, routine pairing, or order shipment? Connect with our dedicated support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Left Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAE5DA] p-6 sm:p-10 shadow-2xs">
            <h3 className="font-serif font-bold text-xl text-[#1C3829] mb-4">
              Send a Note to Our Care Team
            </h3>

            {submitted ? (
              <div className="p-8 rounded-xl bg-[#EAEFEA] border border-[#D5DFD7] text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-[#1C3829]">Thank you, {name}!</h4>
                <p className="text-xs text-[#5E6E64] max-w-md mx-auto">
                  Your message has been received. Our concierge team has sent a receipt to {email} and will respond shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setMessage(''); }}
                  className="px-5 py-2 bg-[#1C3829] text-white text-xs font-bold uppercase rounded-lg"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Amelia Chen"
                      className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amelia@example.com"
                      className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Topic / Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                  >
                    <option value="Order Inquiry">Order Status & Tracking</option>
                    <option value="Product Advice">Skincare Formulation Advice</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Kitchen Care">Home & Kitchen Care</option>
                    <option value="Wholesale">Wholesale & Press</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">How can we assist? *</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your question or request here..."
                    className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-[0.14em] rounded-lg transition-colors shadow flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 sm:p-8 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#1C3829]">Direct Channels</h3>
              
              <div className="space-y-4 text-xs text-[#47584E]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1C3829] block">Email Support</span>
                    <a href={`mailto:${settings.supportEmail}`} className="text-[#8DA792] hover:underline">
                      {settings.supportEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1C3829] block">Concierge Phone</span>
                    <span>{settings.supportPhone}</span>
                    <p className="text-[10px] text-[#7A8A7F]">Mon-Fri: 8am - 6pm PST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1C3829] block">Botanical Studio</span>
                    <span>{settings.storeAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#EAEFEA] rounded-2xl border border-[#D5DFD7] p-6 space-y-2">
              <h4 className="font-serif font-bold text-base text-[#1C3829]">Looking for Instant Answers?</h4>
              <p className="text-xs text-[#5E6E64] leading-relaxed">
                Check our Frequently Asked Questions below for instant guidance on order shipments and ingredients.
              </p>
            </div>
          </div>

        </div>

        {/* FAQs Accordion */}
        <section className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-serif font-bold text-[#1C3829] text-center uppercase mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl border border-[#EAE5DA] overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#1C3829]">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#8DA792] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs text-[#5E6E64] leading-relaxed border-t border-stone-100 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
