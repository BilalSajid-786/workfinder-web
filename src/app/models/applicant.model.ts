import { Guid } from '../models/types.model';
import { User } from './user.model';

// Minimal placeholder to satisfy the relation on User.
// Extend this when your backend exposes Applicant fields.
export interface Applicant extends User {
  userId: Guid;
  applicantId: Guid;
}
