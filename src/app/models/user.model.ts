import { Guid } from '../models/types.model';
import { BaseEntity } from '../models/base-entity.model';
import type { Role } from '../models/role.model';
import type { Applicant } from '../models/applicant.model';
import type { Employer } from '../models/employer.model';

export interface User extends BaseEntity {
  userId: Guid;
  name: string;
  email: string;
  password: string;

  roleId: Guid;
  role?: Role | null;

  city: string;
  country: string;
  phone: string;
  gender: string;

  applicant?: Applicant | null;
  employer?: Employer | null;
}
