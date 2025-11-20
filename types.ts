
export enum StarCategory {
  ACTOR = '演员',
  SINGER = '歌星',
  HOST = '主持人',
  INTERNET_CELEBRITY = '网红',
  SPORTS = '体育明星',
  OPINION_LEADER = '意见领袖'
}

export enum Gender {
  MALE = '男',
  FEMALE = '女'
}

export enum Rank {
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
  NONE = '无' // For optional roles
}

export interface Star {
  id: number;
  name: string;
  gender: Gender;
  age: number;
  priceMin: number; // Wan Yuan
  priceMax: number; // Wan Yuan
  categories: string[]; // Can be multiple
  availability: number; // Days
  minQuality: Rank;
  rank: Rank;
  fame: number;
}

export enum ContentType {
  LONG_VIDEO = '中长视频',
  SHORT_VIDEO = '短视频',
  GRAPHIC = '图文',
  FLAT = '平面',
  ANIMATION = '动画',
  AUDIO = '声音',
  LIVE_COMMERCE = '直播带货',
  INTERACTIVE = '互动',
  VIRAL = '裂变'
}

export enum JobRole {
  DIRECTOR = '导演',
  SCREENWRITER = '编剧',
  COPYWRITER = '文案',
  VOICE_ACTOR = '配音',
  VIDEO_TEAM = '视频制作团队',
  GRAPHIC_DESIGNER = '图片设计师/插画师',
  ANIMATION_TEAM = '动画制作团队',
  INTERACTIVE_DESIGNER = '互动设计师',
  INTERACTIVE_TEAM = '互动类制作团队',
  MUSIC = '配乐',
  LIVE_TEAM = '直播团队',
  EVENT = '事件'
}

export interface MediaFormulaStep {
  limit: number; // Upper bound of budget for this step (cumulative)
  slope: number; // Efficiency rate (Score per 1 Wan Yuan)
  desc: string; // String description for tooltip
}

export interface MediaChannelDef {
  name: string;
  type: ContentType;
  minQuality: Rank;
  reachFormulas: MediaFormulaStep[];
  favorFormulas: MediaFormulaStep[];
  actionFormulas: MediaFormulaStep[];
}

export interface ProductionPlan {
  id: string;
  name: string;
  type: ContentType;
  quality: Rank; // Overall quality (Auto-calculated)
  seriesCount: number;
  roleRanks: Partial<Record<JobRole, Rank>>;
  starIds: number[]; // Multiple stars
  
  // Dates
  starStartDate: string;
  starEndDate: string;
  postStartDate: string;
  postEndDate: string;

  // Duration snapshots for calendar recalculations
  starDays: number;
  postDays: number;

  cost: number;
}

export interface MediaPlan {
  id: string;
  channelName: string;
  budget: number; // Wan Yuan
  mediaEfficiency: number; // 0-100 percentage
  contentId?: string; // Link to production
  startDate: string;
  endDate: string;
  projectedReach: number;
  projectedFavor: number;
  projectedAction: number;
}
