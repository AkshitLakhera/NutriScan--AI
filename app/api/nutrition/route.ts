import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
export async function POST(req:Request){
    const {ingredients, language, productType, companyName  } = await req.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' })
    const prompt = `
    You are a friendly and helpful virtual nutritionist.
    
    A user has uploaded a food label of a ${productType} made by ${companyName}.
    Based on the ingredients listed below, explain whether the product is healthy or not, and why.
    
    Ingredients:
    ${ingredients}
    
    Respond in ${language === 'Hindi' ? 'Hindi' : 'English'}.
    Use very simple, clear, non-technical language that even an uneducated person can understand.
    
    Your response should include:
    
    1. Whether the product is healthy or not.
    2. Why – explain how ingredients like sugar, fat, preservatives, protein, fiber, etc., affect the body in simple terms.
    3. Suggest **healthier alternatives** based on the product type, using trusted Indian brands known for clean-label or healthy products.
    
    Use this reference list of healthy Indian brands for alternatives:
    
    - **Refined Cooking Oils**: Fortune, Saffola, Bhushan Oils (Jiwan Dhara), Dhara, Gemini  
    - **Chocolates**: The Whole Truth, Sante Foods (with Ayurvedic herbs), Aadvik (camel/goat milk), Anutamma’s (A2 milk), Darkins  
    - **Milk/Desi Ghee**: Amul (Desi Cow Milk), Mother Dairy  
    - 'Sugar': xx,
  'Fat': xx,
  'Protein': xx,
  'Fiber': xx,
  'Preservatives': xx
  -Also give these numbers so that i could use in future to make chart
  
    
    Be specific and suggest products from these if possible. For example, if the product is chocolate with lots of sugar, suggest dark chocolates from The Whole Truth or Sante.
    
    Keep the tone helpful, warm, and easy to understand.
    DO NOT say you are not a health expert.
    DO NOT tell them to consult a dietitian — you are the expert now.
    - Speak in proper points and headers
    `
    
    const result=await model.generateContent(prompt);
    const response = await result.response;
    const text= response.text();
    return NextResponse.json({ response: text })
}