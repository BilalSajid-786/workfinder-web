import { SubModule } from './sub-module';

export interface ModuleResponse {
  parentModuleId: number;
  parentModuleName: string;
  subModules: SubModule[];
}
