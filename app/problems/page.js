"use client"
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { ref, set, get } from "firebase/database";
import { db } from "@/app/libs/firebaseConfig";

export default function ProblemForm() {
  const [topic, setTopic] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [description, setDescription] = useState("");
  const [examples, setExamples] = useState("");
  const [code, setCode] = useState("");
  const [patternUsed, setPatternUsed] = useState("");
  const [moreInfo, setMoreInfo] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [dryRun, setDryRun] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await get(ref(db, "Categories"));
      if (snapshot.exists()) setCategories(Object.keys(snapshot.val()));
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic) return alert("Please select a category!");

    try {
      const problemRef = ref(db, `Categories/${topic}/Problems/${problemStatement}`);
      await set(problemRef, {
        topic,
        problemStatement,
        description,
        examples,
        code,
        patternUsed,
        moreInfo,
        timeComplexity,
        spaceComplexity,
        dryRun,
        createdAt: new Date().toISOString(),
      });
      alert("Problem submitted successfully!");
      // Reset form
      setProblemStatement("");
      setDescription("");
      setExamples("");
      setCode("");
      setPatternUsed("");
      setMoreInfo("");
      setTimeComplexity("");
      setSpaceComplexity("");
      setDryRun("");
    } catch (err) {
      console.error(err);
      alert("Error submitting problem.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-6xl">
        <div className="shadow-2xl border border-gray-700 bg-gray-950/60 backdrop-blur-xl rounded-2xl p-6">
          <h2 className="text-center text-2xl font-bold text-white tracking-wide mb-6">📘 Submit a Coding Problem</h2>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <label className="text-gray-300 font-medium text-sm">Category</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500">
                <option value="">Select a category</option>
                {categories.map((key) => (<option key={key} value={key}>{key}</option>))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <label className="text-gray-300 font-medium text-sm">Problem Statement</label>
              <input type="text" value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} placeholder="Problem Statement" className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500" required />
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Description" className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500" required />
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">Examples</label>
              <textarea value={examples} onChange={(e) => setExamples(e.target.value)} rows={4} placeholder="Examples" className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">Code</label>
              <div className="border border-gray-700 rounded-xl overflow-hidden w-full">
                <Editor value={code} onChange={(value) => setCode(value || "")} height="300px" defaultLanguage="javascript" theme="vs-dark" options={{ minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false, wordWrap: "on" }} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <label className="text-gray-300 font-medium text-sm">Pattern Used</label>
              <input type="text" value={patternUsed} onChange={(e) => setPatternUsed(e.target.value)} placeholder="Pattern Used" className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">More Information</label>
              <textarea value={moreInfo} onChange={(e) => setMoreInfo(e.target.value)} rows={3} placeholder="More Info" className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <label className="text-gray-300 font-medium text-sm">Time Complexity</label>
              <input type="text" value={timeComplexity} onChange={(e) => setTimeComplexity(e.target.value)} placeholder="O(n)" className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <label className="text-gray-300 font-medium text-sm">Space Complexity</label>
              <input type="text" value={spaceComplexity} onChange={(e) => setSpaceComplexity(e.target.value)} placeholder="O(1)" className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">Dry Run / Notes</label>
              <textarea value={dryRun} onChange={(e) => setDryRun(e.target.value)} rows={4} placeholder="Dry Run / Notes" className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500" />
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex justify-center pt-6">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl shadow-lg text-lg font-medium">
                Submit Problem
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
