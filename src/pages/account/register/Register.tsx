import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Facebook } from "lucide-react";
import { useRegister } from "@/hooks/auth/useRegister";
import type { RegisterCredentials } from "@/types/Register";

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<RegisterCredentials>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    isActivate: true,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const { handleRegister, loading, error } = useRegister();
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      setSuccess(null);
      return alert("Les mots de passe ne correspondent pas");
    }
    const response = await handleRegister(form);
    if (response) {
      setSuccess("Inscription réussie !");
      setTimeout(() => navigate("/login"), 1200);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-md shadow p-6">
        <h1 className="text-xl font-bold text-center mb-6">Créer un compte</h1>
        <form className="space-y-4" onSubmit={onSubmit} autoComplete="off">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm">Email</label>
            <Input
              id="email"
              type="email"
              className="w-full border rounded-md"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm">Nom</label>
            <Input
              id="last_name"
              type="text"
              className="w-full border rounded-md"
              placeholder="Nom"
              value={form.last_name}
              onChange={onChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm">Prénom</label>
            <Input
              id="first_name"
              type="text"
              className="w-full border rounded-md"
              placeholder="Prénom"
              value={form.first_name}
              onChange={onChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm">Mot de passe</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-md pr-10"
                placeholder="Mot de passe"
                value={form.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword((v) => !v)}
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
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm">Confirmer le mot de passe</label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full border rounded-md pr-10"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword((v) => !v)}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
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
          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}

          <Button type="submit" className="w-full bg-[#302082] hover:bg-[#3a2a9d]" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </Button>

          <div className="text-center text-sm">
            <span>Déjà inscrit ? </span>
            <Link to="/login" className="text-[#302082] hover:underline">
              Se connecter
            </Link>
          </div>
          <div className="flex justify-center space-x-4 pt-2">
            <a href="#" className="rounded-full border border-gray-300 p-2" aria-label="Google">
              <span className="sr-only">Google</span>
              <div className="h-5 w-5 flex items-center justify-center font-bold text-lg text-gray-700">G</div>
            </a>
            <a href="#" className="rounded-full border border-gray-300 p-2" aria-label="Facebook">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-5 w-5 text-blue-600" />
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
