"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

const faqs = [
  {
    question: "Qui peut participer au Semi des Quais de Seine ?",
    answer: "La course est ouverte à tous les coureurs âgés de 18 ans et plus pour le semi-marathon, et 16 ans et plus pour le 10 km. Un certificat médical de moins d'un an sera requis lors de l'inscription.",
  },
  {
    question: "Comment s'inscrire à la course ?",
    answer: "Les inscriptions ouvriront prochainement. Inscrivez-vous à notre newsletter pour être informé en priorité de l'ouverture des inscriptions et bénéficier d'une réduction de 10% sur votre dossard.",
  },
  {
    question: "Quel est le tarif du dossard ?",
    answer: "Les tarifs seront communiqués lors de l'ouverture des inscriptions. En vous inscrivant à notre newsletter, vous bénéficierez automatiquement d'une réduction de 10% sur votre dossard.",
  },
  {
    question: "Y aura-t-il des ravitaillements sur le parcours ?",
    answer: "Oui, des points de ravitaillement seront installés tous les 5 km pour le semi-marathon et à mi-parcours pour le 10 km. Vous y trouverez de l'eau, des boissons énergétiques et des collations.",
  },
  {
    question: "Le parcours est-il chronométré ?",
    answer: "Oui, les deux courses (semi-marathon et 10 km) seront chronométrées électroniquement. Chaque participant recevra une puce de chronométrage avec son dossard.",
  },
  {
    question: "Comment accéder au départ depuis Paris ?",
    answer: "Le départ est situé au Pont de Bezons, facilement accessible en Tramway depuis Paris. Des informations détaillées sur l'accès seront communiquées avec votre dossard.",
  },
  {
    question: "Y a-t-il un vestiaire ?",
    answer: "Oui, un vestiaire sécurisé sera mis à disposition des participants près de la zone de départ. Les détails pratiques seront communiqués ultérieurement.",
  },
  {
    question: "Puis-je annuler mon inscription ?",
    answer: "Les conditions d'annulation seront précisées lors de l'ouverture des inscriptions. Nous vous recommandons de souscrire à une assurance annulation si vous avez des doutes.",
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-b border-gray-200 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 md:py-6 flex items-center justify-between text-left hover:text-gold transition-colors"
      >
        <span className="text-base md:text-lg font-semibold text-navy-dark pr-4 md:pr-8">{faq.question}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-6 text-gold flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-4 md:pb-6 text-sm md:text-base text-gray-700 leading-relaxed">{faq.answer}</p>
      </motion.div>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-12 md:py-20 bg-gray-50" id="faq">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy-dark mb-4 md:mb-6">
            Questions fréquentes
          </h2>
          <div className="w-24 md:w-32 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto px-2 font-medium">
            Vous avez des questions ? Nous avons les réponses !
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 lg:p-12">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-700 mb-4">Une autre question ?</p>
          <p className="text-gray-600">
            D'autres informations seront communiquées prochainement. Inscrivez-vous à notre
            newsletter pour ne rien manquer !
          </p>
        </motion.div>
      </div>
    </section>
  );
}
