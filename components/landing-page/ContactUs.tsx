"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  ArrowRight,
  X,
} from "lucide-react";

const easing = [0.4, 0, 0.2, 1];

const ContactUs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const contactOptions = [
    {
      id: "email",
      icon: Mail,
      title: "Email",
      subtitle: "Drop us a line",
      content: "hello@company.com",
      description: "We typically respond within 24 hours",
      action: "Send email",
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "Live Chat",
      subtitle: "Chat with our team",
      content: "Available 9AM – 6PM EST",
      description: "Get instant answers to your questions",
      action: "Start chat",
    },
    {
      id: "phone",
      icon: Phone,
      title: "Phone",
      subtitle: "Give us a call",
      content: "+1 (555) 123-4567",
      description: "Monday to Friday, 9AM – 6PM EST",
      action: "Call now",
    },
    {
      id: "location",
      icon: MapPin,
      title: "Visit",
      subtitle: "Come say hello",
      content: "San Francisco, CA",
      description: "123 Market Street, Suite 500",
      action: "Get directions",
    },
  ];

  const toggleCard = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div
        className={`bg-black text-white flex justify-center p-6 transition-all duration-300 ${
          isOpen ? "min-h-screen items-center" : "items-start"
        }`}
      >
        <div className="max-w-7xl w-full">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* -------------------- CTA BUTTON -------------------- */
              <motion.div
                key="cta"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: easing }}
                className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center"
              >
                <motion.button
                  onClick={() => setIsOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition" />
                  <div className="relative bg-white text-black rounded-full py-4 px-8 text-sm font-medium tracking-tight flex items-center gap-3">
                    <span className="relative flex items-center justify-center">
                      <motion.span
                        className="absolute w-3 h-3 bg-green-400 rounded-full"
                        animate={{
                          scale: [1, 1.6, 1],
                          opacity: [1, 0, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                    </span>
                    Contact us
                  </div>
                </motion.button>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="text-xs text-gray-400 max-w-xs"
                >
                  Have a question, project idea, or need support? We’re just one
                  click away.
                </motion.p>
              </motion.div>
            ) : (
              /* -------------------- CONTENT -------------------- */
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: easing }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter">
                      Get in touch
                    </h1>
                    <p className="text-gray-400 text-sm">
                      Choose your preferred way to reach us
                    </p>
                  </motion.div>

                  <motion.button
                    onClick={() => {
                      setIsOpen(false);
                      setExpandedCard(null);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {contactOptions.map((option) => {
                    const Icon = option.icon;
                    const isExpanded = expandedCard === option.id;

                    return (
                      <motion.div
                        key={option.id}
                        layout
                        transition={{
                          layout: {
                            duration: 0.45,
                            ease: easing,
                          },
                        }}
                        className={
                          isExpanded ? "md:col-span-2 lg:col-span-2" : ""
                        }
                      >
                        <motion.div
                          layout
                          onClick={() => toggleCard(option.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="h-full cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                <Icon className="w-5 h-5 text-zinc-300" />
                              </div>
                              <div>
                                <h3 className="text-base font-medium">
                                  {option.title}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {option.subtitle}
                                </p>
                              </div>
                            </div>

                            <motion.span
                              animate={{
                                rotate: isExpanded ? 90 : 0,
                              }}
                              transition={{
                                duration: 0.3,
                              }}
                            >
                              <ArrowRight className="w-4 h-4 text-zinc-500" />
                            </motion.span>
                          </div>

                          <AnimatePresence mode="popLayout">
                            {isExpanded ? (
                              <motion.div
                                key="expanded"
                                layout
                                initial={{
                                  opacity: 0,
                                  y: 12,
                                }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                }}
                                exit={{
                                  opacity: 0,
                                  y: 12,
                                }}
                                transition={{
                                  duration: 0.35,
                                  ease: easing,
                                }}
                                className="pt-4 border-t border-zinc-800 space-y-4"
                              >
                                <div>
                                  <p className="text-lg font-medium">
                                    {option.content}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {option.description}
                                  </p>
                                </div>

                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full bg-white text-black rounded-full py-2.5 text-sm font-medium hover:bg-gray-100"
                                >
                                  {option.action}
                                </button>
                              </motion.div>
                            ) : (
                              <motion.p
                                key="collapsed"
                                initial={{
                                  opacity: 0,
                                }}
                                animate={{
                                  opacity: 1,
                                }}
                                exit={{
                                  opacity: 0,
                                }}
                                className="text-sm text-gray-400"
                              >
                                {option.content}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="h-60 w-full"></div>
    </>
  );
};

export default ContactUs;
