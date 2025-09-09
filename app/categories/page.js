"use client"
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { set, ref } from "firebase/database";
import { db } from "../libs/firebaseConfig";

export default function CategoriesForm() {
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [identify, setIdentify] = useState("");
  const [code, setCode] = useState("");
  const [tips, setTips] = useState("");
  const [algorithm, setAlgorithm] = useState("");
  const [timeabout, setTimeabout] = useState("");
  const [timeans, setTimeans] = useState("");
  const [spacebout, setSpaceabout] = useState("");
  const [Spaceans, setSpaceans] = useState("");
  const [whenandwhere, setWhenandwhere] = useState("");
  const [remember, setRemember] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const safeTopic = topic.replace(/\s+/g, "_");

      const CategoriesRef = ref(db, `Categories/${safeTopic}`);
      await set(CategoriesRef, {
        topic,
        summary,
        identify,
        code,
        tips,
        algorithm,
        timeabout,
        timeans,
        spacebout,
        Spaceans,
        whenandwhere,
        remember,
        createdAt: new Date().toISOString(),
      });

      // Reset fields
      setTopic("");
      setSummary("");
      setIdentify("");
      setCode("");
      setTips("");
      setAlgorithm("");
      setTimeabout("");
      setTimeans("");
      setSpaceabout("");
      setSpaceans("");
      setWhenandwhere("");
      setRemember("");
      setSaved(true);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl grid md:grid-cols-2 gap-8"
      >
        {/* Form Section */}
        <div className="shadow-2xl border border-gray-700 bg-gray-950/60 backdrop-blur-xl rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-center text-3xl font-bold text-white tracking-wide mb-8">
            📘 Create DSA Documentation
          </h2>

          <form className="grid gap-8" onSubmit={handleSubmit}>
            {/* Topic */}
            <Section label="📌 Topic Name">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter the topic"
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </Section>

            {/* Summary */}
            <Section label="📝 Summary">
              <textarea
                placeholder="Write a short summary"
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </Section>

            {/* Identification */}
            <Section label="🔍 How to Identify This Problem">
              <textarea
                placeholder="Explain how to identify this problem"
                value={identify}
                onChange={(e) => setIdentify(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </Section>

            {/* Code Editor */}
            <Section label="💻 Base Code">
              <div className="border border-gray-700 rounded-xl overflow-hidden w-full">
                <Editor
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  height="200px"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                  }}
                />
              </div>
            </Section>

            {/* Tips */}
            <Section label="💡 Tips & Tricks">
              <textarea
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                placeholder="Add tips and tricks"
                rows={3}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </Section>

            {/* Algorithm */}
            <Section label="⚙️ General Algorithm">
              <textarea
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                placeholder="Outline the general algorithm"
                rows={4}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </Section>

            {/* Complexity */}
            <Section label="⏳ Time Complexity">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={timeabout}
                  onChange={(e) => setTimeabout(e.target.value)}
                  placeholder="Description"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  value={timeans}
                  onChange={(e) => setTimeans(e.target.value)}
                  placeholder="e.g., O(n log n)"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </Section>

            <Section label="💾 Space Complexity">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={spacebout}
                  onChange={(e) => setSpaceabout(e.target.value)}
                  placeholder="Description"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  value={Spaceans}
                  onChange={(e) => setSpaceans(e.target.value)}
                  placeholder="e.g., O(1)"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </Section>

            {/* Use Case */}
            <Section label="📍 When & Where to Use">
              <textarea
                value={whenandwhere}
                onChange={(e) => setWhenandwhere(e.target.value)}
                placeholder="Explain real-world scenarios"
                rows={3}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </Section>

            {/* Remember Notes */}
            <Section label="🧠 Key Points to Remember">
              <textarea
                value={remember}
                onChange={(e) => setRemember(e.target.value)}
                placeholder="Add important notes"
                rows={3}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </Section>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center pt-6"
            >
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-xl text-lg font-medium shadow-lg transition ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                {loading ? "Saving..." : saved ? "✅ Saved!" : "Save Problem"}
              </button>
            </motion.div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="hidden md:block shadow-2xl border border-gray-700 bg-gray-950/40 backdrop-blur-xl rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
          <h3 className="text-xl font-semibold text-white mb-4">🔎 Live Preview</h3>
          <div className="space-y-4 text-gray-300">
            <p><strong>Topic:</strong> {topic || "—"}</p>
            <p><strong>Summary:</strong> {summary || "—"}</p>
            <p><strong>Identify:</strong> {identify || "—"}</p>
            <p><strong>Algorithm:</strong> {algorithm || "—"}</p>
            <p><strong>Time Complexity:</strong> {timeans || "—"}</p>
            <p><strong>Space Complexity:</strong> {Spaceans || "—"}</p>
            <p><strong>Tips:</strong> {tips || "—"}</p>
            <p><strong>Use Cases:</strong> {whenandwhere || "—"}</p>
            <p><strong>Remember:</strong> {remember || "—"}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div className="grid gap-2">
      <label className="text-gray-300 font-medium">{label}</label>
      {children}
    </div>
  );
}
