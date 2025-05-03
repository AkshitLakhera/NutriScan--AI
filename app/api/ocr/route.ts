// app/api/ocr/route.ts (App Router)
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('image') as File

  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = buffer.toString('base64')

  const ocrRes = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
        apikey: process.env.OCR_API_KEY!,

    },
    body: new URLSearchParams({
      base64Image: `data:image/png;base64,${base64}`,
      language: 'eng',
    }),
  })

  const ocrData = await ocrRes.json()
  const parsedText = ocrData?.ParsedResults?.[0]?.ParsedText || ''
  return NextResponse.json({ text: parsedText })
}
