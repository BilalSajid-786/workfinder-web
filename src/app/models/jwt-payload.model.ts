export interface JwtPayload {
  UserId: string;
  RoleId: string;
  UserName?: string;
  BaseUserId: string;
  ProfilePic?:string;
  Permissions: string[];
  UserRole: string;
  CompanyName?: string;
  // add other custom claims if needed
  exp?: number;
  iat?: number;
}
