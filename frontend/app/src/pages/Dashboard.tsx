import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import API_URL from "../config";


const Dashboard = () => {
    // State for new category dialog
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const monthlyBudget = user?.monthly_budget ?? 3500;
  const [showExpenseInput, setShowExpenseInput] = useState(false);
  const [expenseInput, setExpenseInput] = useState({
    description: "",
    amount: "",
    category: categories[0]?.name || "",
    paymentMethod: "debit"
});

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const resCat = await fetch(`${API_URL}/api/categories`, { credentials: "include" });
      const catData = await resCat.json();
      setCategories(catData || []);
      // Flatten expenses from all categories
      const allExpenses = catData.flatMap((cat) => (cat.expenses || []).map((exp) => ({ ...exp, category: cat.name })));
      setExpenses(allExpenses);

      // Fetch savings goals
      try {
        const resSavings = await fetch(`${API_URL}/api/saving_goals`, { credentials: "include" });
        if (resSavings.ok) {
          const savingsData = await resSavings.json();
          setSavingsGoals(savingsData || []);
        }
      } catch {
        setSavingsGoals([]);
      }
    } catch (err) {
      setCategories([]);
      setExpenses([]);
      setSavingsGoals([]);
    }
    setLoading(false);
  };
  fetchData();
}, []);

const filtered = filter === "all" ? expenses : expenses.filter((e) => e.category === filter);

const totalExpenses = expenses.reduce((s, c) => s + (c.amount || 0), 0);

const handleLogout = () => {
  logout();
  navigate("/");
};

const handleExpenseInputChange = (field, value) => {
  setExpenseInput((prev) => ({ ...prev, [field]: value }));
};

const handleAddExpenseFromDashboard = async () => {
    // ...existing code...
  if (!expenseInput.description || !expenseInput.amount || !expenseInput.category) return;
  try {
    const cat = categories.find((c) => c.name === expenseInput.category);
    if (!cat) return;
    const res = await fetch(`${API_URL}/api/categories/${cat._id}/expense`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        category_id: cat._id,
        amount: parseFloat(expenseInput.amount),
        description: expenseInput.description,
        transaction_date: new Date().toISOString(),
        payment_method: expenseInput.paymentMethod,
        frequency: "one_time",
      }),
    });
    if (res.ok) {
      setShowExpenseInput(false);
      setExpenseInput({ description: "", amount: "", category: categories[0]?.name || "", paymentMethod: "debit" });
      navigate("/dashboard/expenses");
    }
  } catch {}
 };

  // Add new category logic (copied/adapted from Expenses.tsx)
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (res.ok) {
        // Refresh categories and select the new one after fetch
        const resCat = await fetch(`${API_URL}/api/categories`, { credentials: "include" });
        const catData = await resCat.json();
        setCategories(catData || []);
        setExpenseInput((prev) => ({ ...prev, category: newCategoryName }));
        setNewCategoryName("");
        setOpenCategoryDialog(false);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

const pieColors = [
  '#6366F1', // indigo
  '#F59E42', // orange
  '#10B981', // green
  '#EF4444', // red
  '#FBBF24', // yellow
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#F472B6', // rose
  '#22D3EE', // cyan
  '#A3E635', // lime
  '#F87171', // light red
  '#6EE7B7', // teal
  '#FDE68A', // light yellow
  '#818CF8', // light indigo
];
const categoryData = categories.map((cat, i) => ({
  name: cat.name,
  value: (cat.expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0),
  color: pieColors[i % pieColors.length],
}));

const getMonth = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const months = Array.from(new Set(expenses.map(e => getMonth(e.date || e.transaction_date || e.transactionDate)))).sort();
const monthlyData = months.map(month => {
  const monthExpenses = expenses.filter(e => getMonth(e.date || e.transaction_date || e.transactionDate) === month);
  return {
    month,
    expenses: monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    income: 0 // Placeholder, update if you have income data
  };
});


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
          {user && (
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Welcome section */}
      {user && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user.first_name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your financial overview and recent activity
          </p>
        </div>
      )}

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
                <Button size="sm" className="gap-1 h-8" onClick={() => setShowExpenseInput(true)}>
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

        {/* Savings Goals Card */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">Savings Goals</CardTitle>
                <CardDescription>Track your progress</CardDescription>
              </div>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <PiggyBank className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {savingsGoals.length > 0 ? (() => {
                const totalSaved = savingsGoals.reduce((sum, g) => sum + (g.current_amount || 0), 0);
                const totalTarget = savingsGoals.reduce((sum, g) => sum + (g.goal_amount || 0), 0);
                const overallPct = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
                const sorted = [...savingsGoals].sort((a, b) => {
                  const pctA = a.goal_amount > 0 ? a.current_amount / a.goal_amount : 0;
                  const pctB = b.goal_amount > 0 ? b.current_amount / b.goal_amount : 0;
                  return pctB - pctA;
                }).slice(0, 3);
                return (
                  <>
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Total Saved</span>
                        <span className="font-semibold">${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${totalTarget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <Progress value={Math.min(overallPct, 100)} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right mt-1">{overallPct.toFixed(1)}%</p>
                    </div>
                    <div className="space-y-3 pt-1">
                      {sorted.map((goal) => {
                        const pct = goal.goal_amount > 0 ? (goal.current_amount / goal.goal_amount) * 100 : 0;
                        return (
                          <div key={goal._id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium truncate">{goal.name}</span>
                              <span className="text-xs text-muted-foreground shrink-0 ml-2">{pct.toFixed(0)}%</span>
                            </div>
                            <Progress value={Math.min(pct, 100)} className="h-1.5" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>${goal.current_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              <span>${goal.goal_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/dashboard/savings")}>
                      View All Goals
                    </Button>
                  </>
                );
              })() : (
                <div className="text-center py-6">
                  <PiggyBank className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No savings goals yet</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/savings")}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Create Goal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Expense Input Dialog (matches Expenses page) */}
      <Dialog open={showExpenseInput} onOpenChange={setShowExpenseInput}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="What did you spend on?"
                value={expenseInput.description}
                onChange={e => handleExpenseInputChange("description", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={expenseInput.amount}
                onChange={e => handleExpenseInputChange("amount", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={expenseInput.category}
                onValueChange={val => {
                  if (val === "__add_new__") setOpenCategoryDialog(true);
                  else handleExpenseInputChange("category", val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                  <SelectItem value="__add_new__" className="text-primary">+ Add new category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dialog for new category */}
            <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 pt-2" onSubmit={handleAddCategory}>
                  <Label>Category Name</Label>
                  <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Enter category name" />
                  <Button type="submit" className="w-full">Add Category</Button>
                </form>
              </DialogContent>
            </Dialog>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={expenseInput.paymentMethod}
                onValueChange={val => handleExpenseInputChange("paymentMethod", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddExpenseFromDashboard} className="w-full">
              Add Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  </div>
);
}

export default Dashboard;
