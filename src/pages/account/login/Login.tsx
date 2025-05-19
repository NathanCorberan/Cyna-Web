// src/pages/account/login/Login.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Facebook } from "lucide-react";
import { useLogin } from "@/hooks/auth/useLogin";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, loading, error } = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await handleLogin({ email, password });
    if (token) {
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-md shadow p-6">
        <h1 className="text-xl font-bold text-center mb-6">Connexion</h1>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                className="w-full border rounded-md"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm">
              Mot de passe
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-md pr-10"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            className="w-full bg-[#302082] hover:bg-[#3a2a9d]"
            type="submit"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>

          <div className="text-center text-sm">
            <Link to="/forgot-password" className="text-[#302082] hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <div className="text-center text-sm">
            <span>Pas encore inscrit ? </span>
            <Link to="/register" className="text-[#302082] hover:underline">
              Créer un compte
            </Link>
          </div>

          <div className="flex justify-center space-x-4 pt-2">
            <Link to="#" className="rounded-full border border-gray-300 p-2">
              <span className="sr-only">Google</span>
              <div className="h-5 w-5 flex items-center justify-center">G</div>
            </Link>
            <Link to="#" className="rounded-full border border-gray-300 p-2">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-5 w-5 text-blue-600" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
