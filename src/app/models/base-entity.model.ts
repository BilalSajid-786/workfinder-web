import { Guid, IsoDate } from '../models/types.model';

export interface BaseEntity {
  createdAt: IsoDate;
  updatedAt?: IsoDate | null;

  createdBy?: Guid | null;
  updatedBy?: Guid | null;

  isActive: boolean;
  isDeleted: boolean;
}
