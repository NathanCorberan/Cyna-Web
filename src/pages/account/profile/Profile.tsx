// src/pages/account/Profile.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User as UserIcon } from "lucide-react";
import { useMe } from "@/hooks/auth/useMe";
import { useAuth } from "@/hooks/auth/useAuth";


export function Profile() {
  const { me, loading, error } = useMe();
  const { logout } = useAuth(); // ← ici

  return (
    <div className="flex flex-col box-border">
      <div className="flex flex-1 items-center justify-center box-border">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-xl p-10 box-border">
          <h1 className="text-2xl font-bold text-center mb-8">Paramètres du profil</h1>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Chargement...</div>
          ) : error ? (
            <div className="text-center text-destructive py-8">{error}</div>
          ) : (
            <form className="space-y-6">
              <div className="flex gap-6">
                <div className="w-24 h-24 border rounded-md flex items-center justify-center">
                  <UserIcon size={48} className="text-[#302082]" />
                </div>
                <div className="flex-1 space-y-6">
                  <Input
                    type="text"
                    placeholder="Nom"
                    name="nom"
                    className="h-12"
                    value={me?.last_name || ""}
                    readOnly
                  />
                  <Input
                    type="text"
                    placeholder="Prénom"
                    name="prenom"
                    className="h-12"
                    value={me?.first_name || ""}
                    readOnly
                  />
                </div>
              </div>
              <Input
                type="email"
                placeholder="Email"
                name="email"
                className="h-12"
                value={me?.email || ""}
                readOnly
              />

              <div className="pt-2">
                <p className="text-base mb-3 font-semibold">Changer son mot de passe</p>
                <Input
                  type="password"
                  placeholder="Mot de passe actuel"
                  name="password"
                  className="mb-3 border-dashed h-12"
                />
                <Input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  name="newPassword"
                  className="mb-3 border-dashed h-12"
                />
                <Input
                  type="password"
                  placeholder="Confirmer le nouveau mot de passe"
                  name="confirmPassword"
                  className="border-dashed h-12"
                />
              </div>

              <div className="pt-6 flex justify-center">
                <Button
                  type="button"
                  onClick={logout}
                  className="bg-[#302082] hover:bg-[#3a2a9d] text-white px-8 py-3 text-base font-bold rounded-lg"
                >
                  Déconnexion
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
