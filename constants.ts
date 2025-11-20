
import { Star, Gender, Rank, ContentType, MediaChannelDef, JobRole } from './types';

// --- JOB PRICES (Wan Yuan) ---
// Based on "Job Price List" in PDF
export const JOB_PRICES: Record<JobRole, Record<Rank, number>> = {
  [JobRole.DIRECTOR]: { [Rank.S]: 100, [Rank.A]: 20, [Rank.B]: 10, [Rank.C]: 1, [Rank.NONE]: 0 },
  [JobRole.SCREENWRITER]: { [Rank.S]: 0, [Rank.A]: 5, [Rank.B]: 2, [Rank.C]: 0.5, [Rank.NONE]: 0 },
  [JobRole.COPYWRITER]: { [Rank.S]: 0, [Rank.A]: 2, [Rank.B]: 1, [Rank.C]: 0.2, [Rank.NONE]: 0 },
  [JobRole.VOICE_ACTOR]: { [Rank.S]: 0, [Rank.A]: 5, [Rank.B]: 2, [Rank.C]: 0.2, [Rank.NONE]: 0 },
  [JobRole.VIDEO_TEAM]: { [Rank.S]: 0, [Rank.A]: 20, [Rank.B]: 10, [Rank.C]: 5, [Rank.NONE]: 0 },
  [JobRole.GRAPHIC_DESIGNER]: { [Rank.S]: 0, [Rank.A]: 5, [Rank.B]: 1, [Rank.C]: 0.2, [Rank.NONE]: 0 },
  [JobRole.ANIMATION_TEAM]: { [Rank.S]: 0, [Rank.A]: 5, [Rank.B]: 3, [Rank.C]: 5, [Rank.NONE]: 0 },
  [JobRole.INTERACTIVE_DESIGNER]: { [Rank.S]: 0, [Rank.A]: 10, [Rank.B]: 5, [Rank.C]: 0.2, [Rank.NONE]: 0 },
  [JobRole.INTERACTIVE_TEAM]: { [Rank.S]: 0, [Rank.A]: 10, [Rank.B]: 5, [Rank.C]: 1, [Rank.NONE]: 0 },
  [JobRole.MUSIC]: { [Rank.S]: 0, [Rank.A]: 10, [Rank.B]: 2, [Rank.C]: 1, [Rank.NONE]: 0 },
  [JobRole.LIVE_TEAM]: { [Rank.S]: 0, [Rank.A]: 5, [Rank.B]: 2.5, [Rank.C]: 1, [Rank.NONE]: 0 },
  [JobRole.EVENT]: { [Rank.S]: 0, [Rank.A]: 50, [Rank.B]: 10, [Rank.C]: 0.2, [Rank.NONE]: 0 },
};

// --- CONTENT REQUIRED ROLES ---
export const JOB_ROLES_CONFIG: Record<ContentType, { required: JobRole[], optional: JobRole[] }> = {
  [ContentType.LONG_VIDEO]: {
    required: [JobRole.DIRECTOR, JobRole.SCREENWRITER, JobRole.VIDEO_TEAM],
    optional: [JobRole.MUSIC, JobRole.EVENT]
  },
  [ContentType.SHORT_VIDEO]: {
    required: [JobRole.DIRECTOR, JobRole.SCREENWRITER, JobRole.VIDEO_TEAM],
    optional: [JobRole.MUSIC, JobRole.EVENT]
  },
  [ContentType.GRAPHIC]: {
    required: [JobRole.GRAPHIC_DESIGNER, JobRole.COPYWRITER],
    optional: [JobRole.EVENT]
  },
  [ContentType.FLAT]: {
    required: [JobRole.GRAPHIC_DESIGNER, JobRole.COPYWRITER],
    optional: [JobRole.EVENT]
  },
  [ContentType.ANIMATION]: {
    required: [JobRole.DIRECTOR, JobRole.ANIMATION_TEAM, JobRole.SCREENWRITER],
    optional: [JobRole.MUSIC, JobRole.EVENT]
  },
  [ContentType.AUDIO]: {
    required: [JobRole.VOICE_ACTOR, JobRole.COPYWRITER],
    optional: [JobRole.MUSIC, JobRole.EVENT]
  },
  [ContentType.LIVE_COMMERCE]: {
    required: [JobRole.LIVE_TEAM],
    optional: []
  },
  [ContentType.INTERACTIVE]: {
    required: [JobRole.INTERACTIVE_DESIGNER, JobRole.INTERACTIVE_TEAM],
    optional: [JobRole.EVENT]
  },
  [ContentType.VIRAL]: {
    required: [],
    optional: [JobRole.COPYWRITER, JobRole.EVENT]
  }
};

