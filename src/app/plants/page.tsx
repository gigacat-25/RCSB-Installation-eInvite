"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import NoiseTexture from "@/components/NoiseTexture";

// Care guide items
const careGuidelines = [
  {
    number: "1",
    title: "Provide the Right Amount of Sunlight",
    icon: "☀️",
    details: [
      { label: "Full sun (6–8 hours)", value: "Tulsi, lemongrass, neem" },
      { label: "Partial shade (3–5 hours)", value: "Mint, brahmi" },
      { label: "Bright indirect light", value: "Aloe vera (can also tolerate some direct morning sun)" },
    ],
  },
  {
    number: "2",
    title: "Water Properly",
    icon: "💧",
    details: [
      { label: "Check Soil", value: "Water only when the top 2–3 cm of soil feels dry." },
      { label: "Prevention", value: "Avoid overwatering, as it can cause root rot." },
      { label: "Timing", value: "Water early in the morning or late in the evening." },
    ],
  },
  {
    number: "3",
    title: "Use Well-Draining Soil",
    icon: "🌱",
    details: [
      { label: "Potting Mix", value: "40% garden soil, 30% compost/vermicompost, 30% sand/cocopeat." },
      { label: "Core Benefit", value: "Good drainage is essential for healthy roots." },
    ],
  },
  {
    number: "4",
    title: "Fertilize Naturally",
    icon: "🍂",
    details: [
      { label: "Frequency", value: "Use organic fertilizers once every 3–4 weeks." },
      { label: "Recommended Types", value: "Vermicompost, cow manure, homemade compost, banana peel, or vegetable compost (well decomposed)." },
      { label: "Caution", value: "Avoid excessive chemical fertilizers if the plants will be used medicinally." },
    ],
  },
  {
    number: "5",
    title: "Control Pests Naturally",
    icon: "🐛",
    details: [
      { label: "Neem Oil Spray", value: "Spray diluted neem oil every 10–15 days." },
      { label: "Hygiene", value: "Remove damaged leaves." },
      { label: "Airflow", value: "Keep plants well-spaced for good airflow." },
    ],
  },
  {
    number: "6",
    title: "Prune Regularly",
    icon: "✂️",
    details: [
      { label: "Maintenance", value: "Remove dead or yellow leaves." },
      { label: "Bushier Growth", value: "Pinch the tips of herbs like tulsi and mint." },
      { label: "Harvest Rule", value: "Don't remove more than one-third of the plant at a time." },
    ],
  },
  {
    number: "7",
    title: "Protect from Extreme Weather",
    icon: "🌦️",
    details: [
      { label: "Heavy Rain", value: "Ensure pots drain well to prevent waterlogging." },
      { label: "Intense Summer", value: "Provide afternoon shade for delicate herbs." },
      { label: "Wind Protection", value: "Protect young, delicate plants from strong winds." },
    ],
  },
  {
    number: "8",
    title: "Harvest Carefully",
    icon: "🧺",
    details: [
      { label: "Time of Day", value: "Harvest in the morning after the dew has dried." },
      { label: "Tools", value: "Use clean, sharp scissors or pruning shears." },
      { label: "Regrowth", value: "Leave enough leaves on the plant so it can continue growing." },
    ],
  },
];

// Plants care database
interface PlantCare {
  name: string;
  sunlight: string;
  water: string;
  notes: string;
}

const defaultPlants: PlantCare[] = [
  {
    name: "Tulsi",
    sunlight: "Full sun",
    water: "Moderate",
    notes: "Keep soil slightly moist, pinch flowers for more leaves.",
  },
  {
    name: "Aloe Vera",
    sunlight: "Bright sun",
    water: "Low",
    notes: "Water every 2–3 weeks; avoid waterlogging.",
  },
  {
    name: "Mint",
    sunlight: "Partial sun",
    water: "Regular",
    notes: "Keep soil moist; spreads quickly.",
  },
  {
    name: "Lemongrass",
    sunlight: "Full sun",
    water: "Moderate",
    notes: "Trim regularly to encourage new growth.",
  },
  {
    name: "Brahmi",
    sunlight: "Partial shade",
    water: "High",
    notes: "Prefers consistently moist soil.",
  },
];

const secretPlant: PlantCare = {
  name: "Ajwain",
  sunlight: "Full sun",
  water: "Moderate",
  notes: "Water only when the soil begins to dry.",
};

