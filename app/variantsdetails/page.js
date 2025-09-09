"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { onValue, ref } from "firebase/database";
import { db } from "@/app/libs/firebaseConfig";
import { motion } from "framer-motion";
import { Copy, Check, LayoutList } from "lucide-react";

// Component to render text with line breaks for '+'
function TextWithLineBreaks({ text }) {
  if (!text) return <span>—</span>;
  const lines = text.split("+").map((line) => line.trim());
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => (
        <p key={idx} className="leading-relaxed">
          {line}
        </p>
      ))}
    </div>
  );
}

// Code block with copy functionality
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
      <pre className="overflow-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-5 text-sm font-mono text-green-300 rounded-xl">
        <code className="whitespace-pre-wrap break-words">
          {code || "// No code provided"}
        </code>
      </pre>
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

// Section wrapper
function Section({ title, children }) {
  return (
    <div
      id={title.replace(/\s+/g, "-").toLowerCase()}
      className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-3 transition-all hover:shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
}

// Sidebar navigation
function Sidebar({ sections }) {
  return (
    <div className="sticky top-20 h-fit bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-md">
      <h3 className="flex items-center gap-2 font-bold mb-4 text-gray-700 dark:text-gray-200">
        <LayoutList className="w-5 h-5 text-indigo-500" /> Sections
      </h3>
      <ul className="space-y-2">
        {sections.map((sec, i) => (
          <li key={i}>
            <a
              href={`#${sec.replace(/\s+/g, "-").toLowerCase()}`}
              className="block px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-indigo-600 hover:text-white transition"
            >
              {sec}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Main page
export default function VariantsDetailsPage() {
  const sp = useSearchParams();
  const topicParam = sp.get("text") || "";
  const maintopicParm = sp.get("topic") || "";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const safeKey = topicParam.replace(/\s+/g, "_");

  useEffect(() => {
    if (!safeKey) return;
    const r = ref(db, `Categories/${maintopicParm}/Variants/${safeKey}`);
    const unsub = onValue(
      r,
      (snap) => {
        const val = snap.val();
        if (!val) {
          setNotFound(true);
        } else {
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
  }, [safeKey]);

  // List of section titles
  const sectionTitles = [
    "Summary",
    "How to Identify This Problem",
    "Base Code",
    "Tricks & Tips",
    "General Algorithm",
    "Time Complexity",
    "Space Complexity",
    "When & Where to Use",
    "Tips & Important Points",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-200 font-sans">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        {loading && (
          <p className="text-gray-400 text-center text-lg animate-pulse">
            Loading...
          </p>
        )}
        {notFound && !loading && (
          <p className="text-red-500 font-bold text-center text-lg">
            ❌ No data found for "{topicParam}"
          </p>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            {/* Title */}
            <div className="text-center py-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg">
              <h1 className="text-4xl font-extrabold tracking-tight">
                {topicParam.replace("+", "")}
              </h1>
              {data.createdAt && (
                <p className="text-sm opacity-80">
                  📅 Published on{" "}
                  {new Date(data.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Layout with Sidebar + Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="hidden md:block md:col-span-1">
                <Sidebar sections={sectionTitles} />
              </div>

              {/* Content */}
              <div className="md:col-span-3 space-y-10">
                <Section title="Summary">
                  <TextWithLineBreaks text={data.summary} />
                </Section>

                <Section title="How to Identify This Problem">
                  <TextWithLineBreaks text={data.identify} />
                </Section>

                <Section title="Base Code">
                  <CodeBlock code={data.code} />
                </Section>

                <Section title="Tricks & Tips">
                  <TextWithLineBreaks text={data.tips} />
                </Section>

                <Section title="General Algorithm">
                  <TextWithLineBreaks text={data.algorithm} />
                </Section>

                <Section title="Time Complexity">
                  <p>
                    <strong>Answer:</strong>{" "}
                    <code>{data.timeans || "—"}</code>
                  </p>
                </Section>

                <Section title="Space Complexity">
                  <p>
                    <strong>Answer:</strong>{" "}
                    <code>{data.Spaceans || "—"}</code>
                  </p>
                </Section>

                <Section title="When & Where to Use">
                  <TextWithLineBreaks text={data.whenandwhere} />
                </Section>

                <Section title="Tips & Important Points">
                  <TextWithLineBreaks text={data.remember} />
                </Section>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
