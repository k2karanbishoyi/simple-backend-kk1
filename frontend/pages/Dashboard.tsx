import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../contexts/AuthContext';
import backend from '~backend/client';
import { 
  Upload, 
  Download, 
  History, 
  Settings, 
  LogOut,
  Crown,
  Image as ImageIcon,
  Trash2,
  CreditCard
} from 'lucide-react';
import UploadZone from '../components/UploadZone';
import ImageHistory from '../components/ImageHistory';
import SubscriptionPlans from '../components/SubscriptionPlans';

export default function Dashboard() {
  const { user, logout, updateCredits } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleImageUpload = async (file: File) => {
    if (user.credits <= 0) {
      toast({
        title: "No credits remaining",
        description: "Please upgrade your plan to continue processing images.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please select a JPEG, PNG, or WebP image file.');
      }

      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB.');
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result?.toString().split(',')[1];
          
          if (!base64Data) {
            throw new Error('Failed to read file');
          }

          // Upload image
          toast({
            title: "Uploading image...",
            description: "Please wait while we upload your image.",
          });

          const uploadResponse = await backend.images.upload({
            userId: user.id,
            fileName: file.name,
            fileData: base64Data
          });

          toast({
            title: "Processing image...",
            description: "Removing background with AI technology.",
          });

          // Process background removal
          const processResponse = await backend.images.removeBackground({
            imageId: uploadResponse.id,
            userId: user.id
          });

          // Update user credits with the new balance from the response
          updateCredits(processResponse.newCreditBalance);

          toast({
            title: "Background removed!",
            description: "Your image has been processed successfully.",
          });

          // Switch to history tab to show result
          setActiveTab('history');
          
        } catch (error) {
          console.error('Processing error:', error);
          let errorMessage = "There was an error processing your image. Please try again.";
          
          if (error instanceof Error) {
            if (error.message.includes('Insufficient credits')) {
              errorMessage = "You don't have enough credits to process this image.";
            } else if (error.message.includes('File size exceeds')) {
              errorMessage = "File size is too large. Please use an image under 10MB.";
            } else if (error.message.includes('File type not supported')) {
              errorMessage = "File type not supported. Please use JPEG, PNG, or WebP format.";
            } else if (error.message.includes('Background removal service not configured')) {
              errorMessage = "Background removal service is not configured. Please contact support.";
            } else if (error.message.includes('Background removal service temporarily unavailable')) {
              errorMessage = "Background removal service is temporarily unavailable. Please try again later.";
            } else if (error.message.includes('Failed to access uploaded image')) {
              errorMessage = "Failed to access uploaded image. Please try uploading again.";
            } else if (error.message.includes('Failed to save processed image')) {
              errorMessage = "Failed to save processed image. Please try again.";
            } else if (error.message.includes('Invalid file data')) {
              errorMessage = "Invalid file format. Please use JPEG, PNG, or WebP.";
            } else if (error.message.includes('Failed to upload image to storage')) {
              errorMessage = "Failed to upload image. Please check your internet connection and try again.";
            } else if (error.message.includes('Failed to save image record')) {
              errorMessage = "Failed to save image information. Please try again.";
            } else if (error.message.includes('Image not found')) {
              errorMessage = "Image not found. Please try uploading again.";
            } else if (error.message.includes('already processed')) {
              errorMessage = "This image is already being processed or has been processed.";
            } else {
              errorMessage = error.message;
            }
          }
          
          toast({
            title: "Processing failed",
            description: errorMessage,
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        setIsProcessing(false);
        toast({
          title: "File read error",
          description: "Failed to read the selected file. Please try again.",
          variant: "destructive",
        });
      };

      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = "Failed to upload the image. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({
        title: "Password required",
        description: "Please enter your password to confirm account deletion.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    
    try {
      await backend.users.deleteAccount({
        userId: user.id,
        password: deletePassword
      });

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });

      logout();
      navigate('/');
      
    } catch (error) {
      console.error('Delete account error:', error);
      let errorMessage = "Failed to delete account. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid password')) {
          errorMessage = "Invalid password. Please check your password and try again.";
        } else if (error.message.includes('User not found')) {
          errorMessage = "User account not found.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Delete failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeletePassword('');
    }
  };

  const handleUpgradePlan = () => {
    setShowSubscriptionPlans(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Remove.Help</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Crown className="w-3 h-3 mr-1" />
                {user.credits} credits
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="flex">
          <button
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === 'upload' 
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Upload</span>
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === 'history' 
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <History className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">History</span>
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${
              activeTab === 'settings' 
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <nav className="space-y-2">
              <button
                className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                  activeTab === 'upload'
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('upload')}
              >
                <Upload className="w-5 h-5 mr-3" />
                Upload Image
              </button>
              <button
                className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                  activeTab === 'history'
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('history')}
              >
                <History className="w-5 h-5 mr-3" />
                Image History
              </button>
              <button
                className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                  activeTab === 'settings'
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'upload' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UploadZone 
                    onUpload={handleImageUpload}
                    isProcessing={isProcessing}
                  />
                  {user.credits <= 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-yellow-800 text-sm">
                        You've used all your credits. Upgrade to continue processing images.
                      </p>
                      <Button className="mt-2" size="sm" onClick={handleUpgradePlan}>
                        Upgrade Plan
                      </Button>
                    </div>
                  )}
                  
                  {/* Instructions */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Getting Started</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Upload JPEG, PNG, or WebP images up to 10MB</li>
                      <li>• Processing takes less than 5 seconds</li>
                      <li>• Each image costs 1 credit</li>
                      <li>• Download your processed images from the History tab</li>
                    </ul>
                  </div>

                  {/* Demo Notice */}
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="text-sm font-medium text-green-900 mb-2">Demo Mode</h4>
                    <p className="text-sm text-green-800">
                      This is a demo version. If ClipDrop API is not configured, the system will use the original image for demonstration purposes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'history' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Image History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageHistory userId={user.id} />
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Account Information</h3>
                    <p className="text-gray-600">Email: {user.email}</p>
                    <p className="text-gray-600">Credits: {user.credits}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Subscription</h3>
                    <Badge variant="secondary">Free Plan</Badge>
                    <Button className="ml-4" size="sm" onClick={handleUpgradePlan}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Account Actions</h3>
                    {!showDeleteConfirm ? (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    ) : (
                      <div className="space-y-4 p-4 border border-red-200 rounded-md bg-red-50">
                        <div>
                          <h4 className="text-sm font-medium text-red-900 mb-2">
                            Confirm Account Deletion
                          </h4>
                          <p className="text-sm text-red-800 mb-4">
                            This action cannot be undone. All your images and data will be permanently deleted.
                          </p>
                          <div className="space-y-2">
                            <Label htmlFor="deletePassword">Enter your password to confirm:</Label>
                            <Input
                              id="deletePassword"
                              type="password"
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                              placeholder="Password"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || !deletePassword}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setDeletePassword('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Plans Modal */}
      {showSubscriptionPlans && (
        <SubscriptionPlans
          userId={user.id}
          onClose={() => setShowSubscriptionPlans(false)}
        />
      )}
    </div>
  );
}