// --- SERIES COEFFICIENTS (For Duration Calculation) ---
export const SERIES_COEFFICIENTS: Record<ContentType, number> = {
  [ContentType.LONG_VIDEO]: 1.1,
  [ContentType.SHORT_VIDEO]: 0.8,
  [ContentType.FLAT]: 0.3,
  [ContentType.GRAPHIC]: 0.5,
  [ContentType.ANIMATION]: 0.4,
  [ContentType.AUDIO]: 0.7,
  [ContentType.LIVE_COMMERCE]: 1.0,
  [ContentType.INTERACTIVE]: 0.6,
  [ContentType.VIRAL]: 0.0
};

// --- DURATION MATRIX [StarDays, PostDays] ---
export const DURATION_MATRIX: Record<ContentType, Record<Rank, [number, number]>> = {
  [ContentType.LONG_VIDEO]: {
    [Rank.S]: [10, 20], [Rank.A]: [7, 15], [Rank.B]: [5, 10], [Rank.C]: [1, 5], [Rank.NONE]: [1, 1]
  },
  [ContentType.SHORT_VIDEO]: {
    [Rank.S]: [10, 14], [Rank.A]: [7, 7], [Rank.B]: [5, 5], [Rank.C]: [1, 3], [Rank.NONE]: [1, 1]
  },
  [ContentType.FLAT]: {
    [Rank.S]: [3, 30], [Rank.A]: [3, 14], [Rank.B]: [3, 5], [Rank.C]: [3, 3], [Rank.NONE]: [1, 1]
  },
  [ContentType.GRAPHIC]: {
    [Rank.S]: [2, 3], [Rank.A]: [2, 3], [Rank.B]: [2, 3], [Rank.C]: [2, 2], [Rank.NONE]: [1, 1]
  },
  [ContentType.ANIMATION]: {
    [Rank.S]: [60, 10], [Rank.A]: [30, 5], [Rank.B]: [30, 5], [Rank.C]: [20, 3], [Rank.NONE]: [1, 1]
  },
  [ContentType.AUDIO]: {
    [Rank.S]: [3, 0], [Rank.A]: [3, 0], [Rank.B]: [3, 0], [Rank.C]: [3, 0], [Rank.NONE]: [1, 0]
  },
  [ContentType.LIVE_COMMERCE]: {
    [Rank.S]: [10, 0], [Rank.A]: [10, 0], [Rank.B]: [10, 0], [Rank.C]: [10, 0], [Rank.NONE]: [1, 0]
  },
  [ContentType.INTERACTIVE]: {
    [Rank.S]: [10, 15], [Rank.A]: [8, 12], [Rank.B]: [5, 10], [Rank.C]: [5, 10], [Rank.NONE]: [1, 1]
  },
  [ContentType.VIRAL]: {
    [Rank.S]: [3, 0], [Rank.A]: [3, 0], [Rank.B]: [3, 0], [Rank.C]: [3, 0], [Rank.NONE]: [1, 0]
  }
};

