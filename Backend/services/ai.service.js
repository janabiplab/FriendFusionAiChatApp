import { GoogleGenAI } from "@google/genai";

const ai=new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_KEY })

export const generateResult=async(prompt)=>{
   
    const airesponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents:prompt,
      systemInstruction:"Every time create a  tiltle of when you response and the title will be on the json format and its very important"
    })

    const result= airesponse.text
    return result
}



