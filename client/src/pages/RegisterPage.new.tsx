import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// Using text placeholders for icons due to import issues
const Eye = ({ size }: { size?: number }) => <span>👁️</span>;
const EyeOff = ({ size }: { size?: number }) => <span>👁️‍🗨️</span>;

// Professional Registration Schema
const professionalRegistrationSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  username: z.string().min(3, { message: "Username is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  companyName: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  pincode: z.string().min(6, { message: "Please enter a valid pincode" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  experience: z.string({ required_error: "Please select years of experience" }),
  professionalType: z.enum(["contractor", "architect"], {
    required_error: "Please select a professional type",
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfessionalRegistrationValues = z.infer<typeof professionalRegistrationSchema>;

// Experience options
const experienceOptions = [
  { value: "1-3", label: "1-3 years" },
  { value: "4-7", label: "4-7 years" },
  { value: "8-12", label: "8-12 years" },
  { value: "13+", label: "13+ years" },
];

const RegisterPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For debugging
  useEffect(() => {
    console.log("RegisterPage mounted");
    return () => console.log("RegisterPage unmounted");
  }, []);

  // Registration Form
  const form = useForm<ProfessionalRegistrationValues>({
    resolver: zodResolver(professionalRegistrationSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      address: "",
      city: "Kamshet",
      state: "Maharashtra",
      pincode: "",
      phone: "",
      experience: "",
      professionalType: "contractor",
      terms: false,
    },
  });

  // Check if user wants to register as a professional and set the professional type
  useEffect(() => {
    try {
      console.log("Current location:", location);
      // Get search params from react-router-dom location
      const searchParams = new URLSearchParams(location.search);
      const type = searchParams.get("type");
      const professionalType = searchParams.get("professionalType");
      
      console.log("URL Parameters:", { type, professionalType });
      
      // Set isProfessional based on the type parameter
      const isProfessionalValue = type === "professional";
      console.log("Setting isProfessional to:", isProfessionalValue);
      setIsProfessional(isProfessionalValue);
      
      // If a specific professional type is provided, update the form
      if (professionalType === "contractor" || professionalType === "architect") {
        form.setValue("professionalType", professionalType);
        console.log(`Setting professional type from URL: ${professionalType}`);
      } else if (isProfessionalValue) {
        // Default to contractor if no specific type is provided but is professional
        form.setValue("professionalType", "contractor");
        console.log("Defaulting to contractor type");
      }
    } catch (error) {
      console.error("Error parsing URL parameters:", error);
      setError(`Error parsing URL parameters: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [location, form]);

  // Form submission handler
  const handleSubmit = async (data: ProfessionalRegistrationValues) => {
    setIsLoading(true);
    
    try {
      // Generate a unique username if not provided
      if (!data.username || data.username.trim() === '') {
        data.username = data.email.split('@')[0] + Math.floor(Math.random() * 1000);
      }
      
      // Set the correct userType based on the professionalType selected
      const userType = isProfessional ? data.professionalType : 'customer';
      
      console.log('Registering with userType:', userType);
      console.log('Registration data:', { ...data, userType, password: '***' });
      
      const response = await apiRequest('POST', '/api/auth/register', {
        ...data,
        userType: userType,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully. Please log in.",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Display any errors that occurred
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-700 mb-4">Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-40 mb-4">
            Path: {location.pathname}
            Search: {location.search}
            isProfessional: {String(isProfessional)}
          </pre>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 py-12">
      <Helmet>
        <title>
          {isProfessional 
            ? "Register as a Professional - Kamshet.Build" 
            : "Register for a Kamshet.Build account to connect with construction professionals"
          }
        </title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Helmet>
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isProfessional ? "Register as a Contractor or Architect" : "Create Your Account"}
          </h2>
          <p className="mt-2 text-white text-sm">
            {isProfessional 
              ? "Connect with clients, showcase your work, and grow your business on our platform." 
              : "Join our community to find the best construction professionals for your project."
            }
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Professional Type Selection - Full Width */}
                <div className="border-b pb-4 mb-6">
                  <FormField
                    control={form.control}
                    name="professionalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-base">Select Professional Type:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (!isProfessional) {
                                setIsProfessional(true);
                              }
                            }}
                            value={field.value}
                            className="flex space-x-6 mt-2"
                          >
                            <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-6 py-3 hover:bg-gray-50">
                              <RadioGroupItem value="contractor" id="contractor" className="text-blue-600" />
                              <label htmlFor="contractor" className="text-sm font-medium cursor-pointer">Contractor</label>
                            </div>
                            <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-6 py-3 hover:bg-gray-50">
                              <RadioGroupItem value="architect" id="architect" className="text-blue-600" />
                              <label htmlFor="architect" className="text-sm font-medium cursor-pointer">Architect</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Two-column layout for form fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">
                  {/* Left Column - Account Information */}
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Account Information</h3>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Full Name" 
                                className="py-2 px-3 rounded-md border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Username" 
                                className="py-2 px-3 rounded-md border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email" 
                                placeholder="Email Address" 
                                className="py-2 px-3 rounded-md border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  {...field} 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="Password" 
                                  className="py-2 px-3 rounded-md border-gray-300"
                                />
                                <div 
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  {...field} 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  placeholder="Confirm Password" 
                                  className="py-2 px-3 rounded-md border-gray-300"
                                />
                                <div 
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Right Column - Professional Details */}
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Professional Details</h3>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Company Name (if applicable)" 
                                className="py-2 px-3 rounded-md border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Address" 
                                className="min-h-[60px] py-2 px-3 rounded-md border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="City" 
                                className="py-2 px-3 rounded-md border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="State" 
                                className="py-2 px-3 rounded-md border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Pincode" 
                                className="py-2 px-3 rounded-md border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Phone Number" 
                                className="py-2 px-3 rounded-md border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Years of Experience" />
                                </SelectTrigger>
                                <SelectContent>
                                  {experienceOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Terms and Conditions */}
                <div className="border-t pt-4 mt-4">
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="text-blue-600 border-gray-300 rounded mt-0.5"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-xs text-gray-700">
                            I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
                          </FormLabel>
                          <FormMessage className="text-red-500 text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="kamshet"
                  disabled={isLoading}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md font-medium transition-all mt-4"
                >
                  {isLoading ? "Creating Account..." : "Register"}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Log in here</Link>
                  </p>
                </div>
                
                {/* Demo Account Buttons for Development */}
                <div className="mt-6 border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Demo Accounts (For Development Only):</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        // Set isProfessional to true
                        setIsProfessional(true);
                        
                        // Reset form with contractor details
                        form.reset({
                          fullName: "Demo Contractor 2025",
                          username: `contractor${Date.now().toString().slice(-6)}`,
                          email: "demo.contractor2025@example.com",
                          password: "Contractor@2025",
                          confirmPassword: "Contractor@2025",
                          companyName: "Demo Construction Co.",
                          address: "123 Builder Street, Kamshet",
                          city: "Kamshet",
                          state: "Maharashtra",
                          pincode: "410405",
                          phone: "9876543210",
                          experience: "4-7",
                          professionalType: "contractor",
                          terms: true,
                        });
                      }}
                      className="bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-3 rounded-md text-xs font-medium transition-all"
                    >
                      Fill Contractor Demo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Set isProfessional to true
                        setIsProfessional(true);
                        
                        // Reset form with architect details
                        form.reset({
                          fullName: "Demo Architect 2025",
                          username: `architect${Date.now().toString().slice(-6)}`,
                          email: "demo.architect2025@example.com",
                          password: "Architect@2025",
                          confirmPassword: "Architect@2025",
                          companyName: "Demo Design Studio",
                          address: "456 Designer Avenue, Kamshet",
                          city: "Kamshet",
                          state: "Maharashtra",
                          pincode: "410405",
                          phone: "9876543211",
                          experience: "8-12",
                          professionalType: "architect",
                          terms: true,
                        });
                      }}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-3 rounded-md text-xs font-medium transition-all"
                    >
                      Fill Architect Demo
                    </button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
