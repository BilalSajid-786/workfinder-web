export interface JwtPayload {
  UserId: string;
  RoleId: string;
  Permissions: string[];
  UserRole: string;
  // add other custom claims if needed
  exp?: number;
  iat?: number;
}
