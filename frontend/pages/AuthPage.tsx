import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
      } else {
        await register(email, password);
        toast({
          title: "Account created!",
          description: "You've received 5 free credits to get started.",
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : (isLogin ? "Invalid credentials" : "Registration failed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              </div>
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? 'Welcome back 👋' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Please enter your email & password to sign in'
                : 'Get started with 5 free background removals'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  className="text-purple-600 hover:underline font-medium"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
