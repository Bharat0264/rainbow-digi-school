import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation } from 'lucide-react';
import { SCHOOL } from '../data/school';

export default function Contact() {
  const [formData, setFormData] = useState({
    parentName: '', phone: '', email: '', classApplying: 'Playgroup', message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0 }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('http://localhost:3001/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message. Please try again.');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ parentName: '', phone: '', email: '', classApplying: 'Playgroup', message: '' });
      }, 5000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial="initial" animate="animate" exit="exit" variants={pageVariants}
      className="min-h-screen bg-[#FFFDF6]"
    >
      {/* Hero Banner */}
      <section className="bg-royal-blue text-white pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl text-[#F6C945] mb-6">Get in Touch</h1>
          <p className="text-[#A89888] text-lg max-w-2xl mx-auto">
            We would love to hear from you. Reach out for admissions, visits, or general queries.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 opacity-80" />
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#FBF3D5] p-8 md:p-12 rounded-3xl shadow-sm"
          >
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-2xl font-serif text-royal-blue mb-4">Message Sent Successfully!</h3>
                <p className="text-[#6B5D52]">Thank you for reaching out. We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-3xl font-serif text-royal-blue mb-8">Send us a Message</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#6B5D52] mb-2">Full Name</label>
                    <input required type="text" name="parentName" value={formData.parentName} onChange={handleChange} className="w-full bg-white px-4 py-3 rounded-xl border border-[#D9A514]/30 focus:outline-none focus:ring-2 focus:ring-[#F6C945]" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B5D52] mb-2">Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white px-4 py-3 rounded-xl border border-[#D9A514]/30 focus:outline-none focus:ring-2 focus:ring-[#F6C945]" placeholder="+1 234 567 890" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#6B5D52] mb-2">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white px-4 py-3 rounded-xl border border-[#D9A514]/30 focus:outline-none focus:ring-2 focus:ring-[#F6C945]" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B5D52] mb-2">Class Applying For</label>
                    <select name="classApplying" value={formData.classApplying} onChange={handleChange} className="w-full bg-white px-4 py-3 rounded-xl border border-[#D9A514]/30 focus:outline-none focus:ring-2 focus:ring-[#F6C945]">
                      <option>Playgroup</option>
                      <option>Nursery</option>
                      <option>Junior KG</option>
                      <option>Senior KG</option>
                      <option>Grade 1 to 5</option>
                      <option>Grade 6 to 8</option>
                      <option>Grade 9 to 10</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6B5D52] mb-2">Your Message</label>
                  <textarea required name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full bg-white px-4 py-3 rounded-xl border border-[#D9A514]/30 focus:outline-none focus:ring-2 focus:ring-[#F6C945]" placeholder="How can we help you?"></textarea>
                </div>
                
                {submitError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                    {submitError}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className={`w-full ${isSubmitting ? 'bg-[#FDF0C4] text-royal-blue/50' : 'bg-[#F6C945] hover:bg-[#D9A514]'} text-royal-blue font-medium py-4 rounded-full transition-colors duration-300 shadow-md flex justify-center items-center`}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right Column: Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#FBF3D5]">
              <h3 className="text-2xl font-serif text-royal-blue mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FBF3D5] rounded-full flex items-center justify-center flex-shrink-0 text-[#D9A514]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-royal-blue mb-1">Our Campus</h4>
                    <p className="text-[#6B5D52] leading-relaxed">{SCHOOL.address.full}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FBF3D5] rounded-full flex items-center justify-center flex-shrink-0 text-[#D9A514]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-royal-blue mb-1">Phone</h4>
                    <a href={`tel:${SCHOOL.phone}`} className="text-[#6B5D52] hover:text-[#D9A514] transition-colors">{SCHOOL.phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FBF3D5] rounded-full flex items-center justify-center flex-shrink-0 text-[#D9A514]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-royal-blue mb-1">Email</h4>
                    {/* [PLACEHOLDER] using generic email since it's not in schema */}
                    <a href="mailto:info@rainbowdigischool.com" className="text-[#6B5D52] hover:text-[#D9A514] transition-colors">info@rainbowdigischool.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FBF3D5] rounded-full flex items-center justify-center flex-shrink-0 text-[#D9A514]">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-royal-blue mb-1">Office Hours</h4>
                    <p className="text-[#6B5D52]">Opens 8:15 AM - 4:00 PM (Mon-Sat)</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a href={SCHOOL.whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full font-medium transition-colors">
                  <MessageCircle size={20} />
                  WhatsApp Us
                </a>
                <a href={SCHOOL.mapsUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 border-2 border-[#D9A514] text-[#D9A514] hover:bg-[#FBF3D5] py-3 px-6 rounded-full font-medium transition-colors">
                  <Navigation size={20} />
                  Get Directions
                </a>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm h-64 border border-[#FBF3D5]">
              <iframe 
                src={SCHOOL.mapsEmbed} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location Map"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
