"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import EmailForm from "./EmailForm";

export default function Countdown() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Target date: March 1, 2027
  const targetDate = new Date("2027-03-01T09:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: "Jours", value: timeLeft.days },
    { label: "Heures", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Secondes", value: timeLeft.seconds },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-light rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Plus que quelques mois...
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Le compte à rebours est lancé jusqu'à la première édition du Semi des Quais de Seine
          </p>
        </motion.div>

        {/* Date announcement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-3 mb-6">
            <p className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>Mars 2027 • Date précise à venir</span>
            </p>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            La date exacte de la course sera annoncée prochainement.
            Inscrivez-vous à notre newsletter pour être informé en priorité !
          </p>
        </motion.div>

        {/* Email Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-center mb-4">
              Ne manquez pas l'ouverture des inscriptions
            </h3>
            <p className="text-center text-gray-300 mb-6">
              Recevez votre <strong className="text-gold">code promo -10%</strong> dès l'annonce de la date
            </p>
            <EmailForm variant="footer" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
