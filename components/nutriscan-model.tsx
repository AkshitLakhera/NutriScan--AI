"use client"

// import { Suspense } from "react"
// import dynamic from "next/dynamic"

// // Dynamically import the 3D scene to ensure it only loads on the client
// const Scene3D = dynamic(() => import("./scene-3d"), {
//   ssr: false,
//   loading: () => <ModelLoader />,
// })

function ModelLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600">Loading 3D visualization...</p>
      </div>
    </div>
  )
}

export default function NutriScanModel() {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      {/* <Suspense fallback={<ModelLoader />}> */}
        {/* <Scene3D /> */}
        <img
        src='/virtualmodel.jpg'
        alt="NutriScan Preview"
        className="w-full h-full object-cover"
      />
      {/* </Suspense> */}
    </div>
  )
}