// --- MEDIA FORMULAS (Updated based on latest detailed table) ---
export const MEDIA_CHANNELS: MediaChannelDef[] = [
  // --- 广播类 ---
  {
    name: '广播广告',
    type: ContentType.AUDIO,
    minQuality: Rank.B,
    reachFormulas: [
      { limit: 5, slope: 0.15, desc: '1×75%×C/5' },
      { limit: 50, slope: 0.09, desc: '0.6×75%×C/5' },
      { limit: 100, slope: 0.09, desc: '0.6×75%×C/5' },
      { limit: 9999, slope: 0.06, desc: '0.4×75%×C/5' },
    ],
    favorFormulas: [
      { limit: 5, slope: 0.017, desc: '1×8.5%×C/5' },
      { limit: 50, slope: 0.0136, desc: '0.8×8.5%×C/5' },
      { limit: 100, slope: 0.0068, desc: '0.4×8.5%×C/5' },
      { limit: 9999, slope: 0.0034, desc: '0.2×8.5%×C/5' },
    ],
    actionFormulas: [
      { limit: 5, slope: 0.0004, desc: '1×0.2%×C/5' },
      { limit: 50, slope: 0.00044, desc: '1.1×0.2%×C/5' },
      { limit: 100, slope: 0.00048, desc: '1.2×0.2%×C/5' },
      { limit: 9999, slope: 0.00048, desc: '1.2×0.2%×C/5' },
    ]
  },
  {
    name: '音频 APP 软广',
    type: ContentType.AUDIO,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 4, slope: 0.1, desc: '1×40%×C/4' },
      { limit: 20, slope: 0.08, desc: '0.8×40%×C/4' },
      { limit: 50, slope: 0.06, desc: '0.6×40%×C/4' },
      { limit: 9999, slope: 0.04, desc: '0.4×40%×C/4' },
    ],
    favorFormulas: [
      { limit: 4, slope: 0.025, desc: '1×10%×C/4' },
      { limit: 20, slope: 0.01625, desc: '0.65×10%×C/4' },
      { limit: 50, slope: 0.01125, desc: '0.45×10%×C/4' },
      { limit: 9999, slope: 0.00625, desc: '0.25×10%×C/4' },
    ],
    actionFormulas: [
      { limit: 4, slope: 0.002, desc: '1×0.8%×C/4' },
      { limit: 20, slope: 0.0023, desc: '1.15×0.8%×C/4' },
      { limit: 50, slope: 0.0024, desc: '1.2×0.8%×C/4' },
      { limit: 9999, slope: 0.0024, desc: '1.2×0.8%×C/4' },
    ]
  },
  // --- 户外类 ---
  {
    name: '户外广告',
    type: ContentType.FLAT, // Represents multiple types
    minQuality: Rank.B,
    reachFormulas: [
      { limit: 4, slope: 0.1, desc: '1×40%×C/4' },
      { limit: 20, slope: 0.08, desc: '0.8×40%×C/4' },
      { limit: 50, slope: 0.06, desc: '0.6×40%×C/4' },
      { limit: 9999, slope: 0.04, desc: '0.4×40%×C/4' },
    ],
    favorFormulas: [
      { limit: 4, slope: 0.025, desc: '1×10%×C/4' },
      { limit: 20, slope: 0.01625, desc: '0.65×10%×C/4' },
      { limit: 50, slope: 0.01125, desc: '0.45×10%×C/4' },
      { limit: 9999, slope: 0.00625, desc: '0.25×10%×C/4' },
    ],
    actionFormulas: [
      { limit: 4, slope: 0.002, desc: '1×0.8%×C/4' },
      { limit: 20, slope: 0.0023, desc: '1.15×0.8%×C/4' },
      { limit: 50, slope: 0.0024, desc: '1.2×0.8%×C/4' },
      { limit: 9999, slope: 0.0024, desc: '1.2×0.8%×C/4' },
    ]
  },
  // --- 植入类 ---
  {
    name: '活动（体育赛事等）',
    type: ContentType.LONG_VIDEO, // Implant
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 9999, slope: 0.06, desc: '1×30%×(0.8~1.2)×C/5' }
    ],
    favorFormulas: [
      { limit: 9999, slope: 0.0116, desc: '1×5.8%×(0.8~1.2)×C/5' }
    ],
    actionFormulas: [
      { limit: 9999, slope: 0.0006, desc: '1×0.3%×(0.8~1.2)×C/5' }
    ]
  },
  {
    name: '传统媒体（电视等）',
    type: ContentType.LONG_VIDEO, // Implant
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 9999, slope: 0.095, desc: '1×95%×(0.5~1.5)×C/10' }
    ],
    favorFormulas: [
      { limit: 9999, slope: 0.0095, desc: '1×9.5%×(0.4~1.6)×C/10' }
    ],
    actionFormulas: [
      { limit: 9999, slope: 0.0006, desc: '1×0.6%×(0.4~1.6)×C/10' }
    ]
  },
  {
    name: '网络媒体内容植入',
    type: ContentType.LONG_VIDEO, // Implant
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 9999, slope: 0.095, desc: '1×95%×(0.7~1.3)×C/10' }
    ],
    favorFormulas: [
      { limit: 9999, slope: 0.0097, desc: '1×9.7%×(0.7~1.3)×C/10' }
    ],
    actionFormulas: [
      { limit: 9999, slope: 0.0006, desc: '1×0.6%×(0.7~1.3)×C/10' }
    ]
  },
  // --- 电视类 ---
  {
    name: '央视广告',
    type: ContentType.LONG_VIDEO,
    minQuality: Rank.B,
    reachFormulas: [
      { limit: 20, slope: 0.12, desc: '1×24%×C/2' },
      { limit: 200, slope: 0.12, desc: '1×24%×C/2' },
      { limit: 9999, slope: 0.12, desc: '1×24%×C/2' },
    ],
    favorFormulas: [
      { limit: 20, slope: 0.036, desc: '0.9×8%×C/2' },
      { limit: 200, slope: 0.038, desc: '0.95×8%×C/2' },
      { limit: 9999, slope: 0.04, desc: '1×8%×C/2' },
    ],
    actionFormulas: [
      { limit: 20, slope: 0.0015, desc: '(0.1%~0.2%)×C' }, // Avg 0.15% -> 0.0015
      { limit: 200, slope: 0.000125, desc: '(0.1%~0.2%)×C/12' }, // 0.0015 / 12
      { limit: 9999, slope: 0.00075, desc: '1×(0.1%~0.2%)×C/2' }, // 0.0015 / 2
    ]
  },
  {
    name: '卫视广告',
    type: ContentType.LONG_VIDEO,
    minQuality: Rank.B,
    reachFormulas: [
      { limit: 20, slope: 0.125, desc: '1×12.5%×C/1' },
      { limit: 200, slope: 0.125, desc: '1×12.5%×C/1' },
      { limit: 9999, slope: 0.125, desc: '1×12.5%×C/1' },
    ],
    favorFormulas: [
      { limit: 20, slope: 0.025, desc: '0.8×3.125%×C/1' },
      { limit: 200, slope: 0.028125, desc: '0.9×3.125%×C/1' },
      { limit: 9999, slope: 0.03125, desc: '1×3.125%×C/1' },
    ],
    actionFormulas: [
      { limit: 20, slope: 0.0008, desc: '(0.04%~0.12%)×C' }, // Avg 0.08% -> 0.0008
      { limit: 200, slope: 0.0008, desc: '(0.04%~0.12%)×C/1' },
      { limit: 9999, slope: 0.0008, desc: '(0.04%~0.12%)×C/1' },
    ]
  },
  // --- 直播类 ---
  {
    name: '直播带货',
    type: ContentType.LIVE_COMMERCE,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 100, slope: 0.09, desc: '1×50%×(0.8~1)×C/5' }, // Avg 0.9
      { limit: 200, slope: 0.09, desc: '1×50%×(0.8~1)×C/5' },
      { limit: 9999, slope: 0.09, desc: '1×50%×(0.8~1)×C/5' },
    ],
    favorFormulas: [
      { limit: 100, slope: 0.0085, desc: '1×5%×(0.7~1)×C/5' }, // Avg 0.85
      { limit: 200, slope: 0.009095, desc: '1.07×5%×(0.7~1)×C/5' },
      { limit: 9999, slope: 0.009775, desc: '1.15×5%×(0.7~1)×C/5' },
    ],
    actionFormulas: [
      { limit: 100, slope: 0.00525, desc: '1×3.5%×(0.5~1)×C/5' }, // Avg 0.75
      { limit: 200, slope: 0.0055125, desc: '1.05×3.5%×(0.5~1)×C/5' },
      { limit: 9999, slope: 0.005775, desc: '1.1×3.5%×(0.5~1)×C/5' },
    ]
  },
  {
    name: '直播（非带货类）',
    type: ContentType.LONG_VIDEO,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 50, slope: 0.12, desc: '1×60%×C/5' },
      { limit: 100, slope: 0.096, desc: '0.8×60%×C/5' },
      { limit: 9999, slope: 0.06, desc: '0.5×60%×C/5' },
    ],
    favorFormulas: [
      { limit: 50, slope: 0.1, desc: '1×10%×C/1' }, 
      { limit: 100, slope: 0.016, desc: '0.8×10%×C/5' },
      { limit: 9999, slope: 0.01, desc: '0.5×10%×C/5' },
    ],
    actionFormulas: [
      { limit: 50, slope: 0.0055, desc: '1×2.75%×C/5' },
      { limit: 100, slope: 0.0055, desc: '1×2.75%×C/5' },
      { limit: 9999, slope: 0.0055, desc: '1×2.75%×C/5' },
    ]
  },
  // --- 纸媒类 ---
  {
    name: '杂志软文',
    type: ContentType.FLAT,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 100, slope: 0.1, desc: '1×20%×C/2' },
      { limit: 200, slope: 0.06, desc: '0.6×20%×C/2' },
      { limit: 9999, slope: 0.01, desc: '0.1×20%×C/2' },
    ],
    favorFormulas: [
      { limit: 100, slope: 0.015, desc: '1×3%×C/2' },
      { limit: 200, slope: 0.00975, desc: '0.65×3%×C/2' },
      { limit: 9999, slope: 0.0015, desc: '0.1×3%×C/2' },
    ],
    actionFormulas: [
      { limit: 100, slope: 0.0001, desc: '1×0.02%×C/2' },
      { limit: 200, slope: 0.00007, desc: '0.7×0.02%×C/2' },
      { limit: 9999, slope: 0.00001, desc: '0.1×0.02%×C/2' },
    ]
  },
  {
    name: '杂志硬广',
    type: ContentType.FLAT,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 100, slope: 0.0375, desc: '1×75%×C/20' },
      { limit: 200, slope: 0.0225, desc: '0.6×75%×C/20' },
      { limit: 9999, slope: 0.00375, desc: '0.1×75%×C/20' },
    ],
    favorFormulas: [
      { limit: 100, slope: 0.003375, desc: '1×6.75%×C/20' },
      { limit: 200, slope: 0.00219375, desc: '0.65×6.75%×C/20' },
      { limit: 9999, slope: 0.0003375, desc: '0.1×6.75%×C/20' },
    ],
    actionFormulas: [
      { limit: 100, slope: 0.00002, desc: '1×0.04%×C/20' },
      { limit: 200, slope: 0.000014, desc: '0.7×0.04%×C/20' },
      { limit: 9999, slope: 0.000002, desc: '0.1×0.04%×C/20' },
    ]
  },
  {
    name: '报纸硬广',
    type: ContentType.FLAT,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 50, slope: 0.1, desc: '1×50%×C/5' },
      { limit: 100, slope: 0.06, desc: '0.6×50%×C/5' },
      { limit: 9999, slope: 0.02, desc: '0.2×50%×C/5' },
    ],
    favorFormulas: [
      { limit: 50, slope: 0.006, desc: '1×3%×C/5' },
      { limit: 100, slope: 0.0039, desc: '0.65×3%×C/5' },
      { limit: 9999, slope: 0.0018, desc: '0.3×3%×C/5' },
    ],
    actionFormulas: [
      { limit: 50, slope: 0.00004, desc: '1×0.02%×C/5' },
      { limit: 100, slope: 0.000028, desc: '0.7×0.02%×C/5' },
      { limit: 9999, slope: 0.000016, desc: '0.4×0.02%×C/5' },
    ]
  },
  {
    name: '报纸软文',
    type: ContentType.FLAT,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 20, slope: 0.18, desc: '1×18%×C/1' },
      { limit: 50, slope: 0.144, desc: '0.8×18%×C/1' },
      { limit: 9999, slope: 0.108, desc: '0.6×18%×C/1' },
    ],
    favorFormulas: [
      { limit: 20, slope: 0.01, desc: '1×1%×C/1' },
      { limit: 50, slope: 0.005, desc: '0.5×1%×C/1' },
      { limit: 9999, slope: 0.003, desc: '0.3×1%×C/1' },
    ],
    actionFormulas: [
      { limit: 20, slope: 0.0001, desc: '1×0.01%×C/1' },
      { limit: 50, slope: 0.00005, desc: '0.5×0.01%×C/1' },
      { limit: 9999, slope: 0.00003, desc: '0.3×0.01%×C/1' },
    ]
  },
  // --- 网站和网络应用类 ---
  {
    name: '电商广告',
    type: ContentType.GRAPHIC, // Assumed generic type based on description "图文类、平面类..."
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 50, slope: 0.15, desc: '1*45%*C/3' },
      { limit: 200, slope: 0.1515, desc: '1.01*45%*C/3' },
      { limit: 9999, slope: 0.153, desc: '1.02*45%*C/3' },
    ],
    favorFormulas: [
      { limit: 50, slope: 0.009, desc: '1*2.7%*C/3' },
      { limit: 200, slope: 0.00945, desc: '1.05*2.7%*C/3' },
      { limit: 9999, slope: 0.0099, desc: '1.1*2.7%*C/3' },
    ],
    actionFormulas: [
      { limit: 50, slope: 0.01, desc: '1*3%*C/3' },
      { limit: 200, slope: 0.0107, desc: '1.07*3%*C/3' },
      { limit: 9999, slope: 0.0115, desc: '1.15*3%*C/3' },
    ]
  },
  {
    name: '短视频信息流',
    type: ContentType.SHORT_VIDEO,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 100, slope: 0.095, desc: '1*95%*C/10' },
      { limit: 300, slope: 0.095, desc: '1*95%*C/10' },
      { limit: 9999, slope: 0.095, desc: '1*95%*C/10' },
    ],
    favorFormulas: [
      { limit: 100, slope: 0.0084, desc: '0.7*12%*C/10' },
      { limit: 300, slope: 0.0102, desc: '0.85*12%*C/10' },
      { limit: 9999, slope: 0.012, desc: '1*12%*C/10' },
    ],
    actionFormulas: [
      { limit: 100, slope: 0.0035, desc: '0.7*5%*C/10' },
      { limit: 300, slope: 0.00425, desc: '0.85*5%*C/10' },
      { limit: 9999, slope: 0.005, desc: '1*5%*C/10' },
    ]
  },
  {
    name: '小红书网红（裂变）',
    type: ContentType.VIRAL,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 50, slope: 0.125, desc: '1×25%×C/2' },
      { limit: 300, slope: 0.125, desc: '1×25%×C/2' },
      { limit: 9999, slope: 0.125, desc: '1×25%×C/2' },
    ],
    favorFormulas: [
      { limit: 50, slope: 0.01125, desc: '0.9×2.5%×C/2' },
      { limit: 300, slope: 0.011875, desc: '0.95×2.5%×C/2' },
      { limit: 9999, slope: 0.0125, desc: '1×2.5%×C/2' },
    ],
    actionFormulas: [
      { limit: 50, slope: 0.00072, desc: '0.8×0.18%×C/2' },
      { limit: 300, slope: 0.00081, desc: '0.9×0.18%×C/2' },
      { limit: 9999, slope: 0.0009, desc: '1×0.18%×C/2' },
    ]
  },
  {
    name: '小红书网红',
    type: ContentType.GRAPHIC,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 50, slope: 0.06, desc: '1×12%×C/2' },
      { limit: 300, slope: 0.06, desc: '1×12%×C/2' },
      { limit: 9999, slope: 0.06, desc: '1×12%×C/2' },
    ],
    favorFormulas: [
      { limit: 50, slope: 0.01575, desc: '0.9×3.5%×C/2' },
      { limit: 300, slope: 0.016625, desc: '0.95×3.5%×C/2' },
      { limit: 9999, slope: 0.0175, desc: '1×3.5%×C/2' },
    ],
    actionFormulas: [
      { limit: 50, slope: 0.0006, desc: '0.8×0.15%×C/2' },
      { limit: 300, slope: 0.000675, desc: '0.9×0.15%×C/2' },
      { limit: 9999, slope: 0.00075, desc: '1×0.15%×C/2' },
    ]
  },
  {
    name: '知乎硬广',
    type: ContentType.GRAPHIC,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 9999, slope: 0.08, desc: '1×80%×C/10' }
    ],
    favorFormulas: [
      { limit: 9999, slope: 0.013, desc: '1×13%×C/10' }
    ],
    actionFormulas: [
      { limit: 9999, slope: 0.0025, desc: '1×2.5%×C/10' }
    ]
  },
  {
    name: '长视频贴片广告',
    type: ContentType.LONG_VIDEO,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 200, slope: 0.12, desc: '1×60%×C/5' },
      { limit: 9999, slope: 0.12, desc: '1×60%×C/5' },
    ],
    favorFormulas: [
      { limit: 200, slope: 0.013, desc: '1×6.5%×C/5' },
      { limit: 9999, slope: 0.0104, desc: '0.8×6.5%×C/5' },
    ],
    actionFormulas: [
      { limit: 200, slope: 0.001, desc: '1×0.5%×C/5' },
      { limit: 9999, slope: 0.00105, desc: '1.05×0.5%×C/5' },
    ]
  },
  {
    name: '知乎软广（裂变）',
    type: ContentType.VIRAL,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 10, slope: 0.2, desc: '1×20%×C/1' },
      { limit: 50, slope: 0.18, desc: '0.9×20%×C/1' },
      { limit: 9999, slope: 0.16, desc: '0.8×20%×C/1' },
    ],
    favorFormulas: [
      { limit: 10, slope: 0.015, desc: '1×1.5%×C/1' },
      { limit: 50, slope: 0.0135, desc: '0.9×1.5%×C/1' },
      { limit: 9999, slope: 0.012, desc: '0.8×1.5%×C/1' },
    ],
    actionFormulas: [
      { limit: 10, slope: 0.0016, desc: '1×0.16%×C/1' },
      { limit: 50, slope: 0.00144, desc: '0.9×0.16%×C/1' },
      { limit: 9999, slope: 0.00128, desc: '0.8×0.16%×C/1' },
    ]
  },
  {
    name: '微信公众号',
    type: ContentType.GRAPHIC,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 10, slope: 0.06, desc: '1×60%×C/10' },
      { limit: 30, slope: 0.06, desc: '1×60%×C/10' },
      { limit: 100, slope: 0.06, desc: '1×60%×C/10' },
      { limit: 200, slope: 0.051, desc: '0.85×60%×C/10' },
      { limit: 9999, slope: 0.042, desc: '0.7×60%×C/10' },
    ],
    favorFormulas: [
      { limit: 10, slope: 0.0144, desc: '0.8×18%×C/10' },
      { limit: 30, slope: 0.0162, desc: '0.9×18%×C/10' },
      { limit: 100, slope: 0.018, desc: '1×18%×C/10' },
      { limit: 200, slope: 0.0153, desc: '0.85×18%×C/10' },
      { limit: 9999, slope: 0.0126, desc: '0.7×18%×C/10' },
    ],
    actionFormulas: [
      { limit: 10, slope: 0.0008, desc: '0.8×1%×C/10' },
      { limit: 30, slope: 0.0009, desc: '0.9×1%×C/10' },
      { limit: 100, slope: 0.001, desc: '1×1%×C/10' },
      { limit: 200, slope: 0.001, desc: '1×1%×C/10' },
      { limit: 9999, slope: 0.001, desc: '1×1%×C/10' },
    ]
  },
  {
    name: '垂直媒体硬广',
    type: ContentType.GRAPHIC,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 100, slope: 0.065, desc: '1×65%×C/10' },
      { limit: 200, slope: 0.0585, desc: '0.9×65%×C/10' },
      { limit: 9999, slope: 0.052, desc: '0.8×65%×C/10' },
    ],
    favorFormulas: [
      { limit: 100, slope: 0.009, desc: '1×9%×C/10' },
      { limit: 200, slope: 0.0081, desc: '0.9×9%×C/10' },
      { limit: 9999, slope: 0.0072, desc: '0.8×9%×C/10' },
    ],
    actionFormulas: [
      { limit: 100, slope: 0.002, desc: '1×2%×C/10' },
      { limit: 200, slope: 0.0018, desc: '0.9×2%×C/10' },
      { limit: 9999, slope: 0.0016, desc: '0.8×2%×C/10' },
    ]
  },
  {
    name: '微信广告',
    type: ContentType.GRAPHIC,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 9999, slope: 0.09, desc: '1×90%×C/10' },
    ],
    favorFormulas: [
      { limit: 9999, slope: 0.012, desc: '1×12%×C/10' },
    ],
    actionFormulas: [
      { limit: 9999, slope: 0.0035, desc: '1×3.5%×C/10' },
    ]
  },
  {
    name: '网络展示硬广',
    type: ContentType.GRAPHIC,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 100, slope: 0.07222, desc: '1×65%×C/9' },
      { limit: 9999, slope: 0.065, desc: '0.9×65%×C/9' },
    ],
    favorFormulas: [
      { limit: 100, slope: 0.00888, desc: '1×8%×C/9' },
      { limit: 9999, slope: 0.008, desc: '0.9×8%×C/9' },
    ],
    actionFormulas: [
      { limit: 100, slope: 0.000444, desc: '1×0.4%×C/9' },
      { limit: 9999, slope: 0.0002, desc: '0.9×0.2%×C/9' },
    ]
  },
  {
    name: '微博网红',
    type: ContentType.GRAPHIC,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 5, slope: 0.049, desc: '0.7×7%×C/1' },
      { limit: 30, slope: 0.0595, desc: '0.85×7%×C/1' },
      { limit: 9999, slope: 0.07, desc: '1×7%×C/1' },
    ],
    favorFormulas: [
      { limit: 5, slope: 0.0084, desc: '0.7×1.2%×C/1' },
      { limit: 30, slope: 0.0102, desc: '0.85×1.2%×C/1' },
      { limit: 9999, slope: 0.012, desc: '1×1.2%×C/1' },
    ],
    actionFormulas: [
      { limit: 5, slope: 0.00049, desc: '0.7×0.07%×C/1' },
      { limit: 30, slope: 0.000595, desc: '0.85×0.07%×C/1' },
      { limit: 9999, slope: 0.0007, desc: '1×0.07%×C/1' },
    ]
  },
  {
    name: '知乎软广',
    type: ContentType.GRAPHIC,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 10, slope: 0.1, desc: '1×10%×C/1' },
      { limit: 50, slope: 0.09, desc: '0.9×10%×C/1' },
      { limit: 9999, slope: 0.08, desc: '0.8×10%×C/1' },
    ],
    favorFormulas: [
      { limit: 10, slope: 0.027, desc: '1×2.7%×C/1' },
      { limit: 50, slope: 0.0243, desc: '0.9×2.7%×C/1' },
      { limit: 9999, slope: 0.0216, desc: '0.8×2.7%×C/1' },
    ],
    actionFormulas: [
      { limit: 10, slope: 0.0014, desc: '1×0.14%×C/1' },
      { limit: 50, slope: 0.00126, desc: '0.9×0.14%×C/1' },
      { limit: 9999, slope: 0.00112, desc: '0.8×0.14%×C/1' },
    ]
  },
  {
    name: 'B 站 UP 主（裂变）',
    type: ContentType.VIRAL,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 50, slope: 0.09, desc: '1×90%×C/10' },
      { limit: 200, slope: 0.081, desc: '0.9×90%×C/10' },
      { limit: 9999, slope: 0.072, desc: '0.8×90%×C/10' },
    ],
    favorFormulas: [
      { limit: 50, slope: 0.0095, desc: '1×9.5%×C/10' },
      { limit: 200, slope: 0.00855, desc: '0.9×9.5%×C/10' },
      { limit: 9999, slope: 0.0076, desc: '0.8×9.5%×C/10' },
    ],
    actionFormulas: [
      { limit: 50, slope: 0.0009, desc: '1×0.9%×C/10' },
      { limit: 200, slope: 0.00081, desc: '0.9×0.9%×C/10' },
      { limit: 9999, slope: 0.000765, desc: '0.85×0.9%×C/10' },
    ]
  },
  {
    name: '微博信息流',
    type: ContentType.GRAPHIC,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 10, slope: 0.06071, desc: '0.85×50%×C/7' },
      { limit: 50, slope: 0.06785, desc: '0.95×50%×C/7' },
      { limit: 9999, slope: 0.07142, desc: '1×50%×C/7' },
    ],
    favorFormulas: [
      { limit: 10, slope: 0.00607, desc: '0.85×5%×C/7' },
      { limit: 50, slope: 0.00678, desc: '0.95×5%×C/7' },
      { limit: 9999, slope: 0.00714, desc: '1×5%×C/7' },
    ],
    actionFormulas: [
      { limit: 10, slope: 0.00182, desc: '0.85×1.5%×C/7' },
      { limit: 50, slope: 0.00182, desc: '0.85×1.5%×C/7' },
      { limit: 9999, slope: 0.00214, desc: '1×1.5%×C/7' },
    ]
  },
  {
    name: 'B 站 UP 主',
    type: ContentType.LONG_VIDEO,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 50, slope: 0.05, desc: '1×50%×C/10' },
      { limit: 200, slope: 0.045, desc: '0.9×50%×C/10' },
      { limit: 9999, slope: 0.044, desc: '0.8×55%×C/10' },
    ],
    favorFormulas: [
      { limit: 50, slope: 0.018, desc: '1×18%×C/10' },
      { limit: 200, slope: 0.0162, desc: '0.9×18%×C/10' },
      { limit: 9999, slope: 0.0144, desc: '0.8×18%×C/10' },
    ],
    actionFormulas: [
      { limit: 50, slope: 0.000055, desc: '1×0.055%×C/10' },
      { limit: 200, slope: 0.0000495, desc: '0.9×0.055%×C/10' },
      { limit: 9999, slope: 0.00004675, desc: '0.85×0.055%×C/10' },
    ]
  },
  {
    name: '短视频网红',
    type: ContentType.SHORT_VIDEO,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 25, slope: 0.07, desc: '1×35%×C/5' },
      { limit: 75, slope: 0.07, desc: '1×35%×C/5' },
      { limit: 200, slope: 0.07, desc: '1×35%×C/5' },
      { limit: 9999, slope: 0.07, desc: '1×35%×C/5' },
    ],
    favorFormulas: [
      { limit: 25, slope: 0.0112, desc: '0.7×8%×C/5' },
      { limit: 75, slope: 0.0136, desc: '0.85×8%×C/5' },
      { limit: 200, slope: 0.016, desc: '1×8%×C/5' },
      { limit: 9999, slope: 0.0136, desc: '0.85×8%×C/5' },
    ],
    actionFormulas: [
      { limit: 25, slope: 0.0007, desc: '0.7×0.5%×C/5' },
      { limit: 75, slope: 0.00085, desc: '0.85×0.5%×C/5' },
      { limit: 200, slope: 0.001, desc: '1×0.5%×C/5' },
      { limit: 9999, slope: 0.00085, desc: '0.85×0.5%×C/5' },
    ]
  },
  {
    name: '小红书信息流',
    type: ContentType.GRAPHIC,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 9999, slope: 0.08, desc: '1×80%×C/10' }
    ],
    favorFormulas: [
      { limit: 9999, slope: 0.012, desc: '1×12%×C/10' }
    ],
    actionFormulas: [
      { limit: 9999, slope: 0.0025, desc: '1×2.5%×C/10' }
    ]
  },
  {
    name: '垂直媒体软广',
    type: ContentType.GRAPHIC,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 100, slope: 0.056, desc: '0.8×7%×C/1' },
      { limit: 300, slope: 0.063, desc: '0.9×7%×C/1' },
      { limit: 9999, slope: 0.07, desc: '1×7%×C/1' },
    ],
    favorFormulas: [
      { limit: 100, slope: 0.0128, desc: '0.8×1.6%×C/1' },
      { limit: 300, slope: 0.0144, desc: '0.9×1.6%×C/1' },
      { limit: 9999, slope: 0.016, desc: '1×1.6%×C/1' },
    ],
    actionFormulas: [
      { limit: 100, slope: 0.0008, desc: '0.8×0.1%×C/1' },
      { limit: 300, slope: 0.0009, desc: '0.9×0.1%×C/1' },
      { limit: 9999, slope: 0.001, desc: '1×0.1%×C/1' },
    ]
  },
  {
    name: '微博网红（裂变）',
    type: ContentType.VIRAL,
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 5, slope: 0.091, desc: '0.7×13%×C/1' },
      { limit: 30, slope: 0.1105, desc: '0.85×13%×C/1' },
      { limit: 9999, slope: 0.13, desc: '1×13%×C/1' },
    ],
    favorFormulas: [
      { limit: 5, slope: 0.0049, desc: '0.7×0.7%×C/1' },
      { limit: 30, slope: 0.00595, desc: '0.85×0.7%×C/1' },
      { limit: 9999, slope: 0.007, desc: '1×0.7%×C/1' },
    ],
    actionFormulas: [
      { limit: 5, slope: 0.00056, desc: '0.7×0.08%×C/1' },
      { limit: 30, slope: 0.00068, desc: '0.85×0.08%×C/1' },
      { limit: 9999, slope: 0.0008, desc: '1×0.08%×C/1' },
    ]
  },
  // --- 赞助类 ---
  {
    name: '传统媒体（电视等）',
    type: ContentType.LONG_VIDEO, // Sponsorship
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 9999, slope: 0.18, desc: '1×90%×(0.6~1.4)×C/5' } // Avg 1.0
    ],
    favorFormulas: [
      { limit: 9999, slope: 0.009, desc: '1×4.5%×(0.6~1.4)×C/5' }
    ],
    actionFormulas: [
      { limit: 9999, slope: 0.0009, desc: '1×0.45%×(0.6~1.4)×C/5' }
    ]
  },
  {
    name: '活动（体育赛事等）',
    type: ContentType.LONG_VIDEO, // Sponsorship
    minQuality: Rank.C,
    reachFormulas: [
      { limit: 9999, slope: 0.07, desc: '1×35%×(0.8~1.2)×C/5' } // Avg 1.0
    ],
    favorFormulas: [
      { limit: 9999, slope: 0.0104, desc: '1×5.2%×(0.8~1.2)×C/5' }
    ],
    actionFormulas: [
      { limit: 9999, slope: 0.0006, desc: '1×0.3%×(0.8~1.2)×C/5' }
    ]
  }
];
