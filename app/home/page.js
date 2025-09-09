"use client"

import { get, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../libs/firebaseConfig";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  const items = ["Array", "LinkedList", "Stack"];

  const [topicBar, setTopicBar] = useState(items);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await get(ref(db, "Categories"));
      if (snapshot.exists()) {
        setTopicBar(Object.keys(snapshot.val()));
      }
    };
    fetchCategories();
  }, []);

  // ✅ Removed ": string" type annotation
  const handleClick = (item) => {
    router.push(`/categoriesdetails?text=${encodeURIComponent(item)}`);
  };

  const filteredTopics = topicBar.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          🚀 Explore Data Structures
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Strengthen your problem-solving skills with hands-on categories, 
          curated problems, and step-by-step explanations.
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="🔍 Search a topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {filteredTopics.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(item)}
            className="cursor-pointer p-6 rounded-xl bg-gray-800 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition text-center"
          >
            <h3 className="text-xl font-semibold mb-2">
              {item.replace("+", "")}
            </h3>
            <p className="text-gray-300 text-sm">
              Master the {item.replace("+", "")} with examples & problems.
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Motivational Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 text-center bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-4 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold">“DSA is the key to cracking interviews 🚀”</h2>
        <p className="mt-2 text-gray-100">Start your journey today and unlock your potential!</p>
      </motion.div>
    </div>
  );
}
