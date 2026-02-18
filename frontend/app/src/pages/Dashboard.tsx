import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import {
  Wallet, Plus, TrendingUp, TrendingDown, PiggyBank,
  Receipt, LogOut, DollarSign, Target,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const monthlyData = [
  { month: "Jan", income: 4200, expenses: 3100 },
  { month: "Feb", income: 4200, expenses: 2800 },
  { month: "Mar", income: 4500, expenses: 3400 },
  { month: "Apr", income: 4200, expenses: 2600 },
  { month: "May", income: 4800, expenses: 3200 },
  { month: "Jun", income: 4200, expenses: 2900 },
];

const categoryData = [
  { name: "Housing", value: 1200, color: "hsl(200, 80%, 50%)" },
  { name: "Food", value: 650, color: "hsl(35, 90%, 55%)" },
  { name: "Transport", value: 380, color: "hsl(153, 60%, 38%)" },
  { name: "Entertainment", value: 250, color: "hsl(270, 60%, 55%)" },
  { name: "Shopping", value: 320, color: "hsl(330, 70%, 55%)" },
  { name: "Utilities", value: 180, color: "hsl(0, 72%, 51%)" },
];

const recentExpenses = [
  { id: "1", description: "Grocery Store", amount: 87.34, category: "Food", date: "2026-02-17", method: "debit" },
  { id: "2", description: "Electric Bill", amount: 142.0, category: "Utilities", date: "2026-02-15", method: "credit" },
  { id: "3", description: "Gas Station", amount: 45.5, category: "Transport", date: "2026-02-14", method: "debit" },
  { id: "4", description: "Netflix", amount: 15.99, category: "Entertainment", date: "2026-02-13", method: "credit", recurring: true },
  { id: "5", description: "Restaurant", amount: 62.0, category: "Food", date: "2026-02-12", method: "cash" },
  { id: "6", description: "Rent", amount: 1200.0, category: "Housing", date: "2026-02-01", method: "credit", recurring: true },
];

const savingsGoals = [
  { name: "Emergency Fund", current: 4500, target: 10000 },
  { name: "Vacation", current: 1200, target: 3000 },
  { name: "New Laptop", current: 800, target: 1500 },
];

const totalExpenses = categoryData.reduce((s, c) => s + c.value, 0);
const monthlyBudget = 3500;

const Dashboard = () => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? recentExpenses : recentExpenses.filter((e) => e.category === filter);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-['Space_Grotesk']">CloudLedger</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">noah@cloudledger.io</span>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/"><LogOut className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Budget</p>
                <p className="text-2xl font-bold">${monthlyBudget.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold">${(monthlyBudget - totalExpenses).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <PiggyBank className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Saved</p>
                <p className="text-2xl font-bold">${savingsGoals.reduce((s, g) => s + g.current, 0).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget progress */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Monthly Budget Usage</span>
              <span className="text-sm text-muted-foreground">
                ${totalExpenses.toLocaleString()} / ${monthlyBudget.toLocaleString()}
              </span>
            </div>
            <Progress value={(totalExpenses / monthlyBudget) * 100} className="h-2.5" />
          </CardContent>
        </Card>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-5">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Income vs Expenses</CardTitle>
                  <CardDescription>Last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="income" fill="hsl(153, 60%, 38%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Spending by Category</CardTitle>
                  <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                        {categoryData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium w-28">{cat.name}</span>
                    <Progress value={(cat.value / totalExpenses) * 100} className="h-2 flex-1" />
                    <span className="text-sm text-muted-foreground w-16 text-right">${cat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Expense Trend</CardTitle>
                <CardDescription>Monthly expenses over time</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="expenses" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="income" stroke="hsl(153, 60%, 38%)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Expenses & Savings side by side */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Recent Expenses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Recent Expenses</CardTitle>
                  <CardDescription>Your latest transactions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoryData.map((c) => (
                        <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" className="gap-1 h-8">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {filtered.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                          <Receipt className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{exp.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{exp.date}</span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{exp.method}</Badge>
                            {exp.recurring && <Badge variant="outline" className="text-[10px] px-1.5 py-0">recurring</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-destructive">-${exp.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{exp.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Savings Goals */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Savings Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {savingsGoals.map((goal) => (
                <div key={goal.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{goal.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((goal.current / goal.target) * 100)}% complete
                  </p>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full gap-1 mt-2">
                <Plus className="h-3.5 w-3.5" /> New Goal
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
