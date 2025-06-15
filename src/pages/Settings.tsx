
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Save, LogOut, Key } from 'lucide-react';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

const Settings = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordTabOpen, setPasswordTabOpen] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const loadProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setBio(data.bio || '');
      }
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const profileData = {
        id: user.id,
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        bio: bio.trim() || null,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });

      loadProfile();
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // PASSWORD CHANGE FUNCTIONALITY --------------------
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill all fields.",
        variant: "destructive"
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive"
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Passwords do not match",
        description: "Check confirmation.",
        variant: "destructive"
      });
      return;
    }

    setPasswordLoading(true);
    // Supabase requires the user to re-authenticate before changing password.
    const { error: loginErr } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });
    if (loginErr) {
      toast({
        title: "Current password is incorrect",
        description: loginErr.message,
        variant: "destructive",
      });
      setPasswordLoading(false);
      return;
    }
    // Change password
    const { error: pwError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (pwError) {
      toast({
        title: "Password change failed",
        description: pwError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password updated",
        description: "Your password was successfully changed.",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordTabOpen(false);
    }
    setPasswordLoading(false);
  };
  // --------------------------------------------------

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>

          {/* Profile Settings */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Email</label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-800 border-gray-700 text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">First Name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Last Name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Change Password Section */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader
              className="cursor-pointer"
              onClick={() => setPasswordTabOpen((v) => !v)}
            >
              <CardTitle className="text-white flex items-center gap-2 select-none">
                <Key className="h-5 w-5" />
                Change Password
                <span className="ml-auto text-xs text-gray-400">{passwordTabOpen ? "▲" : "▼"}</span>
              </CardTitle>
            </CardHeader>
            {passwordTabOpen && (
              <CardContent>
                <form className="space-y-4" onSubmit={handleChangePassword}>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Current Password</label>
                    <Input
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      type="password"
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Current password"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">New Password</label>
                    <Input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="New password"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                    <Input
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      type="password"
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {passwordLoading ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>

          {/* Account Actions */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Sign Out</h3>
                    <p className="text-gray-400 text-sm">Sign out of your account</p>
                  </div>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
