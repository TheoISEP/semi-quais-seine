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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-dark mb-3 md:mb-4">
            Le Parcours
          </h2>
          <div className="w-20 md:w-24 h-1 bg-gold mx-auto mb-4 md:mb-6"></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto px-2">
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
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{distance.name}</h3>
              <p className="text-3xl md:text-4xl font-bold text-gold mb-3 md:mb-4">{distance.distance}</p>
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
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                </svg>
              </div>
              <h4 className="font-bold text-navy-dark mb-2">Départ du semi-marathon</h4>
              <p className="text-gray-700">Pont de Bezons</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-bold text-navy-dark mb-2">Départ du 10 km</h4>
              <p className="text-gray-700">Le Vésinet</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-navy-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
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
