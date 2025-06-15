import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { BeamsBackground } from '@/components/ui/beams-background';
import Logo from '@/components/Logo';
import { cleanupAuthState } from '@/hooks/cleanupAuthState';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up possible stale sessions!
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (_) {
        // Ignore, cleaning up anyway
      }

      if (isLogin) {
        const response = await signIn(email, password);
        if (response.error) {
          const msg = response.error.message?.toLowerCase() ?? '';
          if (
            msg.includes('user not found') ||
            msg.includes('invalid login credentials') ||
            msg.includes('invalid credentials') ||
            msg.includes('credentials are invalid') ||
            msg.includes('no user found') ||
            response.error.code === 'auth/user-not-found'
          ) {
            toast({
              title: "User not found",
              description: "No account exists for this email. Please sign up first before signing in.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign in failed",
              description: response.error.message,
              variant: "destructive",
            });
          }
          return;
        }
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        // Force a full page reload to re-initialize the app session
        window.location.href = "/";
        return;
      } else {
        if (password !== confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Please make sure your passwords match.",
            variant: "destructive",
          });
          return;
        }
        const response = await signUp(email, password);
        if (response.error) {
          toast({
            title: "Sign up failed",
            description: response.error.message,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        window.location.href = "/";
        return;
      }
    } catch (error: any) {
      toast({
        title: isLogin ? "Sign in failed" : "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BeamsBackground className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-3 h-16" />
          {/* Removed the AgileAnchor text and subtitle */}
        </div>

        <Card className="bg-black/50 border-gray-800 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl sm:text-2xl text-white">
              {isLogin ? 'Welcome back' : 'Create account'}
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm sm:text-base">
              {isLogin ? 'Sign in to your account' : 'Enter your details to create your account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm sm:text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 text-sm sm:text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm sm:text-base">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 pr-10 text-sm sm:text-base"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white text-sm sm:text-base">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 pr-10 text-sm sm:text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="stayLoggedIn"
                    checked={stayLoggedIn}
                    onCheckedChange={(checked) => setStayLoggedIn(checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor="stayLoggedIn"
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    Stay logged in
                  </Label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-300 text-sm sm:text-base"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </BeamsBackground>
  );
};

export default Auth;
