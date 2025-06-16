import { useEffect, useState } from "react";
import { fetchAllUsers } from "@/features/account/api/fetchAllUsers"; // adapte le chemin si besoin
import type { UserAdminResponse } from "@/types/User";

export const useAllUsers = () => {
  const [users, setUsers] = useState<UserAdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Erreur lors du chargement des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};
