"use client"
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DSAForm() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl text-center"
      >
        {/* Hero Section */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg"
        >
          Master DSA with <span className="text-indigo-400">Confidence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
        >
          Unlock the secrets of Data Structures & Algorithms with interactive lessons,
          coding challenges, and personalized guidance. Build strong fundamentals and
          crack your dream coding interview.
        </motion.p>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Interactive Playground",
              desc: "Solve problems live in your browser with instant feedback.",
            },
            {
              title: "Step-by-Step Roadmap",
              desc: "Structured plan from basics to advanced algorithms.",
            },
            {
              title: "Interview Ready",
              desc: "Ace technical interviews with curated practice sets.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.2, duration: 0.6 }}
              className="bg-gray-800/50 rounded-2xl shadow-lg p-6 border border-gray-700 hover:border-indigo-400 hover:shadow-indigo-400/20 transition"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-12"
        >
          <button
            onClick={() => router.push("/home")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/30 transition"
          >
            Start Learning →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
