"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/app/libs/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Cpu, Clock, FileText, Lightbulb, LayoutList } from "lucide-react";
import Editor from "@monaco-editor/react";

// --- Utilities ---
function TextWithLineBreaks({ text }) {
  if (!text) return <span className="italic text-gray-400">—</span>;
  return (
    <div className="space-y-2">
      {text.split("\n").map((line, i) => (
        <p key={i} className="leading-relaxed">{line.trim()}</p>
      ))}
    </div>
  );
}

function CodeBlock({ code }) {
  return (
    <div className="relative my-6 rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <Editor
        height="300px"
        defaultLanguage="javascript"
        value={code || "// No code provided"}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-3">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
        {Icon && <Icon className="w-6 h-6 text-indigo-500" />}
        {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
}

function SectionSlider({ sections, index, setIndex }) {
  const next = () => setIndex((i) => (i + 1) % sections.length);
  const prev = () => setIndex((i) => (i - 1 + sections.length) % sections.length);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4 }}
          className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg space-y-4"
        >
          {sections[index].content}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between mt-6">
        <button
          onClick={prev}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
        >
          ⬅ Prev
        </button>
        <span className="text-gray-400 text-sm self-center">
          {index + 1} / {sections.length}
        </span>
        <button
          onClick={next}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

function Sidebar({ sections, index, setIndex }) {
  return (
    <div className="sticky top-20 h-fit bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-md">
      <h3 className="flex items-center gap-2 font-bold mb-4 text-gray-700 dark:text-gray-200">
        <LayoutList className="w-5 h-5 text-indigo-500" /> Sections
      </h3>
      <ul className="space-y-2">
        {sections.map((sec, i) => (
          <li key={i}>
            <button
              onClick={() => setIndex(i)}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                i === index
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {sec.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Main Component ---
export default function ProblemDetailPageClient({ category, problem }) {
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!category || !problem) return;
    const r = ref(db, `Categories/${category}/Problems/${problem}`);
    const unsub = onValue(r, (snap) => {
      const val = snap.val();
      setProblemData(val);
      setLoading(false);
    });
    return () => unsub();
  }, [category, problem]);

  if (loading) return <p className="text-gray-400 text-center mt-10">Loading...</p>;
  if (!problemData) return <p className="text-red-500 font-bold text-center mt-10">❌ Problem not found!</p>;

  // Build sections dynamically
  const sections = [
    { title: "Problem Statement", content: <Section title="Problem Statement" icon={FileText}><TextWithLineBreaks text={problemData.problemStatement} /></Section> },
    problemData.description && { title: "Description", content: <Section title="Description" icon={BookOpen}><TextWithLineBreaks text={problemData.description} /></Section> },
    problemData.examples && { title: "Examples", content: <Section title="Examples" icon={BookOpen}><TextWithLineBreaks text={problemData.examples} /></Section> },
    problemData.code && { title: "Code", content: <Section title="Code" icon={Cpu}><CodeBlock code={problemData.code} /></Section> },
    problemData.patternUsed && { title: "Pattern Used", content: <Section title="Pattern Used" icon={Lightbulb}><TextWithLineBreaks text={problemData.patternUsed} /></Section> },
    problemData.moreInfo && { title: "More Info", content: <Section title="More Info" icon={BookOpen}><TextWithLineBreaks text={problemData.moreInfo} /></Section> },
    problemData.dryrun && { title: "Dry Run / Notes", content: <Section title="Dry Run / Notes" icon={BookOpen}><TextWithLineBreaks text={problemData.dryrun} /></Section> },
    (problemData.timeComplexity || problemData.spaceComplexity) && {
      title: "Complexity",
      content: (
        <Section title="Complexity" icon={Clock}>
          {problemData.timeComplexity && <p><strong>Time:</strong> {problemData.timeComplexity}</p>}
          {problemData.spaceComplexity && <p><strong>Space:</strong> {problemData.spaceComplexity}</p>}
        </Section>
      )
    }
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0a0a0a] dark:to-[#111] text-gray-900 dark:text-gray-200 font-sans">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        <div className="text-center space-y-4 py-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg">
          <h1 className="text-4xl font-extrabold tracking-tight">{problem.replace(/_/g, " ")}</h1>
          {problemData.topic && <p className="text-sm opacity-80">📚 Topic: {problemData.topic}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="hidden md:block md:col-span-1">
            <Sidebar sections={sections} index={index} setIndex={setIndex} />
          </div>
          <div className="md:col-span-3">
            <SectionSlider sections={sections} index={index} setIndex={setIndex} />
          </div>
        </div>
      </div>
    </div>
  );
}
