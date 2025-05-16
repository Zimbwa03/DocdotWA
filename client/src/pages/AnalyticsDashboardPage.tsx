import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  Line,
  Area,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  CalendarDays, 
  Calendar, 
  Clock, 
  BarChart2, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Award, 
  Target, 
  CheckCircle2, 
  AlertTriangle,
  Brain
} from "lucide-react";

// Temporary user ID for demo purposes
// In a real app, this would come from authentication
const DEMO_USER_ID = 1;

// Time range options for filtering data
const timeRangeOptions = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '3months', label: 'Last 3 Months' },
  { value: '6months', label: 'Last 6 Months' },
  { value: 'all', label: 'All Time' }
];

// Colors for charts
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe',
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
];

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState('30days');
  const [category, setCategory] = useState('all');
  
  // Fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['/api/analytics/user', DEMO_USER_ID, timeRange, category],
    refetchOnWindowFocus: false,
  });

  // Fetch available categories for filtering
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    refetchOnWindowFocus: false,
  });

  // Helper function to format percentages
  const formatPercentage = (value: number) => `${value}%`;

  if (isLoadingAnalytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-80">
          <div className="text-xl text-gray-500">Loading analytics data...</div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-80">
          <div className="text-xl text-gray-500">No analytics data available. Start taking quizzes to see your stats.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your learning progress, identify strengths and areas for improvement.
          </p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <BarChart2 className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories && categories.map((cat: string) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quizzes Taken</p>
                <p className="text-3xl font-bold">{analyticsData.quizzesTaken}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Questions Answered</p>
                <p className="text-3xl font-bold">{analyticsData.questionsAnswered}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Accuracy</p>
                <p className="text-3xl font-bold">{analyticsData.averageAccuracy}%</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                <p className="text-3xl font-bold">{analyticsData.studyStreak} days</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Study Time Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} />
                  Study Time
                </CardTitle>
                <CardDescription>Hours spent studying per day</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.studyTime} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      interval={timeRange === '7days' ? 0 : 'preserveEnd'}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis
                      label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value} hours`, 'Study Time']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar dataKey="hours" fill="#8884d8" name="Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Accuracy Over Time */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Accuracy Trend
                </CardTitle>
                <CardDescription>Your answer accuracy over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.accuracy.filter((item: any) => item.accuracy !== null)} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      interval={timeRange === '7days' ? 0 : 'preserveEnd'}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tickFormatter={formatPercentage}
                      label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Accuracy']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Category Performance */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 size={20} />
                  Category Performance
                </CardTitle>
                <CardDescription>Accuracy by medical category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={analyticsData.categoryPerformance}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      domain={[0, 100]}
                      tickFormatter={formatPercentage}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Accuracy']}
                    />
                    <Bar dataKey="score" fill="#8884d8">
                      {analyticsData.categoryPerformance.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Difficulty Distribution */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon size={20} />
                  Question Difficulty
                </CardTitle>
                <CardDescription>Distribution of questions by difficulty</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <Pie
                      data={analyticsData.difficultyDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.name}
                      labelLine
                    >
                      {analyticsData.difficultyDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} questions`, 'Count']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Learning Velocity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain size={20} />
                Learning Velocity
              </CardTitle>
              <CardDescription>How quickly you're absorbing new information</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.learningVelocity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="velocity" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorVelocity)" 
                    name="Learning Velocity"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Retention Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain size={20} />
                  Knowledge Retention
                </CardTitle>
                <CardDescription>How well you remember content over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.retentionRate} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="daysSinceFirst" 
                      label={{ value: 'Days Since First Exposure', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tickFormatter={formatPercentage}
                      label={{ value: 'Retention %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Retention Rate']}
                      labelFormatter={(label) => `${label} days`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#ffc658" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Strongest Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award size={20} />
                  Strongest Topics
                </CardTitle>
                <CardDescription>Topics you excel at</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData.strongestTopics.map((topic: any, index: number) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{topic.name}</span>
                      <span className="text-green-600 font-bold">{topic.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${topic.accuracy}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {topic.category} • {topic.attempts} questions
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Weakest Topics */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>Topics that need more focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analyticsData.weakestTopics.map((topic: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{topic.name}</span>
                        <span className="text-red-600 font-bold">{topic.accuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-red-500 h-2.5 rounded-full" 
                          style={{ width: `${topic.accuracy}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {topic.category} • {topic.attempts} questions
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-700">
                          Recommended: Review {topic.name} core concepts and take focused quizzes.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Time Analysis Tab */}
        <TabsContent value="time" className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Time of Day Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} />
                  Time of Day Performance
                </CardTitle>
                <CardDescription>When you learn most effectively</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.timeOfDayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#82ca9d"
                      domain={[0, 100]}
                      tickFormatter={formatPercentage}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="questions" fill="#8884d8" name="Questions" />
                    <Bar yAxisId="right" dataKey="accuracy" fill="#82ca9d" name="Accuracy %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Study Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays size={20} />
                  Study Patterns
                </CardTitle>
                <CardDescription>Total study time: {analyticsData.totalStudyTime} hours</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="text-center mb-6">
                  <div className="grid grid-cols-7 gap-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="text-xs font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 mt-2">
                    {Array(7*4).fill(null).map((_, i) => {
                      const randomIntensity = Math.random();
                      const opacity = randomIntensity < 0.3 
                        ? 0.1 
                        : randomIntensity < 0.6 
                          ? 0.4 
                          : randomIntensity < 0.9 
                            ? 0.7 
                            : 1;
                      
                      return (
                        <div 
                          key={i}
                          className="h-6 rounded-sm cursor-pointer bg-primary-foreground hover:bg-primary/30 transition-colors"
                          style={{ opacity }}
                          title={`${Math.floor(randomIntensity * 60)} minutes of study`}
                        />
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Less</span>
                    <div className="flex gap-1">
                      {[0.1, 0.4, 0.7, 1].map((opacity, i) => (
                        <div 
                          key={i}
                          className="h-3 w-3 rounded-sm bg-primary-foreground"
                          style={{ opacity }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">More</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Average: {(analyticsData.totalStudyTime / 30).toFixed(1)} hrs/day
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-8">
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Topic Analysis</CardTitle>
                <CardDescription>Detailed breakdown of topic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-4 py-2 text-left font-medium">Topic</th>
                        <th className="px-4 py-2 text-left font-medium">Category</th>
                        <th className="px-4 py-2 text-left font-medium">Questions</th>
                        <th className="px-4 py-2 text-left font-medium">Accuracy</th>
                        <th className="px-4 py-2 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...analyticsData.strongestTopics, ...analyticsData.weakestTopics]
                        .sort((a, b) => b.accuracy - a.accuracy)
                        .map((topic: any, index: number) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                            <td className="px-4 py-2 border-b">{topic.name}</td>
                            <td className="px-4 py-2 border-b">{topic.category}</td>
                            <td className="px-4 py-2 border-b">{topic.attempts}</td>
                            <td className="px-4 py-2 border-b">
                              <div className="flex items-center">
                                <span className={topic.accuracy > 70 ? 'text-green-600' : 'text-red-600'}>
                                  {topic.accuracy}%
                                </span>
                                <div className="w-24 h-2 bg-gray-200 rounded-full ml-2">
                                  <div 
                                    className={`h-full rounded-full ${topic.accuracy > 70 ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${topic.accuracy}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2 border-b">
                              <span 
                                className={`px-2 py-1 rounded-full text-xs ${
                                  topic.accuracy >= 90
                                    ? 'bg-green-100 text-green-800'
                                    : topic.accuracy >= 70
                                    ? 'bg-blue-100 text-blue-800'
                                    : topic.accuracy >= 50
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {topic.accuracy >= 90
                                  ? 'Mastered'
                                  : topic.accuracy >= 70
                                  ? 'Proficient'
                                  : topic.accuracy >= 50
                                  ? 'Learning'
                                  : 'Needs Review'}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}