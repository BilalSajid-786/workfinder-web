export interface Skill {
  skillId: number;
  skillName: string;
}

export interface UpdateSkill {
  skillId: number;
  skillName: string;
  isSkillAdded: boolean;
}
