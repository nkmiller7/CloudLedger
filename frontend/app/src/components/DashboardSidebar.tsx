import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, CreditCard, Home, PiggyBank, Settings, Wallet, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Overview", icon: Home, href: "/dashboard" },
  { label: "Expenses", icon: CreditCard, href: "/dashboard/expenses" },
  { label: "Savings", icon: PiggyBank, href: "/dashboard/savings" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Wallet className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">CloudLedger</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href === "/dashboard" && location.pathname === "/dashboard");
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-4">
        {user && (
          <div className="rounded-lg p-3 bg-muted/50">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Signed in as</p>
            <p className="font-semibold text-sm mt-1">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">@{user.username}</p>
          </div>
        )}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
