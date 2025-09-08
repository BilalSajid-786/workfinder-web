export interface SubModule {
  moduleId: number;
  parentModuleId: number | null;
  moduleName: string;
  route: string;
  permissionId: number;
  action: string;
  displayName: string | null;
}
