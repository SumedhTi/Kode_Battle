import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Swords,
  BookOpen,
  Trophy,
  History,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
  LogIn,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/data/userContext";
import LoginModal from "./LoginModal";


const navItems = [
  { id: "", label: "Dashboard", icon: LayoutDashboard },
  { id: "arena", label: "Battle Arena", icon: Swords },
  { id: "practice", label: "Practice", icon: BookOpen },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "history", label: "Match History", icon: History },
  { id: "shop", label: "Kode-Shop", icon: ShoppingBag },
];



export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const currentView = location.pathname.split("/")[1];
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useUser();

  // open login dialog automatically if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-screen bg-background bg-grid">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
            KB
          </div>
          {!collapsed && (
            <span className="font-display text-lg font-bold tracking-wider text-foreground">
              KODE<span className="text-accent">-</span>BATTLE
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowLoginModal(true);
                  } else {
                    navigate(`/${item.id}`);
                  }
                }}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary/15 text-primary glow-blue"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${active ? "text-primary" : ""}`} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border p-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                <img className="rounded-full object-cover" src={user.avatar} />
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.universityId}</p>
                </div>
              )}
              <button
                onClick={logout}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
            >
              <LogIn className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Login</span>}
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ${collapsed ? "ml-[72px]" : "ml-64"}`}
      >
        <div className="min-h-screen p-6 lg:p-8">{children}</div>
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
