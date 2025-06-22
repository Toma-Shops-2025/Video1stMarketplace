import { AppLayout } from '@/components/AppLayout';
import { EmailTroubleshooter } from '@/components/EmailTroubleshooter';
import { EmailSender } from '@/components/EmailSender';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmailHelp = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Mail className="h-8 w-8" />
              Email Help Center
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Having trouble receiving emails or download links? We'll help you figure out what's going wrong.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Why Emails Aren't Working
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Current Status:</strong> Email functionality is in development mode. 
                    Emails are simulated but not actually sent.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Common Reasons:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Email service not fully configured</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Spam filters blocking emails</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Invalid email address format</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Server connectivity issues</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Recommended Solution</h4>
                  <p className="text-sm">Use direct download buttons instead of email links for immediate access to your files.</p>
                </div>
              </CardContent>
            </Card>
            
            <EmailSender 
              projectUrl={window.location.origin}
              fileName="Project Files"
            />
          </div>
          
          <div>
            <EmailTroubleshooter />
          </div>
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/download-help')}
                className="w-full"
              >
                Download Help
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/project-location')}
                className="w-full"
              >
                Find Files
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/contact')}
                className="w-full"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default EmailHelp;