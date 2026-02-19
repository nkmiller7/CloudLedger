import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockExpenses, type Expense } from "../lib/mock-data";
import { useToast } from "@/hooks/use-toast";

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // New expense form state
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    paymentMethod: "debit" as "credit" | "debit" | "cash",
  });

  const filtered = expenses.filter(
    (e) =>
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) return;

    const categoryIcons: Record<string, string> = {
      "Housing": "🏠", "Food & Dining": "🛒", "Entertainment": "🎵",
      "Transportation": "🚗", "Utilities": "⚡", "Shopping": "🛍️", "Other": "📦",
    };

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      categoryIcon: categoryIcons[newExpense.category] || "📦",
      transactionDate: new Date().toISOString().split("T")[0],
      paymentMethod: newExpense.paymentMethod,
      recurring: { isRecurring: false },
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ description: "", amount: "", category: "", paymentMethod: "debit" });
    setOpen(false);
    toast({ title: "Expense added", description: `$${expense.amount.toFixed(2)} for ${expense.description}` });
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    toast({ title: "Expense deleted" });
  };

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground">Manage and track your spending</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="mr-1 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="What did you spend on?"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {["Housing", "Food & Dining", "Entertainment", "Transportation", "Utilities", "Shopping", "Other"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={newExpense.paymentMethod} onValueChange={(v) => setNewExpense({ ...newExpense, paymentMethod: v as "credit" | "debit" | "cash" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} className="w-full" variant="hero">Add Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Summary */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-2 text-sm">
          <span className="text-muted-foreground">Total: </span>
          <span className="font-bold text-foreground">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Expense List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_140px_100px_50px] gap-4 border-b border-border bg-muted/50 px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Description</span>
          <span>Amount</span>
          <span>Category</span>
          <span>Method</span>
          <span></span>
        </div>
        {filtered.map((expense, i) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-[1fr_120px_140px_100px_50px] gap-4 items-center border-b border-border/50 px-6 py-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{expense.categoryIcon}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{expense.description}</p>
                <p className="text-xs text-muted-foreground">{expense.transactionDate}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-foreground">-${expense.amount.toFixed(2)}</span>
            <Badge variant="secondary" className="w-fit text-xs">{expense.category}</Badge>
            <span className="text-xs capitalize text-muted-foreground">{expense.paymentMethod}</span>
            <button onClick={() => handleDelete(expense.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No expenses found.</div>
        )}
      </div>
    </div>
  );
};

export default Expenses;
