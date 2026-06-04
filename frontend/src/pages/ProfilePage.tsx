import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMsg('Display name is required');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateUser({
        displayName,
        avatarUrl: avatarUrl || undefined,
        bio: bio || undefined
      });
      setSuccessMsg('Profile updated successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-background py-8">
      <div className="container mx-auto px-4 max-w-xl space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-foreground">Your Profile Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your identity and avatar settings on OpenEd</p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-md">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-lg shadow-sm space-y-4">
          
          <div className="flex justify-center mb-6">
            <img
              src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName || 'OpenEd'}`}
              alt={displayName}
              className="h-20 w-20 rounded-full border-2 border-indigo-500 shadow"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="profile-name">Display Name</label>
            <input
              id="profile-name"
              type="text"
              placeholder="Your public display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-card text-sm focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="profile-avatar">Avatar Image URL (Optional)</label>
            <input
              id="profile-avatar"
              type="url"
              placeholder="e.g. https://example.com/avatar.png"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-card text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="profile-bio">Bio (Optional)</label>
            <textarea
              id="profile-bio"
              rows={4}
              placeholder="Tell others about your study focus, interests or university..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-md border border-input bg-card text-sm focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-9 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
export default ProfilePage;