export default function MedicinalPlantsPage() {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Determine plants to show
  const isSecretUnlocked = search.trim().toLowerCase() === "/plant";
  const allAvailablePlants = isSecretUnlocked 
    ? [...defaultPlants, secretPlant] 
    : defaultPlants;

  // Filter based on search query
  const filteredPlants = allAvailablePlants.filter((plant) => {
    if (isSecretUnlocked) {
      return true; // Return all, including Ajwain
    }
    
    // Normal case-insensitive search
    const query = search.toLowerCase();
    return (
      plant.name.toLowerCase().includes(query) ||
      plant.sunlight.toLowerCase().includes(query) ||
      plant.water.toLowerCase().includes(query) ||
      plant.notes.toLowerCase().includes(query)
    );
  });

  const cardClass = "relative overflow-hidden rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/30 backdrop-blur-md p-6 space-y-3 cursor-default shadow-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),inset_0_0_12px_rgba(245,239,200,0.02)]";
  const shimmer = <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F5EFC8]/[0.03] to-transparent pointer-events-none animate-card-shimmer" />;

  const renderGuideCard = (guide: typeof careGuidelines[0]) => (
    <motion.div
      key={guide.number}
      whileHover={{ y: -4, borderColor: "rgba(245, 239, 200, 0.25)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cardClass}
    >
      {shimmer}
      <div className="flex items-start gap-4">
        <div className="relative p-2 rounded-xl bg-[#F5EFC8]/[0.02] border border-[#F5EFC8]/10 flex items-center justify-center text-2xl w-12 h-12 shrink-0">
          <span className="relative z-10">{guide.icon}</span>
        </div>
        <div className="space-y-2 w-full">
          <h3 className="text-base font-serif italic text-transparent-yellow font-medium">
            {guide.number}. {guide.title}
          </h3>
          <div className="space-y-2 text-sm text-[#A5BCD6]/85">
            {guide.details.map((detail, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                <span className="text-white font-normal shrink-0">{detail.label}:</span>
                <span>{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-[#231815] text-[#A5BCD6]/85 font-sans font-light flex flex-col justify-between py-16 px-6 overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-[#F5EFC8]/[0.015] blur-[120px] pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen" />

      <NoiseTexture />

      <div className="max-w-[950px] w-full mx-auto space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ganesha.png"
              alt="Ganesha Emblem"
              className="w-[60px] sm:w-[75px] h-auto object-contain drop-shadow-[0_0_12px_rgba(245,239,200,0.1)] opacity-[0.8]"
            />
          </Link>
          <div className="space-y-1.5 mt-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A5BCD6]/55">UGAMA AARAMBHA 2K26</p>
            <h1 className="text-4xl sm:text-5xl font-serif italic text-transparent-yellow drop-shadow-[0_0_20px_rgba(245,239,200,0.1)]">
              Medicinal Plant Care Guide
            </h1>
            <p className="text-[10px] text-white/40 tracking-wider uppercase">
              How to Treat & Maintain Your Herbs
            </p>
          </div>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#F5EFC8]/35 to-transparent mx-auto mt-4" />
        </div>

        {/* Introduction */}
        <div className="text-center max-w-[700px] mx-auto space-y-4">
          <p className="text-base sm:text-lg leading-relaxed">
            Medicinal plants require thoughtful attention to thrive and maintain their therapeutic properties. 
            Follow this comprehensive guide to establish the perfect environment for your home garden.
          </p>
        </div>

        {/* Section 1: Care Guidelines Grid with Embedded Images */}
        <div className="space-y-12">
          <h2 className="text-xl sm:text-2xl font-light font-sans tracking-widest text-[#A5BCD6]/90 border-b border-[#F5EFC8]/10 pb-3 uppercase flex items-center justify-between">
            <span>Essential Care Rules</span>
            <span className="w-10 h-[1px] bg-[#F5EFC8]/10" />
          </h2>

          {/* Group 1: Sunlight & Water */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careGuidelines.slice(0, 2).map(renderGuideCard)}
            </div>
            
            {/* Sunlight & Water Banner Image */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[250px] sm:h-[350px] rounded-2xl overflow-hidden border border-[#F5EFC8]/15 shadow-2xl group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/plant_care_sunlight_water.png" 
                alt="Nurturing plants with sunlight and water" 
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#231815] via-[#231815]/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-serif italic text-transparent-yellow font-medium">1 & 2. Nurturing with Natural Elements</h3>
                <p className="text-xs sm:text-sm text-[#A5BCD6]/80 max-w-[600px] mt-1 font-light leading-relaxed">
                  Balancing bright, clean sunlight and checked soil moisture prevents roots from rotting while building the essential plant oils needed for medicinal applications.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Group 2: Soil & Fertilizer */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careGuidelines.slice(2, 4).map(renderGuideCard)}
            </div>

            {/* Soil & Fertilizer Banner Image */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[250px] sm:h-[350px] rounded-2xl overflow-hidden border border-[#F5EFC8]/15 shadow-2xl group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/plant_care_soil_fertilizer.png" 
                alt="Well-draining potting soil and organic compost mix" 
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#231815] via-[#231815]/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-serif italic text-transparent-yellow font-medium">3 & 4. Building a Nutrient-Rich Foundation</h3>
                <p className="text-xs sm:text-sm text-[#A5BCD6]/80 max-w-[600px] mt-1 font-light leading-relaxed">
                  A well-draining soil structure containing sand and compost paired with natural, chemical-free vermicompost feeding keeps herbs clean and safe for home remedy preparations.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Group 3: Pest Control & Pruning */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careGuidelines.slice(4, 6).map(renderGuideCard)}
            </div>

            {/* Pest Control & Pruning Banner Image */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[250px] sm:h-[350px] rounded-2xl overflow-hidden border border-[#F5EFC8]/15 shadow-2xl group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/plant_care_pests_pruning.png" 
                alt="Trimming medicinal herb leaves and controlling pests naturally" 
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#231815] via-[#231815]/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-serif italic text-transparent-yellow font-medium">5 & 6. Natural Pest Protection & Pruning</h3>
                <p className="text-xs sm:text-sm text-[#A5BCD6]/80 max-w-[600px] mt-1 font-light leading-relaxed">
                  Remove damaged leaves regularly and prune tips to encourage bushier growth. Protect the plants from common pests with diluted organic neem oil sprays rather than harsh chemical pesticides.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Group 4: Extreme Weather & Harvesting */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careGuidelines.slice(6, 8).map(renderGuideCard)}
            </div>

            {/* Weather & Harvesting Banner Image */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[250px] sm:h-[350px] rounded-2xl overflow-hidden border border-[#F5EFC8]/15 shadow-2xl group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/plant_care_weather_harvesting.png" 
                alt="Harvested fresh herbs with dew drops" 
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#231815] via-[#231815]/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-serif italic text-transparent-yellow font-medium">7 & 8. Weather Protection & Careful Harvesting</h3>
                <p className="text-xs sm:text-sm text-[#A5BCD6]/80 max-w-[600px] mt-1 font-light leading-relaxed">
                  Ensure pots are draining during rainstorms and shade delicate herbs during harsh summer peaks. When harvesting, use clean scissors after dew dries, leaving enough leaves to foster continuous growth.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section 2: Interactive Plant Database */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5EFC8]/10 pb-3">
            <h2 className="text-xl sm:text-2xl font-light font-sans tracking-widest text-[#A5BCD6]/90 uppercase">
              Common Medicinal Plants
            </h2>
            
            {/* Search Box */}
            <div className="relative w-full sm:max-w-[320px]">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5BCD6]/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search plants or type a code..."
                value={search}
                onChange={handleSearchChange}
                className="w-full bg-[#231815]/50 border border-[#F5EFC8]/12 rounded-full pl-10 pr-4 py-2.5 text-sm text-[#F5EFC8] placeholder:text-white/20 focus:outline-none focus:border-[#F5EFC8]/35 transition-colors font-sans font-light"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#F5EFC8]/15 bg-[#231815]/30 backdrop-blur-md shadow-lg">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#F5EFC8]/15 bg-[#F5EFC8]/[0.02]">
                  <th className="p-4 font-sans font-normal uppercase tracking-wider text-xs text-[#A5BCD6]/60">Plant</th>
                  <th className="p-4 font-sans font-normal uppercase tracking-wider text-xs text-[#A5BCD6]/60">Sunlight</th>
                  <th className="p-4 font-sans font-normal uppercase tracking-wider text-xs text-[#A5BCD6]/60">Water</th>
                  <th className="p-4 font-sans font-normal uppercase tracking-wider text-xs text-[#A5BCD6]/60">Care Notes</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filteredPlants.map((plant) => {
                    const isSecret = plant.name === "Ajwain";
                    return (
                      <motion.tr
                        key={plant.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`border-b border-[#F5EFC8]/10 hover:bg-[#F5EFC8]/[0.01] transition-colors ${
                          isSecret ? "bg-emerald-950/10 border-emerald-900/30" : ""
                        }`}
                      >
                        <td className="p-4 font-serif italic text-transparent-yellow text-base font-medium flex items-center gap-2">
                          {plant.name}
                          {isSecret && (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-sans uppercase font-semibold text-emerald-400 tracking-wider border border-emerald-500/20 animate-pulse">
                              Secret Unlocked
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-sans text-white/90">{plant.sunlight}</td>
                        <td className="p-4 font-sans text-white/90">{plant.water}</td>
                        <td className="p-4 font-sans text-[#A5BCD6]/90 leading-relaxed">{plant.notes}</td>
                      </motion.tr>
                    );
                  })}
                  {filteredPlants.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-white/40 font-sans italic font-light">
                        No plants match your search query.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Secret hint banner when not unlocked */}
          {!isSecretUnlocked && (
            <div className="text-center pt-2">
              <p className="text-[11px] font-mono text-[#A5BCD6]/30 uppercase tracking-widest">
                💡 Psst... Type <span className="text-[#F5EFC8]/50">/plant</span> in the search bar to reveal secret knowledge.
              </p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center pt-8">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-full border border-[#F5EFC8]/35 bg-transparent hover:bg-[#F5EFC8]/5 text-[#F5EFC8] font-sans text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              Back to Invitation
            </motion.button>
          </Link>
        </div>

      </div>

      {/* Footer */}
      <div className="pt-20 text-center">
        <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#A5BCD6]/25 font-light">
          Rotaract Club of Swarna Bengaluru · Rotaract Club of Bengaluru Nava Chaitanya
        </p>
      </div>
    </div>
  );
}
