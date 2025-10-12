import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);


        const result = await login({ email, password });


        if (result.success) {
            console.log('Login successful')
            window.location.href = '/';
        } else {
            setError(result.error)
        }
        setLoading(false);
    }


    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800    
   flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-2xl">
              <CardHeader className="space-y-1 text-center pb-4">
                  <CardTitle className="font-serif text-4xl font-bold text-slate-900 dark:text-slate-100">
                      Welcome Back
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Sign in to your account to continue
                  </p>
              </CardHeader>
              <CardContent>
                  {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4        
  py-3 rounded-lg mb-6">
                          {error}
                      </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                              Email Address
                          </label>
                          <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700
  text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                              placeholder="you@example.com"
                              required
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">
                              Password
                          </label>
                          <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700
  text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                              placeholder="••••••••"
                              required
                          />
                      </div>

                      <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2.5
  disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          size="lg"
                      >
                          {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                  </form>

                  <div className="mt-6 text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                          Don't have an account?{' '}
                          <a
                              href="/register"
                              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
  transition-colors"
                          >
                              Create account
                          </a>
                      </p>
                  </div>
              </CardContent>
          </Card>
      </div>
  );

}


export default Login