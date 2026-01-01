
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResult, ResumeData } from "../types";

const extractJson = (text: string | undefined): string => {
  if (!text) return "{}";
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1);
  }
  return text.trim();
};

export const parseResumeText = async (text: string): Promise<ResumeData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract professional data from this resume text into JSON format. Include: name, email, phone, summary, experience (role, company, duration, description as array), education (degree, institution, year), and skills as a flat array. TEXT: ${text.substring(0, 8000)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            summary: { type: Type.STRING },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  description: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  year: { type: Type.STRING }
                }
              }
            },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(extractJson(response.text));
  } catch (e) {
    console.error("Parse error:", e);
    return { name: "", email: "", phone: "", summary: "", experience: [], education: [], skills: [] };
  }
};

export const analyzeResume = async (resumeData: ResumeData, jobTitle: string, jobDescription: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are a Senior Technical Recruiter. Analyze this resume against the job description for the role of ${jobTitle}. 
  JOB DESCRIPTION: ${jobDescription}
  RESUME DATA: ${JSON.stringify(resumeData)}
  
  Provide a comprehensive analysis including:
  1. ATS compatibility score (0-100).
  2. Keyword match score.
  3. Readability and formatting scores.
  4. Missing high-impact keywords.
  5. A tailored professional summary for this specific job.
  6. Enhanced experience bullets using the STAR method (quantified impact).
  7. A 4-week roadmap to bridge skill gaps.
  8. A script for a brief voice AI coaching session.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.NUMBER },
            readabilityScore: { type: Type.NUMBER },
            keywordMatchScore: { type: Type.NUMBER },
            quantifiedImpactScore: { type: Type.NUMBER },
            formattingHealthScore: { type: Type.NUMBER },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            tailoredSummary: { type: Type.STRING },
            enhancedBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
            voiceBriefingText: { type: Type.STRING },
            recruiterSimulationScore: { type: Type.NUMBER },
            weeklyRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { week: { type: Type.STRING }, goal: { type: Type.STRING }, focus: { type: Type.STRING } }
              }
            },
            skillRoadmaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skillName: { type: Type.STRING },
                  whyItMatters: { type: Type.STRING },
                  learningPath: { type: Type.ARRAY, items: { type: Type.STRING } },
                  practiceTask: { type: Type.STRING },
                  estimatedTime: { type: Type.STRING },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: { title: { type: Type.STRING }, url: { type: Type.STRING } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(extractJson(response.text));
  } catch (e) {
    throw new Error("Analysis failed. Please try again.");
  }
};

export const generateVoiceBriefing = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text.substring(0, 1000) }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};

export const decodeAudio = async (base64: string, context: AudioContext) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = context.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
};
