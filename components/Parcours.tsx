"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";

// Import MapComponent dynamically to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

const distances = [
  {
    name: "Semi-Marathon",
    distance: "21,1 km",
    description: "Parcours exceptionnel le long des quais de la Seine. Départ du Pont de Bezons jusqu'à La Frette-sur-Seine, en passant par Carrières-sur-Seine, Chatou, Le Vésinet, Le Pecq, Sartrouville.",
    features: [
      "Parcours plat et rapide le long de la Seine",
      "Ravitaillements tous les 5 km",
      "Médaille de finisher",
    ],
    color: "navy-dark",
  },
  {
    name: "10 kilomètres",
    distance: "10 km",
    description: "Départ depuis Le Vésinet. Rejoignez l'arrivée à La Frette-sur-Seine par les magnifiques quais de la Seine.",
    features: [
      "Découverte des Quais de Seine",
      "Ravitaillements à mi-parcours",
      "Médaille de finisher",
    ],
    color: "blue-light",
  },
];

export default function Parcours() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-12 md:py-20 bg-white" id="parcours">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy-dark mb-4 md:mb-6">
            Le Parcours
          </h2>
          <div className="w-24 md:w-32 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto px-2 font-medium">
            Un parcours exceptionnel le long des quais de la Seine, de Bezons jusqu'à La Frette-sur-Seine, en passant par Carrières-sur-Seine, Chatou, Le Vésinet, Le Pecq et Sartrouville.
            Choisissez votre distance et préparez-vous à vivre une expérience inoubliable.
          </p>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 md:mb-16 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl"
        >
          <MapComponent />
        </motion.div>

        {/* Distances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {distances.map((distance, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className={`relative bg-gradient-to-br ${
                distance.color === "navy-dark"
                  ? "from-navy-dark to-navy-medium"
                  : "from-blue-light to-blue-light/80"
              } text-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300`}
            >
              <div className="absolute top-3 right-3 md:top-4 md:right-4 text-4xl md:text-6xl font-bold opacity-20">
                {distance.distance.split(" ")[0]}
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{distance.name}</h3>
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient-gold mb-3 md:mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>{distance.distance}</p>
              <p className="text-base md:text-lg mb-4 md:mb-6 opacity-90">{distance.description}</p>
              <ul className="space-y-2">
                {distance.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg
                      className="w-6 h-6 text-gold flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Key Points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 md:mt-16 bg-gray-50 rounded-xl md:rounded-2xl p-6 md:p-8 max-w-4xl mx-auto"
        >
          <h3 className="text-xl md:text-2xl font-bold text-navy-dark mb-6 text-center">
            Points clés du parcours
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18l4-4 4 4 4-4 4 4V3M3 11h18" />
                </svg>
              </div>
              <h4 className="font-bold text-navy-dark mb-2">Départ du semi-marathon</h4>
              <p className="text-gray-700">Pont de Bezons</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v18l6-3 6 3V3" />
                </svg>
              </div>
              <h4 className="font-bold text-navy-dark mb-2">Départ du 10 km</h4>
              <p className="text-gray-700">Le Vésinet</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-navy-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3h14v2h-2v14h-2V5H9v14H7V5H5V3zm7 16h2v2h-2v-2z"/>
                  <path d="M6 5h2v2H6V5zm0 4h2v2H6V9zm0 4h2v2H6v-2zm10-8h2v2h-2V5zm0 4h2v2h-2V9zm0 4h2v2h-2v-2z"/>
                </svg>
              </div>
              <h4 className="font-bold text-navy-dark mb-2">Arrivée</h4>
              <p className="text-gray-700">La Frette-sur-Seine</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
