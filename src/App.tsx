import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "@/routes";
import Header from "@/layouts/Header";
import { useAutoRefreshJwt } from "@/hooks/auth/useAutoRefreshJwt";
import { LanguageProvider } from "@/contexts/LanguageContext";

function AppRouter() {
  const routing = useRoutes(routes);
  return routing;
}

function App() {
  useAutoRefreshJwt();
  return (
    <BrowserRouter>
      <LanguageProvider>
        <div className="flex flex-col min-h-svh bg-background text-foreground">
          <Header />
          <AppRouter />
        </div>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
