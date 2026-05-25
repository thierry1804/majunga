import { useEffect, useState } from 'react';
import { createUser, deleteUser, getUsers, promoteUser, ApiUser } from '../../api/madabookingApi';
import Button from '../ui/Button';

export default function UsersManagement() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_USER');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setUsers(await getUsers());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ email, password, roles: [role] });
      setEmail('');
      setPassword('');
      setRole('ROLE_USER');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de création');
    }
  };

  const handlePromote = async (id: string, newRole: string) => {
    try {
      await promoteUser(id, newRole);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de promotion');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de suppression');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Utilisateurs</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-lg p-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="ROLE_USER">Utilisateur</option>
          <option value="ROLE_EDITOR">Éditeur</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>
        <Button type="submit" variant="primary">Créer</Button>
      </form>

      {loading ? (
        <p className="text-gray-500 text-sm">Chargement...</p>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left bg-gray-50">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rôles</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{(user.roles || []).join(', ')}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      type="button"
                      className="text-blue-600 hover:underline text-xs"
                      onClick={() => user.id && handlePromote(String(user.id), 'ROLE_ADMIN')}
                    >
                      Promouvoir admin
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:underline text-xs"
                      onClick={() => user.id && handleDelete(String(user.id))}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
