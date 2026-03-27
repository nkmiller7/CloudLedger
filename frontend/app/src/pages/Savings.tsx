import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, PiggyBank, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type SavingGoal = {
  _id: string;
  name: string;
  goal_amount: number;
  current_amount: number;
  deadline: string;
};

const Savings = () => {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openContribute, setOpenContribute] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null);
  const [contributeAmount, setContributeAmount] = useState("");
  const { toast } = useToast();

  const [newGoal, setNewGoal] = useState({
    name: "",
    goal_amount: "",
    current_amount: "",
    deadline: "",
  });

  const fetchGoals = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/saving_goals", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setGoals(data || []);
      }
    } catch {
      setGoals([]);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async () => {
    if (!newGoal.name || !newGoal.goal_amount || !newGoal.current_amount || !newGoal.deadline) return;
    try {
      const deadlineDate = new Date(newGoal.deadline);
      const res = await fetch("http://localhost:3000/api/saving_goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newGoal.name,
          goal_amount: parseFloat(parseFloat(newGoal.goal_amount).toFixed(2)),
          current_amount: parseFloat(parseFloat(newGoal.current_amount).toFixed(2)),
          deadline: deadlineDate.toISOString(),
        }),
      });
      if (res.ok) {
        setOpenCreate(false);
        setNewGoal({ name: "", goal_amount: "", current_amount: "", deadline: "" });
        toast({ title: "Goal created", description: `"${newGoal.name}" has been added` });
        fetchGoals();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.reason || "Failed to create goal", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to create goal", variant: "destructive" });
    }
  };

  const handleContribute = async () => {
    if (!selectedGoal || !contributeAmount) return;
    try {
      const res = await fetch(`http://localhost:3000/api/saving_goals/${selectedGoal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: parseFloat(parseFloat(contributeAmount).toFixed(2)),
        }),
      });
      if (res.ok) {
        setOpenContribute(false);
        setContributeAmount("");
        setSelectedGoal(null);
        toast({ title: "Contribution added", description: `$${parseFloat(contributeAmount).toFixed(2)} added to "${selectedGoal.name}"` });
        fetchGoals();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.reason || "Failed to add contribution", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to add contribution", variant: "destructive" });
    }
  };

  const handleDelete = async (goal: SavingGoal) => {
    try {
      const res = await fetch(`http://localhost:3000/api/saving_goals/${goal._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok || res.status === 204) {
        toast({ title: "Goal deleted", description: `"${goal.name}" has been removed` });
        setGoals(goals.filter((g) => g._id !== goal._id));
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete goal", variant: "destructive" });
    }
  };

  const totalSaved = goals.reduce((sum, g) => sum + (g.current_amount || 0), 0);
  const totalTarget = goals.reduce((sum, g) => sum + (g.goal_amount || 0), 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">Track and manage your saving targets</p>
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="mr-1 h-4 w-4" /> Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input
                  placeholder="e.g. Emergency Fund"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newGoal.goal_amount}
                  onChange={(e) => setNewGoal({ ...newGoal, goal_amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Starting Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newGoal.current_amount}
                  onChange={(e) => setNewGoal({ ...newGoal, current_amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <Button onClick={handleCreate} className="w-full" variant="hero">Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <PiggyBank className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Saved</p>
              <p className="text-2xl font-bold">${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Target</p>
              <p className="text-2xl font-bold">${totalTarget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
            <Progress value={Math.min(overallProgress, 100)} className="h-2.5 mb-1" />
            <p className="text-xs text-muted-foreground text-right">{overallProgress.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal, i) => {
          const progress = goal.goal_amount > 0 ? (goal.current_amount / goal.goal_amount) * 100 : 0;
          const deadlineDate = new Date(goal.deadline);
          const isOverdue = deadlineDate < new Date() && progress < 100;
          return (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{goal.name}</CardTitle>
                    <button
                      onClick={() => handleDelete(goal)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className={`text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                    Deadline: {deadlineDate.toLocaleDateString()}
                    {isOverdue && " (overdue)"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={Math.min(progress, 100)} className="h-2.5" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${goal.current_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="font-medium">
                      ${goal.goal_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{progress.toFixed(1)}% complete</p>
                  <Button
                    size="sm"
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setContributeAmount("");
                      setOpenContribute(true);
                    }}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Contribute
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No savings goals yet. Create one to get started!
          </div>
        )}
      </div>

      {/* Contribute Dialog */}
      <Dialog open={openContribute} onOpenChange={setOpenContribute}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contribution{selectedGoal ? ` to "${selectedGoal.name}"` : ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {selectedGoal && (
              <div className="text-sm text-muted-foreground">
                Current: ${selectedGoal.current_amount.toFixed(2)} / ${selectedGoal.goal_amount.toFixed(2)}
              </div>
            )}
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
              />
            </div>
            <Button onClick={handleContribute} className="w-full" variant="hero">Add Contribution</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Savings;
