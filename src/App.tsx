import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "@/routes";
import Header from "@/layouts/Header";
import { useAutoRefreshJwt } from "@/hooks/auth/useAutoRefreshJwt";

function AppRouter() {
  const routing = useRoutes(routes);
  return routing;
}

function App() {
  useAutoRefreshJwt();
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-svh bg-background text-foreground">
        <Header />
        <main className="flex-1 max-w-screen-xl mx-auto px-4 py-8">
          <AppRouter />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
