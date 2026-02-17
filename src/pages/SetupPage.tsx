import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { supabase } from '@/db/supabase';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const navigate = useNavigate();

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('create-president', {
        method: 'POST',
      });

      if (functionError) {
        throw functionError;
      }

      if (data.success) {
        setSuccess(true);
        setCredentials({
          username: data.username || 'usc.president_IX',
          password: data.password || 'presidential.login_uscix',
        });
      } else {
        throw new Error(data.error || 'Failed to create president account');
      }
    } catch (err: any) {
      console.error('Setup error:', err);
      setError(err.message || 'Failed to initialize president account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Platform Setup</CardTitle>
          <CardDescription className="text-center">
            Initialize the USC IX Management Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!success && !error && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will create the President account with fixed credentials. This only needs to be done once.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleSetup} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  'Initialize President Account'
                )}
              </Button>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && credentials && (
            <>
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  President account created successfully!
                </AlertDescription>
              </Alert>

              <Card className="bg-muted">
                <CardHeader>
                  <CardTitle className="text-lg">President Credentials</CardTitle>
                  <CardDescription>Save these credentials securely</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Username</p>
                    <p className="text-lg font-mono font-bold">usc.president_ix</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Password</p>
                    <p className="text-lg font-mono font-bold">presidential.login_uscix</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate('/login')}
                  className="flex-1"
                >
                  Go to Login
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1"
                >
                  Go to Home
                </Button>
              </div>
            </>
          )}

          {!success && (
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => navigate('/')}
                className="text-sm"
              >
                Back to Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
