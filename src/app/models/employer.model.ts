import { Guid } from '../models/types.model';
import type { User } from '../models/user.model';
import type { Industry } from '../models/industry.model';

export interface Employer extends User{
  userId: Guid;
  employerId: Guid;

  companyName: string;
  websiteUrl?: string | null;           // optional
  industryId: number;
  industry?: Industry | null;

  companySize: string;
  contactPerson: string;
  registrationNumber?: string | null;   // optional

  user?: User | null;
}
