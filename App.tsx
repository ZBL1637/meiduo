
import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Coins, Users, Star as StarIcon, BarChart3, Plus, Trash2, AlertCircle, CheckCircle, Film, Radio, Info, LayoutDashboard, ShoppingCart, Calendar as CalendarIcon, ArrowRight, Check, Search, Filter, PieChart, ArrowUp, ArrowDown, Circle, Clock, X } from 'lucide-react';
import { MEDIA_CHANNELS, JOB_ROLES_CONFIG, JOB_PRICES, DURATION_MATRIX, SERIES_COEFFICIENTS } from './constants';
import { MOCK_STARS } from './starData';
import { Star, Rank, ContentType, ProductionPlan, MediaPlan, MediaFormulaStep, JobRole, StarCategory, Gender } from './types';

// --- HELPERS ---

const calculateCumulativeScore = (steps: MediaFormulaStep[], budget: number): number => {
  let remaining = budget;
  let totalScore = 0;
  let prevLimit = 0;

  for (const step of steps) {
    if (remaining <= 0) break;
    const tierCapacity = step.limit - prevLimit;
    const amountInTier = Math.min(remaining, tierCapacity);
    totalScore += amountInTier * step.slope;
    remaining -= amountInTier;
    prevLimit = step.limit;
  }

  return totalScore;
};

const calculateProductionCost = (type: ContentType, roleRanks: Partial<Record<JobRole, Rank>>): number => {
  let total = 0;
  const config = JOB_ROLES_CONFIG[type];
  if (!config) return 0;

  const allRoles = [...config.required, ...config.optional];
  
  allRoles.forEach(role => {
    const rank = roleRanks[role];
    if (rank && rank !== Rank.NONE) {
      const price = JOB_PRICES[role]?.[rank] || 0;
      total += price;
    }
  });

  return total;
};

// Add days to a date string
const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Get difference in days
const getDaysDiff = (start: string, end: string): number => {
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diff = d2.getTime() - d1.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
};

// Rank to Value for Auto Calculation
const getRankScore = (r: Rank): number => {
    switch(r) {
        case Rank.S: return 4;
        case Rank.A: return 3;
        case Rank.B: return 2;
        case Rank.C: return 1;
        default: return 0;
    }
}

const getScoreRank = (score: number): Rank => {
    if (score >= 3.5) return Rank.S;
    if (score >= 2.5) return Rank.A;
    if (score >= 1.5) return Rank.B;
    return Rank.C;
}

// --- COMPONENTS ---

const Sidebar = ({ activePage, setActivePage }: { activePage: string, setActivePage: (p: string) => void }) => {
  const menuItems = [
    { id: 'visualization', label: '投放效果可视化', icon: PieChart },
    { id: 'hiring', label: '1. 雇佣明星', icon: Users },
    { id: 'production', label: '2. 内容制作', icon: Film },
    { id: 'media', label: '3. 媒介投放', icon: ShoppingCart },
    { id: 'calendar', label: '日历工作台', icon: CalendarIcon },
    { id: 'summary', label: '总览 & 评分', icon: LayoutDashboard },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 shadow-lg z-20">
      <div className="p-6 border-b border-slate-100 bg-indigo-600">
         <div className="flex items-center gap-2 text-white">
            <Coins size={24} />
            <span className="font-bold text-xl tracking-tight">Meiduo Sim</span>
         </div>
         <p className="text-indigo-200 text-xs mt-1">营销决策模拟系统</p>
      </div>
      <nav className="flex-1 p-4 space-y-2 mt-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activePage === item.id
                ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm translate-x-1'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} strokeWidth={activePage === item.id ? 2.5 : 2} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
        v1.0.0 Marketing Simulator
      </div>
    </div>
  );
};

const TopBar = ({
  totalBudget,
  hiredStarsCost,
  productionCost,
  mediaCost
}: {
  totalBudget: number;
  hiredStarsCost: number;
  productionCost: number;
  mediaCost: number;
}) => {
  const remaining = totalBudget - hiredStarsCost - productionCost - mediaCost;
  const isLow = remaining < 0;

  return (
    <div className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-end px-8 gap-8 fixed top-0 right-0 left-64 z-10">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">剩余预算</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-400">¥</span>
            <span className={`text-2xl font-bold ${isLow ? 'text-rose-600' : 'text-emerald-600'}`}>
              {remaining.toFixed(1)}
            </span>
            <span className="text-sm font-medium text-slate-500">万</span>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex gap-6 text-xs">
           <div className="flex flex-col">
             <span className="text-slate-400">总预算</span>
             <span className="font-semibold text-slate-700 text-base">{totalBudget}</span>
           </div>
           <div className="flex flex-col">
             <span className="text-slate-400">明星花费</span>
             <span className="font-semibold text-slate-700 text-base">{hiredStarsCost.toFixed(1)}</span>
           </div>
           <div className="flex flex-col">
             <span className="text-slate-400">制作费</span>
             <span className="font-semibold text-slate-700 text-base">{productionCost.toFixed(1)}</span>
           </div>
           <div className="flex flex-col">
             <span className="text-slate-400">媒介费</span>
             <span className="font-semibold text-slate-700 text-base">{mediaCost.toFixed(1)}</span>
           </div>
        </div>
    </div>
  );
};

