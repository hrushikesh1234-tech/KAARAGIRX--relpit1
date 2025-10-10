
import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ArrowLeft, Camera, X, Plus, Trash2, Star, Edit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessionalProjects, useCreateProject, useDeleteProject, useUpdateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';

interface Portfolio {
  id: number;
  title: string;
  views: string;
  thumbnail: string;
  images?: string[];
  mediaCount: number;
  description: string;
  category: string;
  bhk?: string;
  buildDate?: string;
  budget?: string;
  specifications?: string[];
}

interface AboutInfo {
  profession: string;
  experience: string;
  skills: string[];
  location: string;
  contact: string;
}

interface EditProfileProps {
  onBack: () => void;
  onSave: (profileData: any) => void;
  initialData?: any;
  openAddPortfolioForm?: boolean;
}

const EditProfile: React.FC<EditProfileProps> = ({ onBack, onSave, initialData, openAddPortfolioForm = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  
  const [profileImage, setProfileImage] = useState(initialData?.profileImage || '/lovable-uploads/1c8904bf-5b78-4e55-88ea-dc5028083eef.png');
  const [bio, setBio] = useState(initialData?.bio || '💫 ✨🎵✨ Hrushikesh More ✨🎵✨ 💫');
  const [occupation, setOccupation] = useState(initialData?.occupation || '👨‍💻 Computer Engineer');
  const [additionalInfo, setAdditionalInfo] = useState(initialData?.additionalInfo || '🎧 Music in My Soul... more');
  
  const { data: projects = [], isLoading: projectsLoading } = useProfessionalProjects(professionalId || undefined);
  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();
  const updateProjectMutation = useUpdateProject();
  
  useEffect(() => {
    const fetchProfessional = async () => {
      if (user && (user.userType === 'contractor' || user.userType === 'architect')) {
        try {
          const response = await fetch(`/api/professionals/user/${user.id}`);
          if (response.ok) {
            const professional = await response.json();
            setProfessionalId(professional.id);
          }
        } catch (error) {
          console.error('Error fetching professional:', error);
        }
      }
    };
    
    fetchProfessional();
  }, [user]);
  
  const portfolios = projects.map(p => ({
    id: p.id,
    title: p.title,
    views: '0',
    thumbnail: p.coverImage || '',
    mediaCount: p.images?.length || 0,
    description: p.description || '',
    category: p.type
  }));

  const [aboutInfo, setAboutInfo] = useState<AboutInfo>(initialData?.aboutInfo || {
    profession: '🎵 Music Producer & Sound Engineer',
    experience: '5+ years in music production and live performances',
    skills: ['Music Production', 'Sound Engineering', 'Live Performance', 'Multi-instrumentalist'],
    location: '📍 Based in Mumbai, India',
    contact: 'hrushikesh.more@email.com'
  });

  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    thumbnail: '',
    images: [] as string[],
    mediaCount: 1,
    description: '',
    category: '',
    bhk: '',
    buildDate: '',
    budget: '',
    specifications: [] as string[],
    specificationInput: ''
  });

  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<number | null>(null);

  // Automatically open add portfolio form if prop is set
  useEffect(() => {
    if (openAddPortfolioForm) {
      setShowAddPortfolio(true);
    }
  }, [openAddPortfolioForm]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Validate number of files
    const currentImageCount = newPortfolio.images.length;
    const newFileCount = files.length;
    const totalCount = currentImageCount + newFileCount;

    if (totalCount > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images",
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes and types
    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit`,
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);
    });

    // Read and add valid files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setNewPortfolio(prev => {
          const newImages = [...prev.images, reader.result as string];
          return {
            ...prev,
            images: newImages,
            thumbnail: prev.thumbnail || reader.result as string, // Set first image as thumbnail if not set
            mediaCount: newImages.length
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePortfolioImage = (index: number) => {
    setNewPortfolio(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        thumbnail: newImages[0] || '',
        mediaCount: newImages.length
      };
    });
  };

  const handleRemoveImage = () => {
    setProfileImage('');
  };

  const handleAddPortfolio = async () => {
    if (newPortfolio.title && newPortfolio.images.length > 0 && professionalId) {
      try {
        await createProjectMutation.mutateAsync({
          professionalId,
          title: newPortfolio.title,
          name: newPortfolio.title,
          description: newPortfolio.description,
          propertyType: 'Residential',
          type: newPortfolio.category || 'General',
          budget: newPortfolio.budget,
          completionYear: newPortfolio.buildDate,
          completionDate: newPortfolio.buildDate,
          bhk: newPortfolio.bhk ? parseInt(newPortfolio.bhk) : undefined,
          coverImage: newPortfolio.images[0],
          images: newPortfolio.images
        });
        
        setNewPortfolio({ 
          title: '', 
          thumbnail: '', 
          images: [],
          mediaCount: 0, 
          description: '', 
          category: '',
          bhk: '',
          buildDate: '',
          budget: '',
          specifications: [],
          specificationInput: ''
        });
        setShowAddPortfolio(false);
        
        toast({
          title: "Success",
          description: "Portfolio added successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add portfolio",
          variant: "destructive",
        });
      }
    } else if (newPortfolio.images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image",
        variant: "destructive",
      });
    }
  };

  const isAddingPortfolio = createProjectMutation.isPending;

  const addSpecification = () => {
    if (newPortfolio.specificationInput.trim()) {
      setNewPortfolio(prev => ({
        ...prev,
        specifications: [...prev.specifications, prev.specificationInput],
        specificationInput: ''
      }));
    }
  };

  const removeSpecification = (index: number) => {
    setNewPortfolio(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleDeletePortfolio = async (id: number) => {
    if (professionalId) {
      try {
        await deleteProjectMutation.mutateAsync({ id, professionalId });
        
        toast({
          title: "Success",
          description: "Portfolio deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete portfolio",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditPortfolio = (portfolio: Portfolio) => {
    const project = projects.find(p => p.id === portfolio.id);
    if (project) {
      // Handle both string array and ProjectImage array
      let projectImages: string[] = [];
      if (Array.isArray(project.images)) {
        projectImages = project.images.map((img: any) => 
          typeof img === 'string' ? img : (img.imageUrl || img.url || '')
        ).filter(Boolean);
      }
      if (projectImages.length === 0 && project.coverImage) {
        projectImages = [project.coverImage];
      }
      
      setNewPortfolio({
        title: project.title,
        thumbnail: project.coverImage || '',
        images: projectImages,
        mediaCount: projectImages.length || 1,
        description: project.description || '',
        category: project.type,
        bhk: project.bhk?.toString() || '',
        buildDate: project.completionDate || '',
        budget: typeof project.budget === 'number' ? project.budget.toString() : (project.budget || ''),
        specifications: [],
        specificationInput: ''
      });
      setEditingPortfolioId(portfolio.id);
      setShowAddPortfolio(true);
    }
  };

  const handleUpdatePortfolio = async () => {
    if (editingPortfolioId && newPortfolio.title && newPortfolio.images.length > 0 && professionalId) {
      try {
        await updateProjectMutation.mutateAsync({
          id: editingPortfolioId,
          professionalId,
          title: newPortfolio.title,
          name: newPortfolio.title,
          description: newPortfolio.description,
          propertyType: 'Residential',
          type: newPortfolio.category || 'General',
          budget: newPortfolio.budget,
          completionYear: newPortfolio.buildDate,
          completionDate: newPortfolio.buildDate,
          bhk: newPortfolio.bhk ? parseInt(newPortfolio.bhk) : undefined,
          coverImage: newPortfolio.images[0],
          images: newPortfolio.images
        });
        
        setNewPortfolio({ 
          title: '', 
          thumbnail: '', 
          images: [],
          mediaCount: 0, 
          description: '', 
          category: '',
          bhk: '',
          buildDate: '',
          budget: '',
          specifications: [],
          specificationInput: ''
        });
        setShowAddPortfolio(false);
        setEditingPortfolioId(null);
        
        toast({
          title: "Success",
          description: "Portfolio updated successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update portfolio",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setNewPortfolio({ 
      title: '', 
      thumbnail: '', 
      images: [],
      mediaCount: 0, 
      description: '', 
      category: '',
      bhk: '',
      buildDate: '',
      budget: '',
      specifications: [],
      specificationInput: ''
    });
    setShowAddPortfolio(false);
    setEditingPortfolioId(null);
  };

  const handleSave = () => {
    const updatedData = {
      profileImage,
      bio,
      occupation,
      additionalInfo,
      portfolios,
      aboutInfo
    };
    onSave(updatedData);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Edit Profile</h1>
          <Button 
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 text-sm"
          >
            Save
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 pb-24 space-y-6">
        {/* Profile Picture Section */}
        <div className="text-center">
          <div className="relative inline-block">
            {profileImage ? (
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                <Camera size={24} className="text-gray-400" />
              </div>
            )}
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-600">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-400 mt-2">Change profile picture</p>
        </div>

        {/* Bio Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Bio</label>
          <Textarea
            value={bio}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
            rows={3}
            placeholder="Tell people about yourself..."
          />
        </div>

        {/* Occupation Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Occupation</label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Your occupation..."
          />
        </div>

        {/* Additional Info Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Additional Info</label>
          <input
            type="text"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Additional information..."
          />
        </div>

        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">About Information</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Profession</label>
            <input
              type="text"
              value={aboutInfo.profession}
              onChange={(e) => setAboutInfo(prev => ({ ...prev, profession: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Experience</label>
            <input
              type="text"
              value={aboutInfo.experience}
              onChange={(e) => setAboutInfo(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Location</label>
            <input
              type="text"
              value={aboutInfo.location}
              onChange={(e) => setAboutInfo(prev => ({ ...prev, location: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Contact</label>
            <input
              type="text"
              value={aboutInfo.contact}
              onChange={(e) => setAboutInfo(prev => ({ ...prev, contact: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Portfolio Management Section */}
        <div id="portfolio-management-section" className="space-y-4">
          <div className="relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Portfolio Management</h3>
              <Button
                onClick={() => {
                  if (showAddPortfolio) {
                    handleCancelEdit();
                  } else {
                    setShowAddPortfolio(true);
                  }
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm flex items-center gap-2"
              >
                <Plus size={16} />
                {showAddPortfolio ? 'Close' : (editingPortfolioId ? 'Close Edit' : 'Add Portfolio')}
              </Button>
            </div>
            
            {/* Add Portfolio Form */}
            {showAddPortfolio && (
              <div className="mt-4 w-full">
                <div className="bg-gray-800 p-4 rounded-lg space-y-4 border border-gray-700 shadow-lg">
                  <h4 className="font-medium">{editingPortfolioId ? 'Edit Portfolio' : 'Add New Portfolio'}</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={newPortfolio.title}
                        onChange={(e) => setNewPortfolio(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="Enter project title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Project Overview</label>
                      <Textarea
                        value={newPortfolio.description}
                        onChange={(e) => setNewPortfolio(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="Enter detailed project overview"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <input
                          type="text"
                          value={newPortfolio.category}
                          onChange={(e) => setNewPortfolio(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                          placeholder="E.g., Modern, Luxury"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">BHK</label>
                        <input
                          type="text"
                          value={newPortfolio.bhk}
                          onChange={(e) => setNewPortfolio(prev => ({ ...prev, bhk: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                          placeholder="E.g., 2 BHK, 3 BHK"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Build Date</label>
                        <input
                          type="text"
                          value={newPortfolio.buildDate}
                          onChange={(e) => setNewPortfolio(prev => ({ ...prev, buildDate: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                          placeholder="E.g., January 2023"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Budget</label>
                        <input
                          type="text"
                          value={newPortfolio.budget}
                          onChange={(e) => setNewPortfolio(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                          placeholder="E.g., ₹50L - ₹60L"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Upload Images <span className="text-gray-400 text-xs">({newPortfolio.images.length}/5 - Max 5MB each)</span>
                      </label>
                      
                      {/* Image Previews Grid */}
                      {newPortfolio.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {newPortfolio.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={image} 
                                alt={`Preview ${index + 1}`} 
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemovePortfolioImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                              {index === 0 && (
                                <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                                  Cover
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      {newPortfolio.images.length < 5 && (
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-700 border-gray-600 hover:bg-gray-600">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Camera className="w-6 h-6 mb-1 text-gray-400" />
                            <p className="text-xs text-gray-400">
                              {newPortfolio.images.length === 0 ? 'Click to upload images' : 'Add more images'}
                            </p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={handlePortfolioImageUpload}
                            accept="image/*"
                            multiple
                          />
                        </label>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Specifications</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newPortfolio.specificationInput || ''}
                          onChange={(e) => setNewPortfolio(prev => ({ ...prev, specificationInput: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && addSpecification()}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                          placeholder="Add specification and press Enter"
                        />
                        <button
                          type="button"
                          onClick={addSpecification}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newPortfolio.specifications?.map((spec, index) => (
                          <div key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                            {spec}
                            <button 
                              type="button"
                              onClick={() => removeSpecification(index)}
                              className="ml-2 text-gray-300 hover:text-white"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={editingPortfolioId ? handleUpdatePortfolio : handleAddPortfolio}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm"
                        disabled={isAddingPortfolio}
                      >
                        {isAddingPortfolio ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                          </span>
                        ) : (
                          editingPortfolioId ? 'Update Portfolio' : 'Add Portfolio'
                        )}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current Portfolios */}
          <div className="space-y-3 pt-4">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="bg-gray-800 p-4 rounded-lg flex items-center gap-4">
                <img
                  src={portfolio.thumbnail}
                  alt={portfolio.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{portfolio.title}</h4>
                  <p className="text-sm text-gray-400">{portfolio.category}</p>
                  <p className="text-xs text-gray-500">{portfolio.mediaCount} media files</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPortfolio(portfolio)}
                    className="p-2 hover:bg-blue-500 rounded-full text-blue-400 hover:text-white"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeletePortfolio(portfolio.id)}
                    className="p-2 hover:bg-red-500 rounded-full text-red-400 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
