import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "../contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import ProfessionalCard from "../components/ProfessionalCard";
import { Professional } from "../lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "../lib/queryClient";

// Emoji placeholders for icons
const UserIcon = () => <span>👤</span>;
const BookmarkIcon = () => <span>🔖</span>;

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch bookmarked professionals
  const { data: bookmarkedProfessionals = [] } = useQuery<Professional[]>({
    queryKey: ['/api/user/bookmarks'],
    enabled: isAuthenticated,
  });
  
  // Fetch user profile data
  const { data: userProfile, refetch: refetchProfile } = useQuery({
    queryKey: ['/api/user/profile'],
    enabled: isAuthenticated,
    initialData: user ? {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      phone: "",
      address: "",
      bio: "",
      createdAt: new Date().toISOString(),
    } : undefined,
  });
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userProfile?.fullName || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
      bio: userProfile?.bio || "",
    },
  });
  
  // Update form values when userProfile changes
  useEffect(() => {
    if (userProfile) {
      form.reset({
        fullName: userProfile.fullName || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        bio: userProfile.bio || "",
      });
    }
  }, [userProfile, form]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
          // In a real app, we'd send this to the server
      // await apiRequest("PUT", "/api/user/profile", data);
      
      // For now, just show a success message
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
      
      // Refetch profile data
      // refetchProfile();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Split bookmarked professionals by profession
  const bookmarkedContractors = bookmarkedProfessionals.filter(p => p.profession === 'contractor');
  const bookmarkedArchitects = bookmarkedProfessionals.filter(p => p.profession === 'architect');
  
  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="bg-gray-50 py-12">
      <Helmet>
        <title>My Profile | Kamshet.Build</title>
        <meta name="description" content="Manage your Kamshet.Build profile, bookmarks, and account settings" />
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>
        
        <Tabs defaultValue="profile" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-white rounded-lg shadow-md p-6">
              {!isEditing ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        <i className="fas fa-user text-3xl"></i>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800">{userProfile?.fullName || user?.fullName}</h2>
                      <p className="text-gray-600">{userProfile?.email || user?.email}</p>
                      <p className="text-gray-600 mt-1">Account type: <span className="capitalize">{userProfile?.userType || user?.userType}</span></p>
                      {userProfile?.phone && <p className="text-gray-600 mt-1">Phone: {userProfile.phone}</p>}
                      {userProfile?.address && <p className="text-gray-600 mt-1">Address: {userProfile.address}</p>}
                      <p className="text-gray-600 mt-1">Member since {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div className="md:ml-auto">
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                  
                  {userProfile?.bio && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">About Me</h3>
                      <p className="text-gray-600">{userProfile.bio}</p>
                    </div>
                  )}
                </>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        <i className="fas fa-user text-3xl"></i>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName"
                            {...form.register("fullName")}
                            placeholder="Your full name"
                          />
                          {form.formState.errors.fullName && (
                            <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email"
                            value={userProfile?.email || user?.email}
                            disabled
                            className="bg-gray-100"
                          />
                          <p className="text-xs text-gray-500">Email cannot be changed</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone"
                            {...form.register("phone")}
                            placeholder="Your phone number"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address"
                            {...form.register("address")}
                            placeholder="Your address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">About Me</Label>
                    <Textarea 
                      id="bio"
                      {...form.register("bio")}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              )}
              
              {(user?.userType === 'contractor' || user?.userType === 'architect') && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Professional Profile</h3>
                  <p className="text-gray-600 mb-4">
                    Manage your professional information, portfolio, and visibility to potential clients.
                  </p>
                  <Button variant="default">
                    Manage Professional Profile
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Tabs defaultValue="contractors">
                <div className="flex justify-between items-center mb-6">
                  <TabsList>
                    <TabsTrigger value="contractors">Contractors</TabsTrigger>
                    <TabsTrigger value="architects">Architects</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="contractors">
                  {bookmarkedContractors.length > 0 ? (
                    <div className="space-y-6">
                      {bookmarkedContractors.map(contractor => (
                        <ProfessionalCard key={contractor.id} professional={contractor} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <i className="far fa-bookmark text-5xl"></i>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarked contractors</h3>
                      <p className="text-gray-600 mb-6">
                        You haven't bookmarked any contractors yet. Browse our listings and save your favorites!
                      </p>
                      <Button variant="default" onClick={() => navigate("/professionals?type=contractor")}>
                        Browse Contractors
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="architects">
                  {bookmarkedArchitects.length > 0 ? (
                    <div className="space-y-6">
                      {bookmarkedArchitects.map(architect => (
                        <ProfessionalCard key={architect.id} professional={architect} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <i className="far fa-bookmark text-5xl"></i>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarked architects</h3>
                      <p className="text-gray-600 mb-6">
                        You haven't bookmarked any architects yet. Browse our listings and save your favorites!
                      </p>
                      <Button variant="default" onClick={() => navigate("/professionals?type=architect")}>
                        Browse Architects
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                {/* Password Management */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Password Management</h3>
                  <p className="text-gray-600 mb-4">
                    Change your password to keep your account secure.
                  </p>
                  <Button variant="outline">
                    Change Password
                  </Button>
                </div>
                
                {/* Notification Preferences */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h3>
                  <p className="text-gray-600 mb-4">
                    Manage how and when you receive notifications from Kamshet.Build.
                  </p>
                  <Button variant="outline">
                    Manage Notifications
                  </Button>
                </div>
                
                {/* Account Deletion */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Delete Account</h3>
                  <p className="text-gray-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
