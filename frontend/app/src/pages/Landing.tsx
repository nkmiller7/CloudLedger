import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BarChart3, Shield, TrendingUp, Wallet, ArrowRight, PiggyBank, Receipt } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Expense Tracking",
    description: "Categorize and monitor every transaction with intuitive controls.",
  },
  {
    icon: TrendingUp,
    title: "Spending Analytics",
    description: "Interactive charts reveal your monthly and yearly spending patterns.",
  },
  {
    icon: PiggyBank,
    title: "Savings Goals",
    description: "Set targets and track progress toward your financial milestones.",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    description: "Built with DevSecOps practices — your data is always protected.",
  },
  {
    icon: Receipt,
    title: "Smart Categories",
    description: "Custom categories with recurring expense support and payment methods.",
  },
  {
    icon: BarChart3,
    title: "Budget Insights",
    description: "Monthly budget tracking with real-time alerts and summaries.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-['Space_Grotesk']">CloudLedger</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-28 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <Shield className="h-3.5 w-3.5" />
          Built with DevSecOps best practices
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Take control of your{" "}
          <span className="text-primary">finances</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          CloudLedger helps you track expenses, set savings goals, and understand your spending — all in a secure, cloud-native platform.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" className="gap-2 text-base px-8" asChild>
            <Link to="/signup">
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8" asChild>
            <Link to="/signin">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-28 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Everything you need</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Powerful tools designed to give you complete visibility into your financial life.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <Card key={f.title} className="border-border/60 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto rounded-2xl bg-primary p-12 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to master your money?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Join CloudLedger and start making smarter financial decisions today.
          </p>
          <Button size="lg" variant="secondary" className="text-base px-8 gap-2" asChild>
            <Link to="/signup">
              Create Account <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 CloudLedger — SSW 590</span>
          <span>Miller · Pellini · Sulsenti · Birns · Ganguzza · Castillo · Hing</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
