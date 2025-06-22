import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, AlertTriangle, CheckCircle, RefreshCw, Search } from 'lucide-react';

export const EmailTroubleshooter = () => {
  const [email, setEmail] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');

  const validateEmail = () => {
    setCheckingEmail(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    setTimeout(() => {
      setEmailStatus(emailRegex.test(email) ? 'valid' : 'invalid');
      setCheckingEmail(false);
    }, 1000);
  };

  const commonIssues = [
    {
      title: "Email not received",
      solutions: [
        "Check your spam/junk folder",
        "Wait 5-10 minutes for delivery",
        "Verify email address is correct",
        "Try a different email provider (Gmail, Yahoo, etc.)"
      ]
    },
    {
      title: "Link doesn't work",
      solutions: [
        "Copy the full URL from the email",
        "Paste it directly in your browser",
        "Try opening in incognito/private mode",
        "Clear browser cache and cookies"
      ]
    },
    {
      title: "Still no download",
      solutions: [
        "Check browser download settings",
        "Disable popup blockers temporarily",
        "Try a different browser",
        "Right-click link and 'Save As'"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Troubleshooter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Email sending is currently in demo mode. 
              The system simulates sending but doesn't actually deliver emails.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="check" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="check">Check Email</TabsTrigger>
              <TabsTrigger value="issues">Common Issues</TabsTrigger>
              <TabsTrigger value="alternative">Alternatives</TabsTrigger>
            </TabsList>
            
            <TabsContent value="check" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Test your email address:</label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter email to validate"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button onClick={validateEmail} disabled={checkingEmail || !email}>
                    {checkingEmail ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Check'}
                  </Button>
                </div>
                
                {emailStatus === 'valid' && (
                  <Alert className="border-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Email format is valid!</AlertDescription>
                  </Alert>
                )}
                
                {emailStatus === 'invalid' && (
                  <Alert className="border-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>Invalid email format. Please check and try again.</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="issues" className="space-y-4">
              {commonIssues.map((issue, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {issue.solutions.map((solution, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-sm">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="alternative" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Alternative Download Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Direct Download</h4>
                    <p className="text-sm text-gray-600">Use the download buttons directly on the page instead of email links.</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">Bookmark the Page</h4>
                    <p className="text-sm text-gray-600">Save this page to your bookmarks for easy access later.</p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium mb-2">Copy the URL</h4>
                    <p className="text-sm text-gray-600">Copy the current page URL and save it in your notes app.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};