"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, ReactElement } from "react";
import Image from "next/image";

// Icon component helper
const IconSVG = ({ icon }: { icon: string }) => {
  const icons: Record<string, ReactElement> = {
    running: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
      </svg>
    ),
    celebration: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2 20h2c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1H2v-2h2c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1H2V9h2c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1H2V4h2c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1H2C.9 1 0 1.9 0 3v18c0 1.1.9 2 2 2z M22 2h-2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h2v2h-2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h2v3h-2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h2v2h-2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h2c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z M11 9.79c0 .45-.54.67-.85.35l-2.79-2.79c-.32-.31-.1-.85.35-.85h5.58c.45 0 .67.54.35.85l-2.79 2.79c-.14.14-.35.22-.56.22-.21 0-.42-.08-.56-.22-.31-.32-.09-.85.36-.85z"/>
      </svg>
    ),
    train: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z"/>
      </svg>
    ),
    star: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    ),
  };

  return icons[icon] || null;
};

const reasons = [
  {
    title: "Un parcours d'exception",
    description: "Parcours exceptionnel le long des quais de la Seine, de Bezons à La Frette-sur-Seine, traversant les plus beaux paysages de l'Île-de-France. Un tracé plat et rapide, idéal pour viser un record personnel.",
    icon: "running",
    image: "/images/parcours.jpg",
  },
  {
    title: "Une ambiance unique",
    description: "Profitez d'un événement convivial dans un cadre naturel exceptionnel. Des milliers de coureurs partageront cette aventure avec vous.",
    icon: "celebration",
    image: "/images/ambiance.jpg",
  },
  {
    title: "Accessible depuis Paris",
    description: "À seulement quelques minutes de Paris en Tramway, rejoignez facilement le départ et partagez ce moment avec vos proches.",
    icon: "train",
    image: "/images/access.jpg",
  },
  {
    title: "Pour tous les niveaux",
    description: "Que vous soyez débutant ou confirmé, choisissez entre le semi-marathon (21,1 km) ou le parcours 10 km. Chacun son défi !",
    icon: "star",
    image: "/images/runners.png",
  },
];

function ReasonCard({ reason, index }: { reason: typeof reasons[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden">
        <Image
          src={reason.image}
          alt={reason.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 to-transparent" />
        <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-gold">
          <div className="w-8 h-8 md:w-12 md:h-12">
            <IconSVG icon={reason.icon} />
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg md:text-2xl font-bold text-navy-dark mb-1.5 sm:mb-2 md:mb-3">{reason.title}</h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">{reason.description}</p>
      </div>
    </motion.div>
  );
}

export default function WhyParticipate() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-12 md:py-20 bg-gray-50" id="pourquoi">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy-dark mb-4 md:mb-6">
            Pourquoi participer ?
          </h2>
          <div className="w-24 md:w-32 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto px-2 font-medium">
            Le Semi des Quais de Seine, c&apos;est bien plus qu&apos;une course.
            C&apos;est une expérience sportive inoubliable au cœur de l&apos;Île-de-France.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <ReasonCard key={index} reason={reason} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 md:mt-16 text-center"
        >
          <div className="inline-block bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 max-w-2xl mx-4">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy-dark mb-3 md:mb-4">
              Prêt à relever le défi ?
            </h3>
            <p className="text-lg md:text-xl text-gray-700 mb-4 md:mb-6">
              Inscrivez-vous à notre newsletter pour être informé en avant-première
              de l&apos;ouverture des inscriptions et bénéficiez de <strong className="text-gradient-fire">10% de réduction</strong> sur votre dossard !
            </p>
            <div className="max-w-lg mx-auto">
              {/* EmailForm will be added here via page.tsx */}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
