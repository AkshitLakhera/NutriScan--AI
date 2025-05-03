'use client'
import React from 'react'
import { useState } from 'react';
export default  function Uploadpage() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [speechLang,setSpeechLang]=useState('');
  const [analysisLang,setAnalysisLang]=useState('');
  const [productType, setProductType] = useState('')
  const [companyName, setCompanyName] = useState('')
  //method to handleupload
  const handleUpload = async (e:React.FormEvent) => {
    e.preventDefault();
    const form=e.target as HTMLFormElement;
    const fileInput = form.elements.namedItem('image') as HTMLInputElement
    console.log(`The fileinput ${fileInput}`);
    if (!fileInput.files?.[0]) return
    console.log( fileInput.files[0]);
    const formData = new FormData()
    formData.append('image', fileInput.files[0])
    setLoading(true);
    const res = await fetch('/api/ocr', {
      method: 'POST',
      body: formData,
    })
    const data= await res.json();
   setText(data.text);
   //sending data to ai model
   const geminiRes= await fetch('/api/nutrition',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients: data.text ,
      language:analysisLang,
    }),
   })
   const geminiData = await geminiRes.json()
   setAnalysis(geminiData.response)
   setLoading(false)
   setLoading(false);
  }
  //method for playing sound
  const handleSpeak = () => {
    if (!analysis) return
    const utterance = new SpeechSynthesisUtterance(analysis)
    utterance.lang = speechLang;
    speechSynthesis.speak(utterance)
}
const handlePause=() => {
  speechSynthesis.pause();
}
const handleResume=() => {
  speechSynthesis.resume();
}
return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-300 to-blue-200 p-4">
  <h1 className="text-3xl font-bold mb-6 text-gray-800">Upload Ingredient Label</h1>

  <form className="bg-white shadow-md rounded-xl p-6 w-full max-w-md space-y-4" onSubmit={handleUpload} >
  <div>
    <label className="block mb-1 font-semibold text-gray-700">  NutriScan Analysis In:</label>
    <select
      value={analysisLang}
      onChange={(e) => setAnalysisLang(e.target.value)}
      className="w-full border rounded p-2"
    >
      <option value="English">English</option>
      <option value="Hindi">Hindi</option>
    </select>
  </div>

  {/* Dropdown for Voice Playback Language */}
  <div>
    <label className="block mb-1 font-semibold text-gray-700">Speak In:</label>
    <select
      value={speechLang}
      onChange={(e) => setSpeechLang(e.target.value)}
      className="w-full border rounded p-2"
    >
      <option value="en-US">English</option>
      <option value="hi-IN">Hindi</option>
    </select>
  </div>
  <div>
          <label className="block font-medium">Product Type (e.g., Chocolate, Chips):</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Company/Brand Name:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
    <input
      type="file"
      name="image"
      accept="image/*"
      required
      className="w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100"
    />

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
    >
      Extract
    </button>
  </form>
  {loading && <p>Processing...</p>}
  {text && (
  <>
    {/* <h2>Extracted Text:</h2>
    <p>{text}</p> */}
  </>
)} {analysis && (
  <div className="mt-6 w-full max-w-xl bg-white rounded-xl shadow-md p-4">
    <h2 className="text-xl font-semibold mb-2">Gemini Nutrition Analysis:</h2>
    <p className="text-gray-700 whitespace-pre-wrap">{analysis}</p>
    <div className='flex justify-between mt-5'>
    <button
            onClick={handleSpeak}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            🔊 Play
          </button>
    <button
            onClick={handlePause}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ⏸️ Pause
          </button>
          <button
            onClick={handleResume}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ▶️ Resume
          </button>
          </div>
  </div>
)}
</div>
)
}

