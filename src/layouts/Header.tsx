import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn, isAuthenticated, logout } from "@/lib/utils";

import cynaLogo from "@/assets/Cyna_logo.png";
import { useLanguage } from "@/contexts/LanguageContext";  // <-- Import du contexte

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [auth, setAuth] = useState(isAuthenticated());
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  // Utilise le contexte global de langue
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleStorage = () => setAuth(isAuthenticated());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    setAuth(isAuthenticated());
  }, [location]);

  // Change la langue dans le contexte global
  const toggleLang = () => {
    setLanguage(language.toLowerCase() === "fr" ? "en" : "fr");
  };

  const handleLogout = () => {
    logout();
    setAuth(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="bg-[#302082] text-white w-full">
      <div className="w-full px-4 py-2 flex items-center justify-between">
        <NavLink to="/" className="flex items-center h-10 flex-shrink-0">
          <img src={cynaLogo} alt="Cyna Logo" className="h-10 w-auto" />
        </NavLink>

        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Barre de recherche desktop uniquement */}
          <div className="relative hidden md:flex items-center space-x-2">
            <Input
              type="search"
              placeholder={language.toLowerCase() === "fr" ? "Rechercher..." : "Search..."}
              className="h-8 w-64 rounded-sm bg-white text-black text-sm pl-2 pr-8"
            />
            <Search className="absolute right-2 top-1.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Bouton changement langue */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLang}
            aria-label="Changer la langue"
            title={`Changer la langue (${language.toLowerCase() === "fr" ? "EN" : "FR"})`}
            className="text-xl select-none"
          >
            {language.toLowerCase() === "fr" ? "🇫🇷" : "🇬🇧"}
          </Button>

          {/* Icônes */}
          <NavLink to="/cart" className="p-1">
            <ShoppingCart className="h-5 w-5" />
          </NavLink>
          {auth ? (
            <NavLink to="/account" className="p-1">
              <User className="h-5 w-5" />
            </NavLink>
          ) : (
            <NavLink to="/login" className="p-1">
              <User className="h-5 w-5" />
            </NavLink>
          )}
          {/* Menu Burger */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="p-1">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#302082] text-white p-0 w-[220px]">
              {/* Recherche mobile */}
              <div className="block md:hidden px-4 pt-4 pb-2">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder={language.toLowerCase() === "fr" ? "Rechercher..." : "Search..."}
                    className="h-8 w-full rounded-sm bg-white text-black text-sm pl-2 pr-8"
                  />
                  <Search className="absolute right-2 top-1.5 h-4 w-4 text-[#302082]" />
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-3xl font-bold">Menu</span>
                {/* Bouton langue dans menu mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLang}
                  aria-label="Changer la langue"
                  title={`Changer la langue (${language.toLowerCase() === "fr" ? "FR" : "EN"})`}
                  className="text-xl select-none"
                >
                  {language.toLowerCase() === "fr" ? "🇫🇷" : "en"}
                </Button>
              </div>
              <hr className="mb-2 border-white/50 mx-6" />
              <nav className="flex flex-col">
                <NavLink
                  to="/categories"
                  className={cn(
                    "px-4 py-3 hover:bg-[#3a2a9d] transition-colors",
                    pathname === "/categories" && "bg-[#3a2a9d]"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language.toLowerCase() === "fr" ? "Catégories" : "Categories"}
                </NavLink>
                <NavLink
                  to="/produits"
                  className={cn(
                    "px-4 py-3 hover:bg-[#3a2a9d] transition-colors",
                    pathname === "/produits" && "bg-[#3a2a9d]"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language.toLowerCase() === "fr" ? "Produits" : "Products"}
                </NavLink>
                <NavLink
                  to="/abonnements"
                  className={cn(
                    "px-4 py-3 hover:bg-[#3a2a9d] transition-colors",
                    pathname === "/abonnements" && "bg-[#3a2a9d]"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language.toLowerCase() === "fr" ? "Mes abonnements" : "My subscriptions"}
                </NavLink>
                <NavLink
                  to="/checkout"
                  className={cn(
                    "px-4 py-3 hover:bg-[#3a2a9d] transition-colors",
                    pathname === "/checkout" && "bg-[#3a2a9d]"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language.toLowerCase() === "fr" ? "Commandes" : "Orders"}
                </NavLink>
                {auth && (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 hover:bg-[#3a2a9d] text-left transition-colors flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-2" /> {language.toLowerCase() === "fr" ? "Se déconnecter" : "Logout"}
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
