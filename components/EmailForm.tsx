"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface EmailFormProps {
  variant?: "hero" | "inline" | "footer";
  className?: string;
}

export default function EmailForm({ variant = "inline", className = "" }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Merci ! Vous recevrez votre code de réduction de 10% dès l'ouverture des inscriptions.");
        setEmail("");

        // Reset after 5 seconds
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        throw new Error("Erreur lors de l'inscription");
      }
    } catch {
      setStatus("error");
      setMessage("Une erreur est survenue. Veuillez réessayer.");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  const isHero = variant === "hero";
  const isFooter = variant === "footer";

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className={`flex ${isHero ? "flex-col sm:flex-row" : "flex-col sm:flex-row"} gap-4 ${isHero ? "justify-center" : ""}`}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            required
            disabled={status === "loading" || status === "success"}
            className={`${isHero ? "flex-1 max-w-md" : "flex-1"} ${
              isHero ? "px-6 py-4 md:py-5" : "px-4 py-3"
            } rounded-2xl border-2 ${
              isHero ? "bg-white/95 backdrop-blur-sm border-white/40" : "border-gray-300 bg-white"
            } focus:outline-none transition-colors text-gray-900 placeholder-gray-500 ${
              isHero ? "text-base md:text-lg" : "text-base"
            } ${status === "success" ? "bg-green-50" : ""} ${
              isHero ? "focus:border-white" : "focus:border-primary"
            }`}
          />
          <motion.button
            type="submit"
            disabled={status === "loading" || status === "success"}
            whileHover={{ scale: status === "loading" || status === "success" ? 1 : 1.05 }}
            whileTap={{ scale: status === "loading" || status === "success" ? 1 : 0.95 }}
            className={`${isHero ? "px-10 py-4 md:px-14 md:py-5" : "px-6 py-3"} rounded-2xl font-semibold transition-all whitespace-nowrap ${
              isHero
                ? "bg-gold hover:bg-gold-light text-navy-dark"
                : isFooter
                ? "bg-gold hover:bg-gold-light text-navy-dark"
                : "bg-navy-dark hover:bg-navy-medium text-white"
            } ${
              status === "loading" || status === "success"
                ? "opacity-50 cursor-not-allowed"
                : "shadow-lg hover:shadow-xl"
            } ${isHero ? "text-base md:text-lg" : "text-base"}`}
          >
            {status === "loading" ? "Envoi..." : status === "success" ? "✓ Inscrit !" : "Être informé"}
          </motion.button>
        </div>
      </form>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 text-sm ${
            status === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </motion.p>
      )}

      {status === "idle" && variant === "hero" && (
        <div className="mt-4">
          <p className="text-xs md:text-sm flex items-center justify-center gap-2 text-white/70">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
              <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
            </svg>
            <span className="whitespace-nowrap">
              Remise <span className="text-sm md:text-base text-gold font-bold">-10%</span> dès l&apos;inscription
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
