"use client";

import { motion } from "framer-motion";
import EmailForm from "./EmailForm";
import Image from "next/image";
import Link from "next/link";

export type HeroRace = { name: string; priceCents: number | null; tierLabel: string | null; soldOut: boolean };

function euros(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100);
}

export default function Hero({
  registrationOpen = false,
  races = [],
}: {
  registrationOpen?: boolean;
  races?: HeroRace[];
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-running.jpg"
          alt="Coureurs sur les quais de Seine"
          fill
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/85 via-navy-dark/70 to-navy-dark/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-32 md:py-40">
        <div className="flex flex-col items-center text-center">
          {/* Titre principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 md:mb-10 w-full"
          >
            <h1 className="display-mega text-white text-shadow-brutal leading-[0.9]">
              <span className="block">LE SEMI DES</span>
              <span className="block text-gradient-seine">QUAIS DE SEINE</span>
            </h1>
          </motion.div>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-4xl lg:text-5xl text-white font-bold mb-6 md:mb-8 uppercase tracking-wider font-bebas"
          >
            <span className="text-gradient-gold">Première édition</span> • 29 août 2027
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-12 md:mb-16 max-w-4xl mx-auto px-4"
          >
            Vivez une expérience unique le long des quais de la Seine.<br/>
            <span className="font-bold">Semi-marathon (21,1 km)</span> ou <span className="font-bold">10 km</span>
          </motion.p>

          {/* Formulaire email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-3xl mx-auto mb-12 md:mb-16 px-4"
            id="inscription"
          >
            {registrationOpen ? (
              <div className="flex flex-col items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Les inscriptions sont ouvertes
                </span>
                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center rounded-2xl bg-gold px-12 py-4 text-lg font-bold text-navy-dark shadow-lg transition hover:bg-gold-light hover:shadow-xl md:px-16 md:py-5 md:text-xl"
                >
                  Je m&rsquo;inscris
                </Link>
                {races.length > 0 && (
                  <p className="text-sm text-white/80 md:text-base">
                    {races
                      .map((r) =>
                        r.soldOut || r.priceCents == null ? `${r.name} : complet` : `${r.name} ${euros(r.priceCents)}`,
                      )
                      .join(" · ")}
                    {races.some((r) => r.tierLabel && !r.soldOut) && (
                      <span className="block text-xs text-gold md:text-sm">
                        Tarif « {races.find((r) => r.tierLabel && !r.soldOut)?.tierLabel} »
                      </span>
                    )}
                  </p>
                )}
              </div>
            ) : (
              <EmailForm variant="hero" />
            )}
          </motion.div>

          {/* Feature cards - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden md:block w-full max-w-6xl mx-auto px-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Card 1 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="flex flex-col items-center gap-5 text-center">
                  <div className="bg-gold p-5 rounded-full shadow-lg">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-white font-semibold text-sm md:text-lg leading-tight">
                    Parcours exceptionnel
                  </span>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="flex flex-col items-center gap-5 text-center">
                  <div className="bg-seine-blue p-5 rounded-full shadow-lg">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-white font-semibold text-sm md:text-lg leading-tight">
                    Accessible depuis Paris
                  </span>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="flex flex-col items-center gap-5 text-center">
                  <div className="bg-gold p-5 rounded-full shadow-lg">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                    </svg>
                  </div>
                  <span className="text-white font-semibold text-sm md:text-lg leading-tight">
                    Ambiance conviviale
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-3 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
