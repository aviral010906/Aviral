
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ResumeData } from "../types";

/**
 * Robust JSON extraction.
 */
const extractJson = (text: string | undefined): string => {
  if (!text) return "{}";
  try {
    // Look for JSON blocks
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return match[0];
    return text.trim();
  } catch (e) {
    console.error("JSON extraction error:", e);
  }
  return "{}";
};

/**
 * Parses raw resume text into structured data.
 */
export const parseResumeText = async (text: string): Promise<ResumeData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const input = text.substring(0, 3000); // Truncate for speed
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract career details into JSON. Input: ${input}`,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
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

    const parsed = JSON.parse(extractJson(response.text));
    return {
      name: parsed.name || "Candidate Elite",
      email: parsed.email || "",
      phone: parsed.phone || "",
      summary: parsed.summary || "",
      experience: Array.isArray(parsed.experience) ? parsed.experience : [],
      education: Array.isArray(parsed.education) ? parsed.education : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : []
    };
  } catch (e) {
    console.error("Parsing failure:", e);
    return { name: "Candidate Elite", email: "", phone: "", summary: "", experience: [], education: [], skills: [] };
  }
};

/**
 * Core analysis engine.
 */
export const analyzeResume = async (resumeData: ResumeData, jobTitle: string, jobDescription: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Compact data for faster context processing
  const resumeJson = JSON.stringify({
    summary: resumeData.summary,
    skills: resumeData.skills,
    exp: resumeData.experience?.map(e => ({ r: e.role, d: e.description }))
  }).substring(0, 2000);

  const prompt = `Analyze this profile for "${jobTitle}".
  Resume JSON: ${resumeJson}
  Job Description (snippet): ${jobDescription.substring(0, 1500)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.NUMBER },
            readabilityScore: { type: Type.NUMBER },
            keywordMatchScore: { type: Type.NUMBER },
            recruiterSimulationScore: { type: Type.NUMBER },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            tailoredSummary: { type: Type.STRING },
            enhancedBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
            weeklyRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.STRING },
                  goal: { type: Type.STRING },
                  focus: { type: Type.STRING }
                }
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

    const data = JSON.parse(extractJson(response.text));
    
    // Fill in defaults if model skipped optional fields
    return {
      atsScore: data.atsScore ?? 75,
      readabilityScore: data.readabilityScore ?? 80,
      keywordMatchScore: data.keywordMatchScore ?? 70,
      recruiterSimulationScore: data.recruiterSimulationScore ?? 85,
      missingSkills: data.missingSkills || [],
      matchedSkills: data.matchedSkills || [],
      skillRoadmaps: data.skillRoadmaps || [],
      weeklyRoadmap: data.weeklyRoadmap || [],
      tailoredSummary: data.tailoredSummary || "Expert industry professional with core alignment to target competencies.",
      enhancedBullets: data.enhancedBullets || []
    };
  } catch (e: any) {
    console.error("Analysis engine failure:", e);
    throw new Error("The AI engine took too long to respond. Please try again with a shorter job description.");
  }
};