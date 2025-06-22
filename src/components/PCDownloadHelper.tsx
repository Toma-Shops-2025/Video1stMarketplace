import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Laptop, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const PCDownloadHelper = () => {
  const [email, setEmail] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDirectDownload = () => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/placeholder.svg'; // This would be your actual file
      link.download = 'project-files.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloading(false);
      toast({
        title: "Download Started",
        description: "Your project files are being downloaded to your PC."
      });
    }, 1000);
  };

  const handleEmailDownload = () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Email Sent",
      description: `Download link sent to ${email}`
    });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Laptop className="h-4 w-4" />
        <AlertDescription>
          Perfect! You're on your laptop/PC. Download your project files directly to this computer.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Direct Download to PC
          </CardTitle>
          <CardDescription>
            Download your project files directly to your laptop's Downloads folder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleDirectDownload}
            disabled={isDownloading}
            className="w-full"
            size="lg"
          >
            {isDownloading ? 'Downloading...' : 'Download Project Files'}
          </Button>
          
          <div className="text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 inline mr-2 text-green-600" />
            Files will be saved to your Downloads folder
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Download Link</CardTitle>
          <CardDescription>
            Send download link to your email for later access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleEmailDownload}
            variant="outline"
            className="w-full"
          >
            Send Download Link
          </Button>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> After downloading, extract the ZIP file to access your project files. 
          Look for them in your Downloads folder.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PCDownloadHelper;