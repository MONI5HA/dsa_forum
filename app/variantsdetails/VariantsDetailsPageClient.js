// Client-side component
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { onValue, ref } from "firebase/database";
import { db } from "@/app/libs/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Clock,
  Cpu,
  Lightbulb,
  BookOpen,
  LayoutList,
} from "lucide-react";
import Editor from "@monaco-editor/react";

// --- Utilities ---
function TextWithLineBreaks({ text }) {
  if (!text) return <span className="italic text-gray-400">—</span>;
  return (
    <div className="space-y-2">
      {text.split("+").map((line, i) => (
        <p key={i} className="leading-relaxed">{line.trim()}</p>
      ))}
    </div>
  );
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  return (
    <div className="relative my-6 rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <Editor
        height="300px"
        defaultLanguage="cpp"
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
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-gray-800/80 px-3 py-1 text-xs text-gray-300 hover:bg-gray-700 transition-all"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

// --- Section wrapper ---
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

// --- Slider ---
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
        <button onClick={prev} className="px-4 py-2 bg-gray-700 text-white rounded-lg">
          ⬅ Prev
        </button>
        <span className="text-gray-400 text-sm self-center">
          {index + 1} / {sections.length}
        </span>
        <button onClick={next} className="px-4 py-2 bg-gray-700 text-white rounded-lg">
          Next ➡
        </button>
      </div>
    </div>
  );
}

// --- Sidebar ---
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

// --- Main Client Component ---
export default function VariantsDetailsPageClient(){
  const sp = useSearchParams();
  const router = useRouter();
  const topicParam = sp.get("text") || "";
  const maintopicParam = sp.get("topic") || "";
  const safeKey = topicParam.replace(/\s+/g, "_");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!safeKey) return;
    const r = ref(db, `Categories/${maintopicParam}/Variants/${safeKey}`);
    const unsub = onValue(
      r,
      (snap) => {
        const val = snap.val();
        if (!val) setNotFound(true);
        else {
          setData(val);
          setNotFound(false);
        }
        setLoading(false);
      },
      () => {
        setLoading(false);
        setNotFound(true);
      }
    );
    return () => unsub();
  }, [safeKey, maintopicParam]);

  const handleSubmit = (item) => {
    router.push(
      `/variantsdetails?text=${encodeURIComponent(item)}&topic=${encodeURIComponent(
        maintopicParam
      )}`
    );
  };

  const sections = data
    ? [
        { title: "Summary", content: <Section title="Summary" icon={BookOpen}><TextWithLineBreaks text={data.summary} /></Section> },
        { title: "How to Identify", content: <Section title="How to Identify This Problem" icon={Lightbulb}><TextWithLineBreaks text={data.identify} /></Section> },
        { title: "Base Code", content: <Section title="Base Code" icon={Cpu}><CodeBlock code={data.code} /></Section> },
        { title: "Tricks & Tips", content: <Section title="Tricks & Tips" icon={Lightbulb}><TextWithLineBreaks text={data.tips} /></Section> },
        { title: "Algorithm", content: <Section title="General Algorithm" icon={Cpu}><TextWithLineBreaks text={data.algorithm} /></Section> },
        { title: "Time Complexity", content: <Section title="Time Complexity" icon={Clock}><TextWithLineBreaks text={data.timeabout} /><p><strong>Answer:</strong> <code className="text-indigo-600">{data.timeans || "—"}</code></p></Section> },
        { title: "Space Complexity", content: <Section title="Space Complexity" icon={Clock}><TextWithLineBreaks text={data.spaceabout || data.spacebout} /><p><strong>Answer:</strong> <code className="text-indigo-600">{data.Spaceans || "—"}</code></p></Section> },
        { title: "When & Where", content: <Section title="When & Where to Use" icon={BookOpen}><TextWithLineBreaks text={data.whenandwhere} /></Section> },
        { title: "Important Points", content: <Section title="Tips & Important Points" icon={Lightbulb}><TextWithLineBreaks text={data.remember} /></Section> },
        data.Variants && { title: "Variants", content: <Section title="Variants" icon={BookOpen}><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">{Object.keys(data.Variants).map((item, key) => (<motion.button key={key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSubmit(item)} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-lg shadow-md hover:opacity-90 transition duration-200 flex items-center justify-between"><span className="font-medium">{item.replace(/_/g, " ")}</span><svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></motion.button>))}</div></Section> }
      ].filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0a0a0a] dark:to-[#111] text-gray-900 dark:text-gray-200 font-sans">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        {loading && <p className="text-gray-400 text-center text-lg animate-pulse">Loading...</p>}
        {notFound && !loading && <p className="text-red-500 font-bold text-center text-lg">❌ No data found for "{topicParam}"</p>}
        {data && (
          <>
            <div className="text-center space-y-4 py-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg">
              <h1 className="text-4xl font-extrabold tracking-tight">{topicParam.replace("+", "")}</h1>
              {data.createdAt && <p className="text-sm opacity-80">📅 Published on {new Date(data.createdAt).toLocaleDateString()}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="hidden md:block md:col-span-1">
                <Sidebar sections={sections} index={index} setIndex={setIndex} />
              </div>
              <div className="md:col-span-3">
                <SectionSlider sections={sections} index={index} setIndex={setIndex} />
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={() => router.back()} className="mt-8 px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition">⬅ Back</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
