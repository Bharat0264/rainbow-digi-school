import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, CheckCircle2, Phone } from 'lucide-react';
import { ADMISSION_STEPS, ADMISSION_DOCS, ADMISSION_FAQ, ACADEMICS } from '../data/school';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

export default function Admissions() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [formStatus, setFormStatus] = useState('idle'); // 'idle', 'success'

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    setFormStatus('success');
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.6 }}
      className="w-full bg-[#FFFDF6]"
    >
      {/* Hero Banner */}
      <section className="relative w-full h-[40vh] bg-royal-blue flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
        <div className="relative z-20 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-6xl text-[#F6C945] mb-4">
            Admissions 2026–27
          </h1>
          <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 mb-6 rounded-full" />
          <p className="font-sans text-[#FFFDF6] text-lg md:text-xl max-w-2xl mx-auto">
            Your child's journey begins here.
          </p>
        </div>
      </section>

      {/* 4-Step Process Timeline */}
      <section className="py-24 px-4 md:px-12 bg-[#FFFDF6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-royal-blue mb-4">Admission Process</h2>
            <p className="font-sans text-lg text-[#6B5D52]">A simple and transparent path to joining our family.</p>
          </div>
          
          <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4 mt-12">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[28px] left-0 w-full h-[2px] bg-[#F6C945]/30 z-0" />
            
            {ADMISSION_STEPS?.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center flex-1"
              >
                <div className="w-14 h-14 rounded-full bg-[#F6C945] flex items-center justify-center text-white font-serif text-xl font-bold shadow-lg mb-6 border-4 border-white">
                  {idx + 1}
                </div>
                <h3 className="font-serif text-xl text-royal-blue mb-3">{step.title}</h3>
                <p className="font-sans text-[#6B5D52] text-sm max-w-[200px] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="py-24 px-4 md:px-12 bg-[#FBF3D5]">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-[24px] p-8 md:p-12 shadow-xl border border-white/50">
          <h2 className="font-serif text-3xl text-royal-blue mb-8 text-center">Documents Required</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ADMISSION_DOCS?.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#FBF3D5]/50 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-[#D9A514] shrink-0 mt-0.5" />
                <span className="font-sans text-[#3D3028]">{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 px-4 md:px-12 bg-[#FFFDF6]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-royal-blue mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {ADMISSION_FAQ?.map((faq, idx) => (
              <div 
                key={idx} 
                className={`bg-white border ${openFaqIndex === idx ? 'border-[#F6C945] shadow-md' : 'border-[#A89888]/20'} rounded-2xl overflow-hidden transition-all duration-300`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className="font-serif text-lg text-royal-blue pr-8">{faq.question}</h3>
                  <div className="text-[#D9A514] shrink-0">
                    {openFaqIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-2 border-t border-[#A89888]/10 text-sans text-[#6B5D52] leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-24 px-4 md:px-12 bg-[#FBF3D5]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#F6C945]/20">
            <h2 className="font-serif text-3xl text-royal-blue mb-8 text-center">Start Your Enquiry</h2>
            
            {formStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-[#F6C945]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-[#D9A514]" />
                </div>
                <h3 className="font-serif text-2xl text-royal-blue mb-4">Thank You!</h3>
                <p className="font-sans text-[#6B5D52] mb-8">We have received your enquiry and will contact you shortly.</p>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#25D366] text-white rounded-full font-sans font-medium hover:bg-[#20bd5a] transition-colors"
                >
                  Connect on WhatsApp
                </a>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-sans text-[#3D3028] mb-2">Parent's Name *</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-[#A89888]/30 focus:border-[#F6C945] focus:ring-1 focus:ring-[#F6C945] outline-none transition-all font-sans" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-sans text-[#3D3028] mb-2">Phone Number *</label>
                    <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-[#A89888]/30 focus:border-[#F6C945] focus:ring-1 focus:ring-[#F6C945] outline-none transition-all font-sans" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-sans text-[#3D3028] mb-2">Email Address *</label>
                    <input required type="email" className="w-full px-4 py-3 rounded-xl border border-[#A89888]/30 focus:border-[#F6C945] focus:ring-1 focus:ring-[#F6C945] outline-none transition-all font-sans" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-sans text-[#3D3028] mb-2">Child's Name *</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-[#A89888]/30 focus:border-[#F6C945] focus:ring-1 focus:ring-[#F6C945] outline-none transition-all font-sans" placeholder="Jane Doe" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-sans text-[#3D3028] mb-2">Grade Applying For *</label>
                  <select required className="w-full px-4 py-3 rounded-xl border border-[#A89888]/30 focus:border-[#F6C945] focus:ring-1 focus:ring-[#F6C945] outline-none transition-all font-sans bg-white">
                    <option value="">Select a grade...</option>
                    {ACADEMICS?.map((stage, idx) => (
                      <option key={idx} value={stage.title}>{stage.title} ({stage.grade})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-sans text-[#3D3028] mb-2">Message (Optional)</label>
                  <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-[#A89888]/30 focus:border-[#F6C945] focus:ring-1 focus:ring-[#F6C945] outline-none transition-all font-sans resize-none" placeholder="Any specific questions?"></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-4 bg-[#F6C945] text-royal-blue font-sans font-semibold rounded-full hover:bg-[#D9A514] transition-colors shadow-md">
                    Submit Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-royal-blue text-center px-4">
        <h2 className="font-serif text-3xl text-white mb-8">Prefer to talk?</h2>
        <a href="tel:+919876543210" className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-[#F6C945] rounded-full font-sans font-semibold transition-all border border-[#F6C945]/30">
          <Phone className="w-5 h-5" />
          Call Admissions Office
        </a>
      </section>
    </motion.div>
  );
}
