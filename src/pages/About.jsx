import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Shield, Star, Users, ArrowRight } from 'lucide-react';
import { SCHOOL, VALUES } from '../data/school';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

const AnimatedText = ({ text }) => {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Map string icon names to Lucide components
const IconMap = {
  BookOpen,
  Shield,
  Star,
  Users
};

export default function About() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.6 }}
      className="w-full bg-[#FFFDF6] text-royal-blue"
    >
      {/* Hero Banner */}
      <section className="relative w-full h-[40vh] bg-royal-blue flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
        <div className="relative z-20 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-6xl text-[#F6C945] mb-4">
            About Rainbow Digi School
          </h1>
          <div className="h-[2px] w-32 mx-auto rainbow-line mb-6 rounded-full" />
          <p className="font-sans text-[#FFFDF6] text-lg md:text-xl max-w-2xl mx-auto">
            Nurturing future leaders in Kandlakoya through innovation, tradition, and excellence.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4 md:px-12 bg-[#FFFDF6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif text-4xl text-royal-blue mb-8">
              <AnimatedText text="Our Story" />
            </h2>
            <p className="font-sans text-lg text-[#6B5D52] mb-6 leading-relaxed">
              Founded with a passion to redefine education in Kandlakoya, Rainbow Digi School combines timeless values with modern digital learning.
            </p>
            <p className="font-sans text-lg text-[#6B5D52] leading-relaxed">
              We focus on holistic development, ensuring every child achieves academic excellence while developing strong moral character.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="relative h-[500px] rounded-[9999px_9999px_24px_24px] overflow-hidden shadow-md"
          >
            <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?fm=webp&fit=crop&w=1000&q=75"
              alt="School building"
              className="w-full h-full object-cover"
             width="800" height="600" loading="lazy" decoding="async" />
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 px-4 md:px-12 bg-[#FBF3D5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 p-12 rounded-[24px] border border-[#F6C945]/30 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-[#F6C945]" />
            <h3 className="font-serif text-3xl text-royal-blue mb-6">Our Vision</h3>
            <p className="font-sans text-lg text-[#6B5D52]">
              To be a premier institution that inspires lifelong learning, creativity, and compassionate global citizenship in every student.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 p-12 rounded-[24px] border border-[#F6C945]/30 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-[#F6C945]" />
            <h3 className="font-serif text-3xl text-royal-blue mb-6">Our Mission</h3>
            <p className="font-sans text-lg text-[#6B5D52]">
              To provide a nurturing environment where students are empowered to discover their potential through innovative education.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 px-4 md:px-12 bg-[#FFFDF6]">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="font-serif text-4xl text-royal-blue">
            <AnimatedText text="Our Core Values" />
          </h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES?.map((value, idx) => {
            const IconComponent = IconMap[value.icon] || Star;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center flex flex-col items-center group hover:scale-[1.02] transition-transform"
              >
                <div className="w-16 h-16 rounded-full bg-[#FBF3D5] flex items-center justify-center mb-6 group-hover:scale-[1.02] transition-transform">
                  <IconComponent className="w-8 h-8 text-[#D9A514]" />
                </div>
                <h4 className="font-serif text-xl text-royal-blue mb-3">{value.title}</h4>
                <p className="font-sans text-[#6B5D52] text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-24 px-4 md:px-12 bg-[#FBF3D5]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="md:col-span-5 relative"
          >
            <div className="aspect-[3/4] rounded-[9999px_9999px_24px_24px] overflow-hidden shadow-md relative z-10 border-4 border-white">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fm=webp&fit=crop&w=1000&q=75"
                alt="Principal"
                className="w-full h-full object-cover"
               width="800" height="600" loading="lazy" decoding="async" />
            </div>
            <div className="absolute -bottom-6 right-0 md:-right-6 w-32 h-32 bg-[#F6C945] rounded-full -z-0 opacity-50" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="md:col-span-7 pl-0 md:pl-12"
          >
            <h2 className="font-serif text-4xl text-royal-blue mb-8">
              <AnimatedText text="Message from the Principal" />
            </h2>
            <div className="relative">
              <span className="absolute -top-10 -left-6 text-6xl text-[#F6C945] font-serif opacity-30">"</span>
              <p className="font-sans text-xl text-royal-blue italic leading-relaxed mb-6">
                {SCHOOL?.principal?.message || "Education is not just about academic excellence, but also about building character and fostering a love for learning. We welcome you to join our vibrant community."}
              </p>
              <span className="absolute -bottom-8 -right-2 text-6xl text-[#F6C945] font-serif opacity-30">"</span>
            </div>
            <div className="mt-8">
              <p className="font-serif text-2xl text-royal-blue">{SCHOOL?.principal?.name || "[Principal Name Placeholder]"}</p>
              <p className="font-sans text-[#D9A514] font-medium tracking-wide uppercase text-sm mt-1">Principal</p>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
