import { Skill } from './skill.model';

export interface Job {
  jobId: number;
  title: string;
  description: string;
  company: string;
  postedDate: string;
  city: string;
  country: string;
  expiryDate: string; // Use string for JSON date from API
  employerId: string; // GUIDs come as string in JSON
  jobType: string;
  isActive: boolean;
  industryId: number;
  industryName: string;
  skills: Skill[];
}
