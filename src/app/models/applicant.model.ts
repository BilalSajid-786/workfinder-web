import { Guid } from '../models/types.model';

// Minimal placeholder to satisfy the relation on User.
// Extend this when your backend exposes Applicant fields.
export interface Applicant {
  userId: Guid;
  applicantId: Guid;
}
