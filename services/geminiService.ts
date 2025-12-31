
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ResumeData } from "../types";

/**
 * Robust JSON extraction from LLM response.
 */
const extractJson = (text: string | undefined): string => {
  if (!text) return "{}";
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start, end + 1);
  }
  return text.trim() || "{}";
};

/**
 * Parses raw resume text into structured data using Flash for speed.
 */
export const parseResumeText = async (text: string): Promise<ResumeData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure it is configured in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const input = text.substring(0, 8000); 
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract the following resume details into a structured JSON format. If a field is missing, return an empty string or empty array. 
      Input text: ${input}`,
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

    const parsedData = JSON.parse(extractJson(response.text));
    return {
      name: parsedData.name || "Candidate Elite",
      email: parsedData.email || "",
      phone: parsedData.phone || "",
      summary: parsedData.summary || "",
      experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
      education: Array.isArray(parsedData.education) ? parsedData.education : [],
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : []
    };
  } catch (e) {
    console.error("Resume parsing error:", e);
    return { name: "Candidate Elite", email: "", phone: "", summary: "", experience: [], education: [], skills: [] };
  }
};

/**
 * Core analysis engine using Flash for lower latency and high reliability.
 */
export const analyzeResume = async (resumeData: ResumeData, jobTitle: string, jobDescription: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const resumeSummary = JSON.stringify({
    summary: resumeData.summary,
    skills: resumeData.skills,
    experience: resumeData.experience?.map(e => ({ role: e.role, desc: e.description }))
  }).substring(0, 6000);

  const prompt = `Act as an expert Recruiter and ATS Analyst. Analyze this resume for the role of "${jobTitle}".
  
  Target Job Description: ${jobDescription.substring(0, 4000)}
  
  Resume Context: ${resumeSummary}
  
  Return a comprehensive evaluation in JSON. Ensure all numerical scores are between 0 and 100.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
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
    
    return {
      atsScore: data.atsScore ?? 70,
      readabilityScore: data.readabilityScore ?? 75,
      keywordMatchScore: data.keywordMatchScore ?? 65,
      recruiterSimulationScore: data.recruiterSimulationScore ?? 80,
      missingSkills: data.missingSkills || [],
      matchedSkills: data.matchedSkills || [],
      skillRoadmaps: data.skillRoadmaps || [],
      weeklyRoadmap: data.weeklyRoadmap || [],
      tailoredSummary: data.tailoredSummary || "Expert professional with alignment to target core competencies.",
      enhancedBullets: data.enhancedBullets || []
    };
  } catch (e: any) {
    console.error("Analysis failure:", e);
    throw new Error("Analysis failed. This might be due to a network error or an issue with the AI service. Please try again.");
  }
};
