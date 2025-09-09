"use client"
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { use, useEffect, useState } from "react";
import { get, set, ref } from "firebase/database";
import { db } from "../libs/firebaseConfig";

export default function VariantsForm() {
  const [topic,setTopic] = useState("")
  const [summary,setSummary]=useState("")
  const [identify , setIdentify]=useState("")
  const [code,setCode] = useState("")
  const [tips,setTips] = useState("")
  const [algorithm,setAlgorithm] = useState("")
 const [ variants,setVariants] = useState("")
  const [timeans ,setTimeans]=useState("")

  const [Spaceans ,setSpaceans]=useState("")
  const [whenandwhere , setWhenandwhere] = useState("")
  const [remember,setRemember] = useState("")

  const [categories,setCategoies] = useState([])

  useEffect(()=>{
    const fetchCategories = async ()=>{
        const snapshot = await get(ref(db,"Categories"));
        if (snapshot.exists()){
            setCategoies(Object.keys(snapshot.val()));

        }

    };
    fetchCategories()
  },[])

  const handleSubmit= async(e)=>{
    e.preventDefault()

    try{
      const VariantsRef = ref(db,`Categories/${topic}/Variants/${variants}`)
      await set(VariantsRef,{
        topic,
        summary,
        variants,
        identify,
        code,
        tips,
        algorithm,

        timeans,
  
        Spaceans,
        whenandwhere,
        remember,
        createdAt: new Date().toISOString()
        
      });
      console.log(code)
      setTopic("")
      setSummary("")
      setIdentify("")
      setCode("")
      setTips("")
      setVariants("")
      setAlgorithm("")
   
      setTimeans("")

      setSpaceans("")
      setWhenandwhere("")
      setRemember("")


    }
    catch(e){
      console.log(e);

    }

  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
      >
        {/* Card Wrapper */}
        <div className="shadow-2xl border border-gray-700 bg-gray-950/60 backdrop-blur-xl rounded-2xl p-6">
          {/* Header */}
          <h2 className="text-center text-2xl font-bold text-white tracking-wide mb-6">
            📘 Categories Variants Types
          </h2>

          <form className="grid gap-8" onSubmit={handleSubmit}>
            {/*Categories*/}
            <div className="grid md:grid-cols-2 gap-6 items-center">

             <label className="text-gray-300 font-medium text-sm">Categories Name</label>
  <select
    value={topic}
    onChange={(e) => setTopic(e.target.value)}
    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
  >
    <option value="">Select a topic</option>
   {categories.map((key) => (
      <option key={key} value={key}>
        {key}
      </option>
    ))}

    </select>
            </div>
            {/* Topic */}
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <label className="text-gray-300 font-medium text-sm">Variant Topic Name</label>
              <input
                type="text"
                value={variants}
                onChange={(e)=>setVariants(e.target.value)}
                placeholder="Enter the topic"
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Summary */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">Variant Summary</label>
              <textarea
                placeholder="Write a short summary"
                rows={4}
                value={summary}
                onChange={(e)=>setSummary(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* How to Identify */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">Sample List of problems</label>
              <textarea
                placeholder="Explain how to identify this problem"
                value={identify}
                onChange={(e)=>setIdentify(e.target.value)}                
                rows={5}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Base Code */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">Base Code</label>
              <div className="border border-gray-700 rounded-xl overflow-hidden w-full">
                <Editor
                value={code}
                onChange={(value) => setCode(value || "")}             
                  height="300px"
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
            </div>

            {/* Tricks & Tips */}
           

            {/* General Algorithm */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">General Algorithm</label>
              <textarea
                value={algorithm}
                onChange={(e)=>setAlgorithm(e.target.value)}              
                placeholder="Outline the general algorithm"
                rows={5}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
             <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">Tricks & Tips to Master</label>
              <textarea
                value={tips}
                onChange={(e)=>setTips(e.target.value)}              
                placeholder="Add tips and tricks"
                rows={4}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

           

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <label className="text-gray-300 font-medium text-sm">Time Complexity (Answer)</label>
              <input
                value={timeans}
                onChange={(e)=>setTimeans(e.target.value)}
                placeholder="e.g., O(log n)"
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <label className="text-gray-300 font-medium text-sm">Space Complexity (Answer)</label>
              <input
                value={Spaceans}
                onChange={(e)=>setSpaceans(e.target.value)}
                placeholder="e.g., O(1)"
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* When & Where to Use */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">When and Where to Use This Problem</label>
              <textarea
                value={whenandwhere}
                onChange={(e)=>setWhenandwhere(e.target.value)}
                placeholder="Explain use cases"
                rows={5}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Tips and Important Points */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <label className="text-gray-300 font-medium text-sm pt-2">Tips and Important Points to Remember</label>
              <textarea
                value={remember}
                onChange={(e)=>setRemember(e.target.value)}
                placeholder="Add any important notes"
                rows={4}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center pt-6"
            >
              <button type="submit"  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl shadow-lg text-lg font-medium">
                Save Problem
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