// --- PAGE 0: VISUALIZATION ---
// Reverted to V1 (Simple but effective)
const MediaVisualizationPage = () => {
  const [simulationBudget, setSimulationBudget] = useState(100);
  const [metric, setMetric] = useState<'reach' | 'favor' | 'action'>('reach');

  // Prepare data for bar chart comparison
  const comparisonData = useMemo(() => {
    return MEDIA_CHANNELS.map(channel => ({
      name: channel.name,
      reach: calculateCumulativeScore(channel.reachFormulas, simulationBudget),
      favor: calculateCumulativeScore(channel.favorFormulas, simulationBudget),
      action: calculateCumulativeScore(channel.actionFormulas, simulationBudget),
    })).sort((a, b) => b[metric] - a[metric]); // Sort by selected metric
  }, [simulationBudget, metric]);

  // Colors for top 3
  const getBarColor = (index: number) => {
    if (index === 0) return '#4f46e5'; // indigo-600
    if (index === 1) return '#818cf8'; // indigo-400
    if (index === 2) return '#c7d2fe'; // indigo-200
    return '#e2e8f0'; // slate-200
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pt-24 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">媒介投放效果可视化</h1>
        <p className="text-slate-500">直观对比不同媒介在相同预算下的预估产出效益，辅助制定投放策略。</p>
      </header>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1">
            <label className="text-sm font-bold text-slate-700 mb-2 block">模拟投入预算 (万元)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="300" 
                value={simulationBudget} 
                onChange={(e) => setSimulationBudget(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-2xl font-bold text-indigo-600 w-20 text-right">{simulationBudget}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">拖动滑块查看不同投入量级下的效益变化（部分媒介存在边际效应递减）</p>
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setMetric('reach')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${metric === 'reach' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              触达力
            </button>
            <button 
              onClick={() => setMetric('favor')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${metric === 'favor' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              好感度
            </button>
            <button 
              onClick={() => setMetric('action')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${metric === 'action' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              行动力
            </button>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[600px]">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
           各渠道效益排行 — {metric === 'reach' ? '预估触达人数' : metric === 'favor' ? '预估好感度得分' : '预估行动转化得分'}
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={comparisonData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={140} 
              stroke="#64748b" 
              fontSize={12} 
              tick={{fill: '#475569', fontWeight: 500}}
              interval={0}
            />
            <RechartsTooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey={metric} name="Score" radius={[0, 4, 4, 0]} barSize={20}>
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- PAGE 1: HIRING ---
// Reverted to V2 (With Sorting)

type SortKey = 'price' | 'fame' | 'availability' | 'rank' | null;
type SortDirection = 'asc' | 'desc';

const StarHiringPage = ({ hiredStars, toggleStar }: { hiredStars: number[], toggleStar: (id: number) => void }) => {
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterMinRank, setFilterMinRank] = useState<string>('all');
  
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: null, direction: 'desc' });

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Helper for rank numerical value
  const getRankValue = (r: Rank) => {
    switch(r) {
      case Rank.S: return 4;
      case Rank.A: return 3;
      case Rank.B: return 2;
      case Rank.C: return 1;
      default: return 0;
    }
  };

  const filteredStars = useMemo(() => {
    return MOCK_STARS.filter(star => {
      const matchName = star.name.includes(filterName);
      const matchCat = filterCategory === 'all' || star.categories.includes(filterCategory);
      const matchGender = filterGender === 'all' || star.gender === filterGender;
      const matchRank = filterMinRank === 'all' || star.rank === filterMinRank;
      return matchName && matchCat && matchGender && matchRank;
    });
  }, [filterName, filterCategory, filterGender, filterMinRank]);

  const sortedStars = useMemo(() => {
    const sorted = [...filteredStars];
    if (!sortConfig.key) return sorted;

    return sorted.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      switch (sortConfig.key) {
        case 'price':
          valA = (a.priceMin + a.priceMax) / 2;
          valB = (b.priceMin + b.priceMax) / 2;
          break;
        case 'fame':
          valA = a.fame;
          valB = b.fame;
          break;
        case 'availability':
          valA = a.availability;
          valB = b.availability;
          break;
        case 'rank':
          valA = getRankValue(a.rank);
          valB = getRankValue(b.rank);
          break;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStars, sortConfig]);

  const renderSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUp className="opacity-0 group-hover:opacity-30" size={14} />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pt-24 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">雇佣明星</h1>
        <p className="text-slate-500">筛选并选择合适的明星代言人。注意预算和档期匹配。</p>
      </header>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Search size={16} /> 搜索姓名
          </label>
          <input 
            type="text" 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="输入名字..."
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Filter size={16} /> 类别
          </label>
          <select 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="all">全部类别</option>
            {Object.values(StarCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">性别</label>
          <select 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={filterGender}
            onChange={e => setFilterGender(e.target.value)}
          >
            <option value="all">全部性别</option>
            {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700">能力级别</label>
           <select 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={filterMinRank}
            onChange={e => setFilterMinRank(e.target.value)}
          >
            <option value="all">全部级别</option>
            <option value={Rank.S}>S级</option>
            <option value={Rank.A}>A级</option>
            <option value={Rank.B}>B级</option>
            <option value={Rank.C}>C级</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 select-none">
            <tr>
              <th className="px-6 py-4 font-medium">选择</th>
              <th className="px-6 py-4 font-medium">姓名</th>
              <th className="px-6 py-4 font-medium">类别</th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 group transition-colors" onClick={() => handleSort('rank')}>
                <div className="flex items-center gap-1">
                  级别 {renderSortIcon('rank')}
                </div>
              </th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 group transition-colors" onClick={() => handleSort('price')}>
                 <div className="flex items-center gap-1">
                  价格范围 (万) {renderSortIcon('price')}
                </div>
              </th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 group transition-colors" onClick={() => handleSort('fame')}>
                 <div className="flex items-center gap-1">
                  名气值 {renderSortIcon('fame')}
                </div>
              </th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 group transition-colors" onClick={() => handleSort('availability')}>
                 <div className="flex items-center gap-1">
                  档期 (天) {renderSortIcon('availability')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedStars.map(star => {
              const isSelected = hiredStars.includes(star.id);
              return (
                <tr key={star.id} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-indigo-50/60' : ''}`}>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStar(star.id)}
                      className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'border-slate-300 hover:border-indigo-400 text-transparent'
                      }`}
                    >
                      <Check size={14} />
                    </button>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{star.name}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {star.categories.map(c => (
                      <span key={c} className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs mr-1">
                        {c}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      star.rank === Rank.S ? 'bg-yellow-100 text-yellow-700' :
                      star.rank === Rank.A ? 'bg-purple-100 text-purple-700' :
                      star.rank === Rank.B ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {star.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono">{star.priceMin} - {star.priceMax}</td>
                  <td className="px-6 py-4 text-slate-600">{star.fame}</td>
                  <td className="px-6 py-4 text-slate-600">{star.availability}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sortedStars.length === 0 && (
           <div className="p-12 text-center text-slate-400">
              没有找到符合条件的明星
           </div>
        )}
      </div>
    </div>
  );
};

// --- PAGE 2: PRODUCTION (Updated) ---

const ProductionPage = ({ 
  plans, 
  hiredStars, 
  addPlan, 
  removePlan 
}: { 
  plans: ProductionPlan[], 
  hiredStars: number[], 
  addPlan: (p: ProductionPlan) => void, 
  removePlan: (id: string) => void 
}) => {
  const [newPlanName, setNewPlanName] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType>(ContentType.LONG_VIDEO);
  const [seriesCount, setSeriesCount] = useState(1);
  const [roleRanks, setRoleRanks] = useState<Partial<Record<JobRole, Rank>>>({});
  
  // Multi-star selection
  const [selectedStarIds, setSelectedStarIds] = useState<number[]>([]);
  const [starSelectorOpen, setStarSelectorOpen] = useState(false);

  // Date States
  const [starStartDate, setStarStartDate] = useState('');
  const [starEndDate, setStarEndDate] = useState('');
  const [postStartDate, setPostStartDate] = useState('');
  const [postEndDate, setPostEndDate] = useState('');

  // Auto-Quality Calculation
  const calculatedQuality = useMemo(() => {
     const requiredRoles = JOB_ROLES_CONFIG[selectedType].required;
     if (requiredRoles.length === 0) return Rank.C; // Default

     let totalScore = 0;
     let count = 0;
     requiredRoles.forEach(role => {
        const rank = roleRanks[role] || Rank.B; // Default B if not set
        totalScore += getRankScore(rank);
        count++;
     });
     const avg = totalScore / count;
     return getScoreRank(avg);
  }, [selectedType, roleRanks]);

  // Duration Calculations based on Matrix and Series
  const [starDays, postDays] = useMemo(() => {
    const baseDurations = DURATION_MATRIX[selectedType]?.[calculatedQuality] || [1, 1];
    const seriesCoef = SERIES_COEFFICIENTS[selectedType] || 0;
    
    const finalStarDays = Math.ceil(baseDurations[0] * (1 + (seriesCount - 1) * 0.2));
    const finalPostDays = Math.ceil(baseDurations[1] * (1 + (seriesCount - 1) * 0.5));

    return [finalStarDays, finalPostDays];
  }, [selectedType, calculatedQuality, seriesCount]);

  // Initialize Ranks
  useEffect(() => {
    const initialRanks: Partial<Record<JobRole, Rank>> = {};
    const config = JOB_ROLES_CONFIG[selectedType];
    config.required.forEach(r => initialRanks[r] = Rank.B); // Default B
    config.optional.forEach(r => initialRanks[r] = Rank.NONE);
    setRoleRanks(initialRanks);
  }, [selectedType]);

  // Date Logic: Chain reaction
  const handleDateChange = (field: 'starStart' | 'starEnd' | 'postStart' | 'postEnd', value: string) => {
    if (!value) return;
    
    if (field === 'starStart') {
      setStarStartDate(value);
      setStarEndDate(addDays(value, starDays));
      const nextDay = addDays(value, starDays + 1);
      setPostStartDate(nextDay);
      setPostEndDate(addDays(nextDay, postDays));
    } else if (field === 'starEnd') {
      setStarEndDate(value);
      setStarStartDate(addDays(value, -starDays));
      const nextDay = addDays(value, 1);
      setPostStartDate(nextDay);
      setPostEndDate(addDays(nextDay, postDays));
    } else if (field === 'postStart') {
      setPostStartDate(value);
      setPostEndDate(addDays(value, postDays));
      const prevDay = addDays(value, -1);
      setStarEndDate(prevDay);
      setStarStartDate(addDays(prevDay, -starDays));
    } else if (field === 'postEnd') {
      setPostEndDate(value);
      setPostStartDate(addDays(value, -postDays));
      const prevDay = addDays(value, -(postDays + 1));
      setStarEndDate(prevDay);
      setStarStartDate(addDays(prevDay, -starDays));
    }
  };

  // Recalculate dates when duration changes (if start date exists)
  useEffect(() => {
      if (starStartDate) {
          handleDateChange('starStart', starStartDate);
      }
  }, [starDays, postDays]);

  const currentCost = useMemo(() => {
     return calculateProductionCost(selectedType, roleRanks) * seriesCount;
  }, [selectedType, roleRanks, seriesCount]);

  const handleAdd = () => {
    if (!newPlanName) return alert("请输入内容名称");
    if (!starStartDate || !postEndDate) return alert("请完善进度规划日期");
    
    const newPlan: ProductionPlan = {
      id: Date.now().toString(),
      name: newPlanName,
      type: selectedType,
      quality: calculatedQuality,
      seriesCount,
      roleRanks: { ...roleRanks },
      starIds: [...selectedStarIds],
      starStartDate,
      starEndDate,
      postStartDate,
      postEndDate,
      starDays,
      postDays,
      cost: currentCost
    };
    addPlan(newPlan);
    setNewPlanName('');
    setSelectedStarIds([]);
    setSeriesCount(1);
  };

  const toggleSelectStar = (id: number) => {
      if (selectedStarIds.includes(id)) {
          setSelectedStarIds(selectedStarIds.filter(sid => sid !== id));
      } else {
          setSelectedStarIds([...selectedStarIds, id]);
      }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto pt-24 animate-in slide-in-from-right-4 duration-500 pb-24">
       <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">内容制作</h1>
          <p className="text-slate-500">制定内容生产计划，配置制作团队，计算制作成本。</p>
        </div>
      </header>

      {/* List */}
      <div className="mb-12 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">已创建计划 ({plans.length})</h3>
          {plans.length === 0 ? (
             <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-slate-400">
                暂无制作计划
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map(plan => (
                <div key={plan.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 relative group hover:shadow-md transition-all">
                   <button 
                      onClick={() => removePlan(plan.id)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                   >
                      <Trash2 size={18} />
                   </button>
                   <div className="mb-2 flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase">{plan.type}</span>
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded uppercase">{plan.quality}级</span>
                   </div>
                   <h4 className="font-bold text-slate-900 text-lg truncate">{plan.name}</h4>
                   <div className="text-xs text-slate-500 mt-2 space-y-1">
                      <div>系列数: {plan.seriesCount}</div> 
                      <div>
                          明星: {plan.starIds.length > 0 ? plan.starIds.map(id => MOCK_STARS.find(s => s.id === id)?.name).join(', ') : '无'}
                      </div>
                      <div>时间: {plan.starStartDate}{' → '}{plan.postEndDate}</div>
                   </div>
                   <div className="text-lg font-mono font-bold text-indigo-600 mt-3 text-right">
                      ¥ {plan.cost.toFixed(2)} 万
                   </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* New Plan Form - Split Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 bg-indigo-50/50">
            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <Plus className="text-indigo-600" size={20}/> 新建制作计划
            </h3>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            {/* LEFT: Information Entry (7 cols) */}
            <div className="lg:col-span-7 p-6 space-y-8">
               
               {/* Core Content Module */}
               <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                    <h4 className="font-bold text-slate-800">核心内容</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">内容名称 <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="输入名称"
                          value={newPlanName}
                          onChange={e => setNewPlanName(e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">选择明星 (可多选)</label>
                        <div className="relative">
                            <div 
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white min-h-[38px] flex flex-wrap gap-1 cursor-pointer"
                                onClick={() => setStarSelectorOpen(!starSelectorOpen)}
                            >
                                {selectedStarIds.length === 0 && <span className="text-slate-400">-- 无 --</span>}
                                {selectedStarIds.map(id => {
                                    const s = MOCK_STARS.find(star => star.id === id);
                                    return (
                                        <span key={id} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                                            {s?.name}
                                            <span className="hover:text-indigo-900" onClick={(e) => { e.stopPropagation(); toggleSelectStar(id); }}>
                                                <X size={12}/>
                                            </span>
                                        </span>
                                    )
                                })}
                            </div>
                            {starSelectorOpen && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto p-2 grid grid-cols-2 gap-2">
                                    {hiredStars.map(id => {
                                        const star = MOCK_STARS.find(s => s.id === id);
                                        if (!star) return null;
                                        const isSelected = selectedStarIds.includes(id);
                                        return (
                                            <div 
                                                key={id} 
                                                className={`p-2 text-xs rounded cursor-pointer flex items-center justify-between ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}
                                                onClick={() => toggleSelectStar(id)}
                                            >
                                                {star.name}
                                                {isSelected && <Check size={12}/>}
                                            </div>
                                        )
                                    })}
                                    {hiredStars.length === 0 && <div className="col-span-2 text-center text-xs text-slate-400 py-2">请先去雇佣明星</div>}
                                </div>
                            )}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">内容类型 <span className="text-red-500">*</span></label>
                        <select 
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                          value={selectedType}
                          onChange={e => setSelectedType(e.target.value as ContentType)}
                        >
                          {Object.values(ContentType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">系列数</label>
                        <input 
                          type="number" 
                          min="1"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={seriesCount}
                          onChange={e => setSeriesCount(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                     </div>
                  </div>
                  
                  {/* Roles & Quality */}
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                     <div className="col-span-full flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                       <span className="text-xs font-bold text-slate-500 uppercase">人员 / 资源配置</span>
                       <div className="flex items-center gap-2">
                         <label className="text-xs text-slate-500">整体质量 (自动计算):</label>
                         <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                             calculatedQuality === Rank.S ? 'bg-yellow-100 text-yellow-700' :
                             calculatedQuality === Rank.A ? 'bg-purple-100 text-purple-700' :
                             calculatedQuality === Rank.B ? 'bg-blue-100 text-blue-700' :
                             'bg-slate-200 text-slate-600'
                         }`}>
                            {calculatedQuality}级
                         </span>
                       </div>
                     </div>
                     {/* Render Required Roles */}
                     {JOB_ROLES_CONFIG[selectedType].required.map(role => (
                        <div key={role} className="flex items-center justify-between">
                           <label className="text-xs text-slate-600">{role} <span className="text-red-400">*</span></label>
                           <select 
                              className="text-xs w-24 bg-white border border-slate-200 rounded px-2 py-1"
                              value={roleRanks[role] || Rank.B}
                              onChange={e => setRoleRanks({...roleRanks, [role]: e.target.value as Rank})}
                           >
                             <option value={Rank.S}>S ({(JOB_PRICES[role][Rank.S]).toFixed(1)}w)</option>
                             <option value={Rank.A}>A ({(JOB_PRICES[role][Rank.A]).toFixed(1)}w)</option>
                             <option value={Rank.B}>B ({(JOB_PRICES[role][Rank.B]).toFixed(1)}w)</option>
                             <option value={Rank.C}>C ({(JOB_PRICES[role][Rank.C]).toFixed(1)}w)</option>
                           </select>
                        </div>
                     ))}
                      {/* Render Optional Roles */}
                      {JOB_ROLES_CONFIG[selectedType].optional.map(role => (
                        <div key={role} className="flex items-center justify-between">
                           <label className="text-xs text-slate-400">{role} (可选)</label>
                           <select 
                              className="text-xs w-24 bg-white border border-slate-200 rounded px-2 py-1 text-slate-500"
                              value={roleRanks[role] || Rank.NONE}
                              onChange={e => setRoleRanks({...roleRanks, [role]: e.target.value as Rank})}
                           >
                             <option value={Rank.NONE}>无</option>
                             <option value={Rank.S}>S ({(JOB_PRICES[role][Rank.S]).toFixed(1)}w)</option>
                             <option value={Rank.A}>A ({(JOB_PRICES[role][Rank.A]).toFixed(1)}w)</option>
                             <option value={Rank.B}>B ({(JOB_PRICES[role][Rank.B]).toFixed(1)}w)</option>
                             <option value={Rank.C}>C ({(JOB_PRICES[role][Rank.C]).toFixed(1)}w)</option>
                           </select>
                        </div>
                     ))}
                  </div>
               </section>

            </div>

            {/* RIGHT: Schedule Planning (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-slate-50 h-full flex flex-col">
               <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Clock size={18} className="text-indigo-600"/> 进度规划
               </h4>
               
               {/* Visual Bar */}
               <div className="mb-8">
                  <div className="flex h-12 rounded-lg overflow-hidden shadow-sm mb-2 font-bold text-white text-xs md:text-sm text-center leading-[48px]">
                     <div className="bg-orange-400 flex-1 relative group cursor-help transition-all duration-500" style={{ flex: starDays }}>
                        明星工作天数 ({starDays}天)
                        <div className="absolute top-0 left-0 w-6 h-6 bg-black/10 text-[10px] leading-6">1</div>
                     </div>
                     <div className="bg-indigo-500 flex-1 relative group cursor-help transition-all duration-500" style={{ flex: postDays }}>
                        后期制作天数 ({postDays}天)
                         <div className="absolute top-0 left-0 w-6 h-6 bg-black/10 text-[10px] leading-6">2</div>
                     </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                     <span>Start: {starStartDate || '-'}</span>
                     <span>End: {postEndDate || '-'}</span>
                  </div>
               </div>

               {/* Tips */}
               <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6 text-xs text-slate-500 space-y-1">
                  <p className="font-bold text-slate-700 mb-1">Tips</p>
                  <p>• 「明星工作天数」根据所选内容类型及系列数自动计算</p>
                  <p>• 「后期制作天数」根据内容类型、系列及整体质量自动计算</p>
                  <p>• 「 | 」从左到右默认日期+1，可能根据突发事件延长</p>
                  <p>• 以下 4 个日期任选其一填写，剩余日期根据上述天数自动生成</p>
               </div>

               {/* Date Inputs */}
               <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                     <div className="w-6 h-6 bg-slate-800 text-white rounded flex items-center justify-center text-xs font-bold">1</div>
                     <div className="flex-1 space-y-1">
                        <label className="text-xs text-slate-500">明星工作的起始日期</label>
                        <input type="date" className="w-full px-3 py-2 text-sm border rounded bg-white" value={starStartDate} onChange={e => handleDateChange('starStart', e.target.value)} />
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-6 h-6 bg-slate-800 text-white rounded flex items-center justify-center text-xs font-bold">2</div>
                     <div className="flex-1 space-y-1">
                        <label className="text-xs text-slate-500">明星工作的结束日期</label>
                        <input type="date" className="w-full px-3 py-2 text-sm border rounded bg-white" value={starEndDate} onChange={e => handleDateChange('starEnd', e.target.value)} />
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-6 h-6 bg-slate-800 text-white rounded flex items-center justify-center text-xs font-bold">3</div>
                     <div className="flex-1 space-y-1">
                        <label className="text-xs text-slate-500">后期制作的起始日期</label>
                        <input type="date" className="w-full px-3 py-2 text-sm border rounded bg-white" value={postStartDate} onChange={e => handleDateChange('postStart', e.target.value)} />
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-6 h-6 bg-slate-800 text-white rounded flex items-center justify-center text-xs font-bold">4</div>
                     <div className="flex-1 space-y-1">
                        <label className="text-xs text-slate-500">后期制作的结束日期</label>
                        <input type="date" className="w-full px-3 py-2 text-sm border rounded bg-white" value={postEndDate} onChange={e => handleDateChange('postEnd', e.target.value)} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Sticky Bottom Footer */}
      <div className="fixed bottom-0 right-0 left-64 bg-white border-t border-slate-200 p-4 px-8 shadow-lg z-20 flex items-center justify-end gap-8">
         <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase font-bold">总花费 (万元)</span>
            <span className="text-3xl font-bold text-red-500">{currentCost.toFixed(2)}</span>
         </div>
         <button 
            onClick={handleAdd}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 transition-transform active:scale-95"
         >
            确认添加计划
         </button>
      </div>
    </div>
  );
};

// --- NEW PAGE: CALENDAR WORKBENCH ---

const CalendarWorkbenchPage = ({ 
  productionPlans, 
  mediaPlans,
  updateProductionPlanDate,
  updateMediaPlanDate
}: { 
  productionPlans: ProductionPlan[], 
  mediaPlans: MediaPlan[],
  updateProductionPlanDate: (id: string, newStartDate: string) => void,
  updateMediaPlanDate: (id: string, newStartDate: string) => void
}) => {
  
  // Simple timeline visualization
  // We will list all items and show a visual bar relative to a time range
  // For MVP, we just list them with editable start dates and show duration

  return (
    <div className="p-8 max-w-7xl mx-auto pt-24 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">日历工作台</h1>
        <p className="text-slate-500">查看并调整内容制作与媒介投放的整体排期。</p>
      </header>

      <div className="space-y-8">
        {/* Production Timeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             <Film className="text-indigo-600" size={20} /> 内容制作排期
           </h3>
           {productionPlans.length === 0 ? <p className="text-slate-400 text-sm">暂无制作计划</p> : (
             <div className="space-y-4">
               {productionPlans.map(plan => (
                 <div key={plan.id} className="border border-slate-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-48">
                       <div className="font-bold text-slate-800">{plan.name}</div>
                       <div className="text-xs text-slate-500">{plan.type} | {plan.quality}级</div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                       {/* Timeline Bar Visual */}
                       <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex text-[10px] text-white text-center leading-4">
                          <div className="bg-orange-400" style={{ flex: plan.starDays }}>明星 ({plan.starDays}d)</div>
                          <div className="bg-indigo-500" style={{ flex: plan.postDays }}>后期 ({plan.postDays}d)</div>
                       </div>
                       <div className="flex justify-between text-xs text-slate-400">
                          <span>Total: {plan.starDays + plan.postDays} Days</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="flex flex-col">
                          <label className="text-[10px] text-slate-400">Start Date</label>
                          <input 
                            type="date" 
                            className="text-xs border rounded px-2 py-1"
                            value={plan.starStartDate}
                            onChange={(e) => updateProductionPlanDate(plan.id, e.target.value)}
                          />
                       </div>
                       <ArrowRight size={16} className="text-slate-300 mt-4"/>
                       <div className="flex flex-col">
                          <label className="text-[10px] text-slate-400">End Date</label>
                          <div className="text-xs border border-transparent px-2 py-1 text-slate-600">{plan.postEndDate}</div>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Media Timeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             <ShoppingCart className="text-emerald-600" size={20} /> 媒介投放排期
           </h3>
           {mediaPlans.length === 0 ? <p className="text-slate-400 text-sm">暂无投放计划</p> : (
             <div className="space-y-4">
               {mediaPlans.map(plan => {
                 const days = getDaysDiff(plan.startDate, plan.endDate);
                 return (
                   <div key={plan.id} className="border border-slate-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className="w-48">
                         <div className="font-bold text-slate-800">{plan.channelName}</div>
                         <div className="text-xs text-slate-500">预算: {plan.budget}w</div>
                      </div>
                      <div className="flex-1">
                         <div className="h-4 bg-emerald-100 rounded-full overflow-hidden relative">
                            <div className="absolute inset-0 bg-emerald-500/20"></div>
                            <div className="absolute inset-y-0 left-0 bg-emerald-500 w-full text-[10px] text-white text-center leading-4">
                               投放周期 ({days} Days)
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="flex flex-col">
                            <label className="text-[10px] text-slate-400">Start Date</label>
                            <input 
                              type="date" 
                              className="text-xs border rounded px-2 py-1"
                              value={plan.startDate}
                              onChange={(e) => updateMediaPlanDate(plan.id, e.target.value)}
                            />
                         </div>
                         <ArrowRight size={16} className="text-slate-300 mt-4"/>
                         <div className="flex flex-col">
                            <label className="text-[10px] text-slate-400">End Date</label>
                            <div className="text-xs border border-transparent px-2 py-1 text-slate-600">{plan.endDate}</div>
                         </div>
                      </div>
                   </div>
                 )
               })}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- PAGE 3: MEDIA ---

const MediaBuyingPage = ({ 
  plans, 
  mediaPlans, 
  addMediaPlan, 
  removeMediaPlan 
}: { 
  plans: ProductionPlan[], 
  mediaPlans: MediaPlan[], 
  addMediaPlan: (p: MediaPlan) => void, 
  removeMediaPlan: (id: string) => void 
}) => {
  const [selectedChannelIdx, setSelectedChannelIdx] = useState(0);
  const [budget, setBudget] = useState<number>(0);
  const [linkedContentId, setLinkedContentId] = useState<string>('');
  const [mediaEfficiency, setMediaEfficiency] = useState<number>(100);
  const [startDate, setStartDate] = useState('2025-10-11');
  const [endDate, setEndDate] = useState('2026-03-11');

  const channel = MEDIA_CHANNELS[selectedChannelIdx];

  // Real-time projection with efficiency
  const projection = useMemo(() => {
    if (!channel || budget <= 0) return { reach: 0, favor: 0, action: 0 };
    const efficiencyFactor = mediaEfficiency / 100;
    return {
      reach: calculateCumulativeScore(channel.reachFormulas, budget) * efficiencyFactor,
      favor: calculateCumulativeScore(channel.favorFormulas, budget) * efficiencyFactor,
      action: calculateCumulativeScore(channel.actionFormulas, budget) * efficiencyFactor,
    };
  }, [channel, budget, mediaEfficiency]);

  const handleAdd = () => {
    if (budget <= 0) return alert("预算必须大于0");
    if (!linkedContentId) return alert("请选择投放内容");
    
    const newPlan: MediaPlan = {
      id: Date.now().toString(),
      channelName: channel.name,
      budget,
      mediaEfficiency,
      contentId: linkedContentId,
      startDate,
      endDate,
      projectedReach: projection.reach,
      projectedFavor: projection.favor,
      projectedAction: projection.action
    };
    addMediaPlan(newPlan);
    setBudget(0);
    setMediaEfficiency(100);
  };

  // Visualization Data for current channel
  const chartData = useMemo(() => {
    const data = [];
    const efficiencyFactor = mediaEfficiency / 100;
    for (let b = 0; b <= Math.min(budget * 1.5 || 100, 300); b += (budget > 100 ? 10 : 5)) {
       data.push({
         budget: b,
         reach: calculateCumulativeScore(channel.reachFormulas, b) * efficiencyFactor,
         action: calculateCumulativeScore(channel.actionFormulas, b) * efficiencyFactor * 10, // Scale for visibility
       });
    }
    return data;
  }, [channel, budget, mediaEfficiency]);

  return (
    <div className="p-8 max-w-7xl mx-auto pt-24 animate-in slide-in-from-right-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">媒介投放</h1>
        <p className="text-slate-500">选择投放渠道，设定预算，关联内容物料。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Config */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
           <h3 className="text-lg font-bold text-slate-800 mb-6">新建投放计划</h3>
           
           <div className="space-y-6">
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">投放类型</label>
               <select 
                 className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                 value={selectedChannelIdx}
                 onChange={e => setSelectedChannelIdx(parseInt(e.target.value))}
               >
                 {MEDIA_CHANNELS.map((c, idx) => (
                   <option key={idx} value={idx}>{c.name} ({c.type})</option>
                 ))}
               </select>
               <div className="text-xs text-slate-500 mt-1">
                  最低质量要求: <span className="font-bold text-indigo-600">{channel.minQuality}级</span>
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">投放内容</label>
               <select 
                 className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                 value={linkedContentId}
                 onChange={e => setLinkedContentId(e.target.value)}
               >
                 <option value="">-- 请选择制作内容 --</option>
                 {plans
                   .filter(p => p.type === channel.type) // Filter by matching type
                   .map(p => (
                     <option key={p.id} value={p.id}>{p.name}</option>
                 ))}
               </select>
               {plans.length > 0 && !plans.some(p => p.type === channel.type) && (
                 <div className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> 无匹配类型的内容 ({channel.type})
                 </div>
               )}
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">投放预算 (万元)</label>
               <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">¥</span>
                 <input 
                    type="number" 
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-semibold text-slate-800"
                    value={budget}
                    onChange={e => setBudget(parseFloat(e.target.value) || 0)}
                 />
               </div>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">媒介效率 (%)</label>
                <div className="flex items-center gap-4">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={mediaEfficiency} 
                        onChange={(e) => setMediaEfficiency(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-sm font-bold text-indigo-600 w-12 text-right">{mediaEfficiency}%</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">开始日期</label>
                   <input type="date" className="w-full px-2 py-2 border rounded-lg text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">结束日期</label>
                   <input type="date" className="w-full px-2 py-2 border rounded-lg text-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
             </div>

             <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 space-y-2">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">预估效果 (已含效率折扣)</div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">触达:</span>
                  <span className="font-mono font-bold">{projection.reach.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">好感:</span>
                  <span className="font-mono font-bold">{projection.favor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">行动:</span>
                  <span className="font-mono font-bold">{projection.action.toFixed(2)}</span>
                </div>
             </div>

             <button 
               onClick={handleAdd}
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 transition-all"
             >
               确认投放
             </button>
           </div>
        </div>

        {/* Right Panel: Visualization & List */}
        <div className="lg:col-span-8 space-y-8">
           {/* Chart */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase">投入产出效益曲线 (当前渠道)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="budget" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} label={{ value: '投入(万)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="reach" stroke="#6366f1" strokeWidth={2} name="触达" dot={false} />
                    <Line type="monotone" dataKey="action" stroke="#10b981" strokeWidth={2} name="行动(x10)" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Table */}
           <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-700">投放列表</h3>
                 <span className="text-xs text-slate-500">共 {mediaPlans.length} 项</span>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">渠道</th>
                    <th className="px-4 py-3">时间</th>
                    <th className="px-4 py-3 text-right">预算</th>
                    <th className="px-4 py-3 text-right">效率</th>
                    <th className="px-4 py-3 text-right">触达</th>
                    <th className="px-4 py-3 text-right">好感</th>
                    <th className="px-4 py-3 text-right">行动</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mediaPlans.map(plan => (
                    <tr key={plan.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {plan.channelName}
                        {plan.contentId && <span className="ml-2 text-xs bg-slate-100 px-1 rounded text-slate-500">关联内容</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                         {plan.startDate} <br/> {plan.endDate}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">¥{plan.budget}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{plan.mediaEfficiency}%</td>
                      <td className="px-4 py-3 text-right text-slate-600">{plan.projectedReach.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{plan.projectedFavor.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{plan.projectedAction.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => removeMediaPlan(plan.id)} className="text-slate-300 hover:text-red-500">
                           <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- PAGE 4: SUMMARY ---

const SummaryPage = ({ 
  mediaPlans, 
  totalBudget, 
  remainingBudget 
}: { 
  mediaPlans: MediaPlan[], 
  totalBudget: number, 
  remainingBudget: number 
}) => {
  const [strategyScore, setStrategyScore] = useState(80);
  const [goodwillWeight, setGoodwillWeight] = useState(1);
  const [actionWeight, setActionWeight] = useState(1);

  const totals = useMemo(() => {
    return mediaPlans.reduce((acc, p) => ({
      reach: acc.reach + p.projectedReach,
      favor: acc.favor + p.projectedFavor,
      action: acc.action + p.projectedAction
    }), { reach: 0, favor: 0, action: 0 });
  }, [mediaPlans]);

  // Total Score Formula: (Strategy/100) * (Reach*1 + Favor*GW + Action*AW)
  const finalScore = (strategyScore / 100) * (totals.reach + totals.favor * goodwillWeight + totals.action * actionWeight);

  return (
    <div className="p-8 max-w-5xl mx-auto pt-24 animate-in zoom-in-95 duration-500">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">营销策略评估报告</h1>
        <p className="text-slate-500 text-lg">综合各项投放数据与策略评分</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-2">预计总触达</div>
            <div className="text-4xl font-bold text-slate-800">{totals.reach.toFixed(0)}</div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-2">预计总好感</div>
            <div className="text-4xl font-bold text-slate-800">{totals.favor.toFixed(0)}</div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500"></div>
            <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-2">预计总行动</div>
            <div className="text-4xl font-bold text-slate-800">{totals.action.toFixed(0)}</div>
         </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BarChart3 className="text-indigo-600" /> 评分参数调整
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">策略得分 (0-100)</label>
             <input 
               type="number" 
               className="w-full px-4 py-3 rounded-xl border border-slate-200 text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
               value={strategyScore}
               onChange={e => setStrategyScore(parseFloat(e.target.value))}
             />
             <p className="text-xs text-slate-400">基于方案创意与完整性的主观评分</p>
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">好感加权</label>
             <input 
               type="number" 
               step="0.1"
               className="w-full px-4 py-3 rounded-xl border border-slate-200 text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
               value={goodwillWeight}
               onChange={e => setGoodwillWeight(parseFloat(e.target.value))}
             />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">行动加权</label>
             <input 
               type="number" 
               step="0.1"
               className="w-full px-4 py-3 rounded-xl border border-slate-200 text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
               value={actionWeight}
               onChange={e => setActionWeight(parseFloat(e.target.value))}
             />
           </div>
        </div>

        <div className="mt-10 p-8 bg-slate-900 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
           <div>
              <h4 className="text-slate-400 text-sm uppercase font-semibold mb-1">最终评估得分</h4>
              <p className="text-slate-500 text-xs">Score = (策略% * (触达 + 好感*W1 + 行动*W2))</p>
           </div>
           <div className="text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              {finalScore.toLocaleString(undefined, { maximumFractionDigits: 0 })}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [activePage, setActivePage] = useState('visualization');
  const [totalBudget] = useState(590);
  const [hiredStars, setHiredStars] = useState<number[]>([]);
  const [productionPlans, setProductionPlans] = useState<ProductionPlan[]>([]);
  const [mediaPlans, setMediaPlans] = useState<MediaPlan[]>([]);

  // Calculate Costs
  const hiredStarsCost = useMemo(() => {
    return hiredStars.reduce((total, id) => {
      const star = MOCK_STARS.find(s => s.id === id);
      if (!star) return total;
      return total + (star.priceMin + star.priceMax) / 2; // Avg price
    }, 0);
  }, [hiredStars]);

  const productionCost = useMemo(() => {
    return productionPlans.reduce((acc, p) => acc + p.cost, 0);
  }, [productionPlans]);

  const mediaCost = useMemo(() => {
    return mediaPlans.reduce((acc, p) => acc + p.budget, 0);
  }, [mediaPlans]);

  const remainingBudget = totalBudget - hiredStarsCost - productionCost - mediaCost;

  // Actions
  const toggleStar = (id: number) => {
    if (hiredStars.includes(id)) {
      setHiredStars(hiredStars.filter(sid => sid !== id));
    } else {
      setHiredStars([...hiredStars, id]);
    }
  };

  const addProductionPlan = (plan: ProductionPlan) => {
    setProductionPlans([...productionPlans, plan]);
  };

  const removeProductionPlan = (id: string) => {
    setProductionPlans(productionPlans.filter(p => p.id !== id));
    // Also remove link from media plans? Optional.
  };

  const addMediaPlan = (plan: MediaPlan) => {
    setMediaPlans([...mediaPlans, plan]);
  };

  const removeMediaPlan = (id: string) => {
    setMediaPlans(mediaPlans.filter(p => p.id !== id));
  };

  const updateProductionPlanDate = (id: string, newStartDate: string) => {
    setProductionPlans(plans => plans.map(p => {
        if (p.id !== id) return p;
        // Recalculate timeline based on new start date
        const newStarEnd = addDays(newStartDate, p.starDays);
        const newPostStart = addDays(newStartDate, p.starDays + 1);
        const newPostEnd = addDays(newPostStart, p.postDays);
        return {
            ...p,
            starStartDate: newStartDate,
            starEndDate: newStarEnd,
            postStartDate: newPostStart,
            postEndDate: newPostEnd
        };
    }));
  };

  const updateMediaPlanDate = (id: string, newStartDate: string) => {
      setMediaPlans(plans => plans.map(p => {
          if (p.id !== id) return p;
          const duration = getDaysDiff(p.startDate, p.endDate);
          const newEndDate = addDays(newStartDate, duration);
          return {
              ...p,
              startDate: newStartDate,
              endDate: newEndDate
          };
      }));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="flex-1 ml-64 relative">
        <TopBar 
          totalBudget={totalBudget}
          hiredStarsCost={hiredStarsCost}
          productionCost={productionCost}
          mediaCost={mediaCost}
        />

        <main className="min-h-screen pb-12">
          {/* 
             Use display toggling instead of conditional rendering 
             to preserve component state (form inputs, scroll position, etc.) 
          */}
          <div className={activePage === 'visualization' ? 'block' : 'hidden'}>
            <MediaVisualizationPage />
          </div>
          
          <div className={activePage === 'hiring' ? 'block' : 'hidden'}>
            <StarHiringPage hiredStars={hiredStars} toggleStar={toggleStar} />
          </div>

          <div className={activePage === 'production' ? 'block' : 'hidden'}>
            <ProductionPage 
              plans={productionPlans} 
              hiredStars={hiredStars}
              addPlan={addProductionPlan}
              removePlan={removeProductionPlan}
            />
          </div>

          <div className={activePage === 'media' ? 'block' : 'hidden'}>
            <MediaBuyingPage 
              plans={productionPlans}
              mediaPlans={mediaPlans}
              addMediaPlan={addMediaPlan}
              removeMediaPlan={removeMediaPlan}
            />
          </div>

          <div className={activePage === 'calendar' ? 'block' : 'hidden'}>
             <CalendarWorkbenchPage 
                productionPlans={productionPlans}
                mediaPlans={mediaPlans}
                updateProductionPlanDate={updateProductionPlanDate}
                updateMediaPlanDate={updateMediaPlanDate}
             />
          </div>

          <div className={activePage === 'summary' ? 'block' : 'hidden'}>
            <SummaryPage 
              mediaPlans={mediaPlans}
              totalBudget={totalBudget}
              remainingBudget={remainingBudget}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
