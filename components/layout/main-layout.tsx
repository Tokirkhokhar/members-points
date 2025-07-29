"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  ShoppingCart,
  Gift,
  History,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { CartDrawer } from "../cart/cart-drawer";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    {
      href: "/products",
      label: "Products",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      href: "/rewards-catalog",
      label: "Rewards Catalog",
      icon: <Gift className="h-5 w-5" />,
    },
    {
      href: "/dashboard",
      label: "My Points",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/rewards",
      label: "My Rewards",
      icon: <Gift className="h-5 w-5" />,
    },
    {
      href: "/redemption-history",
      label: "Redemption History",
      icon: <History className="h-5 w-5" />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  const initials = user?.firstName
    ? user.firstName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen flex">
      <TooltipProvider delayDuration={100}>
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col bg-card border-r transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {!isSidebarCollapsed && (
              <Link href="/products" className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Loyalty Center</span>
              </Link>
            )}
            {isSidebarCollapsed && (
              <Link
                href="/products"
                className="flex items-center justify-center w-full"
              >
                <Trophy className="h-6 w-6 text-primary" />
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={cn("h-8 w-8", isSidebarCollapsed && "mx-auto")}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground",
                      isSidebarCollapsed && "justify-center"
                    )}
                  >
                    {item.icon}
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {isSidebarCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header
            className={cn(
              "section sticky top-0 z-50 w-full transition-all duration-200 md:pl-0",
              scrolled
                ? "bg-background/95 backdrop-blur-sm border-b"
                : "bg-transparent"
            )}
          >
            <div className="container flex h-16 items-center justify-between">
              {/* Mobile Menu Button and Logo */}
              <div className="flex items-center gap-4 md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
                <Link href="/products" className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-lg font-bold">Loyalty Center</span>
                </Link>
              </div>

              {/* Desktop: Empty space or breadcrumbs could go here */}
              <div className="hidden md:block"></div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4">
                <ModeToggle />

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>

                {/* Mobile User Info */}
                {user && (
                  <div className="md:hidden">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.firstName} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                {user && (
                  <div className="flex hidden md:flex items-center gap-3 px-4 py-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.firstName} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}
                {user && (
                  <Button
                    variant="ghost"
                    className="w-auto mt-2 justify-end text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </header>

          {/* Mobile Navigation Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 top-16 z-40 bg-background md:hidden">
              <nav className="container py-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-md",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}

                {user && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.firstName} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full mt-2 justify-start text-destructive"
                      onClick={logout}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}

          {/* Main Content */}
          <main className="section flex-1">{children}</main>

          {/* Footer */}
          <footer className="section py-6 border-t">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Loyalty Center. All rights
                reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/support"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Support
                </Link>
              </div>
            </div>
          </footer>
        </div>

        <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
      </TooltipProvider>
    </div>
  );
}
