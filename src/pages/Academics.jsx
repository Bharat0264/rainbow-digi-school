import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, MonitorPlay, Database, Code } from 'lucide-react';
import { ACADEMICS } from '../data/school';

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

export default function Academics() {
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
            Academics & Programs
          </h1>
          <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 mb-6 rounded-full" />
          <p className="font-sans text-[#FFFDF6] text-lg md:text-xl max-w-2xl mx-auto">
            A comprehensive curriculum designed to spark curiosity and build mastery.
          </p>
        </div>
      </section>

      {/* Academic Stages */}
      <section className="py-24">
        {ACADEMICS?.map((stage, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div key={idx} className={`py-20 px-4 md:px-12 ${isEven ? 'bg-[#FFFDF6]' : 'bg-[#FBF3D5]'}`}>
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className={`${!isEven ? 'md:order-last' : ''} relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-md`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full h-full"
                  >
                    <img src={stage.image || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fm=webp&fit=crop&w=1000&q=75"}
                      alt={stage.title}
                      className="w-full h-full object-cover"
                     width="800" height="600" loading="lazy" decoding="async" />
                  </motion.div>
                </motion.div>

                {/* Text Side */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col justify-center"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1.5 rounded-full bg-[#F6C945]/20 text-[#D9A514] font-sans font-semibold text-sm tracking-wide">
                      {stage.grade}
                    </span>
                    <span className="text-[#A89888] font-sans text-sm">
                      Age: {stage.age}
                    </span>
                  </div>
                  <h2 className="font-serif text-4xl text-royal-blue mb-6">{stage.title}</h2>
                  <p className="font-sans text-lg text-[#6B5D52] mb-8 leading-relaxed max-w-xl">
                    {stage.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {stage.highlights?.map((highlight, i) => (
                      <span key={i} className="px-4 py-2 rounded-full bg-white border border-[#A89888]/30 text-[#3D3028] text-sm font-sans shadow-sm">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Digital Learning Feature Block */}
      <section className="py-24 px-4 md:px-12 bg-royal-blue text-[#FFFDF6] overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#F6C945] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-[#F6C945] mb-6">
              Smart & Digital Learning
            </h2>
            <p className="font-sans text-lg text-[#A89888] max-w-2xl mx-auto">
              Equipping students with future-ready skills through immersive technology and hands-on digital experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MonitorPlay, title: "Smart Classrooms", desc: "Interactive boards for visual learning." },
              { icon: Code, title: "Coding Labs", desc: "Early introduction to programming and logic." },
              { icon: Database, title: "Digital Library", desc: "Vast resources accessible anytime, anywhere." },
              { icon: Laptop, title: "1-to-1 Devices", desc: "Personalized learning paths via school devices." }
            ].map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-[#3D3028] rounded-[20px] p-8 border border-[#F6C945]/10 hover:border-[#F6C945]/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F6C945]/10 flex items-center justify-center mb-6">
                    <IconComponent className="w-6 h-6 text-[#F6C945]" />
                  </div>
                  <h3 className="font-serif text-xl text-white mb-3">{feature.title}</h3>
                  <p className="font-sans text-[#A89888] text-sm">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Methodology */}
      <section className="py-24 px-4 md:px-12 bg-[#FFFDF6]">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="font-serif text-4xl text-royal-blue mb-6">Our Methodology</h2>
          <p className="font-sans text-lg text-[#6B5D52]">A structured yet flexible approach to ensure deep understanding.</p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-[#F6C945]/30 z-0" />

          {[
            { step: "01", title: "Explore", desc: "Spark curiosity through hands-on activities." },
            { step: "02", title: "Discover", desc: "Guide students to find answers independently." },
            { step: "03", title: "Master", desc: "Solidify concepts via practice and application." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center max-w-[250px]"
            >
              <div className="w-24 h-24 rounded-full bg-white border-4 border-[#FBF3D5] shadow-lg flex items-center justify-center mb-6 text-2xl font-serif text-[#D9A514]">
                {item.step}
              </div>
              <h3 className="font-serif text-2xl text-royal-blue mb-3">{item.title}</h3>
              <p className="font-sans text-[#6B5D52]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
