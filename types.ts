
export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface RoadmapLink {
  title: string;
  url: string;
}

export interface SkillRoadmapItem {
  skillName: string;
  whyItMatters: string;
  learningPath: string[];
  resources: RoadmapLink[];
  practiceTask: string;
  estimatedTime: string;
}

export interface WeeklyRoadmapItem {
  week: string;
  goal: string;
  focus: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface Badge {
  name: string;
  icon: string;
  color: string;
}

export interface AnalysisResult {
  atsScore: number;
  readabilityScore: number;
  keywordMatchScore: number;
  missingSkills: string[];
  matchedSkills: string[];
  skillRoadmaps: SkillRoadmapItem[];
  weeklyRoadmap: WeeklyRoadmapItem[];
  tailoredSummary: string;
  enhancedBullets: string[];
  recruiterSimulationScore: number;
  badges?: Badge[];
  groundingSources?: GroundingSource[];
}

export enum AppState {
  LOGIN = 'LOGIN',
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  VIEWING_RESUME = 'VIEWING_RESUME',
  ROADMAP = 'ROADMAP',
  HISTORY = 'HISTORY'
}
