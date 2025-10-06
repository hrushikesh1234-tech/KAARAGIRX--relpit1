import { Link } from "react-router-dom";

// Replaced lucide-react icons with emoji placeholders
const Building2 = ({ className = '' }: { className?: string }) => (
  <span className={className}>🏢</span>
);

const MapPin = ({ className = '' }: { className?: string }) => (
  <span className={className}>📍</span>
);

const Phone = ({ className = '' }: { className?: string }) => (
  <span className={className}>📞</span>
);

const Mail = ({ className = '' }: { className?: string }) => (
  <span className={className}>✉️</span>
);

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Amit Patel",
      role: "Technical Director",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Sunita Desai",
      role: "Marketing Manager",
      image: "https://images.unsplash.com/photo-1558203728-00f45181dd84?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    }
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">About Kamshet</h1>
          <p className="text-xl text-gray-600 mb-6">
            Connecting clients with the best construction and architecture professionals in Kamshet, Maharashtra
          </p>
        </div>
      </div>
      
      {/* Our Mission */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At Kamshet Construction & Architecture Platform, our mission is to simplify the process of finding and 
            connecting with trusted construction and architecture professionals in the Kamshet region. We believe that 
            everyone deserves access to quality professionals who can bring their dream projects to life.
          </p>
          <p className="text-gray-600">
            By creating a transparent, reliable, and user-friendly platform, we aim to transform the construction and 
            architecture industry in Kamshet, making it more accessible and efficient for both clients and professionals.
          </p>
        </div>
      </div>
      
      {/* Our Story */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-6">
            The idea for Kamshet Construction & Architecture Platform was born out of our founder's personal frustration 
            with finding reliable contractors for his home renovation in Kamshet. Despite being home to numerous talented 
            professionals, there was no centralized resource to discover, evaluate, and connect with them.
          </p>
          <p className="text-gray-600 mb-6">
            In 2022, we launched our platform with a simple goal: to create a bridge between clients with construction 
            needs and the skilled professionals who can fulfill them. What started as a small directory has now grown 
            into a comprehensive platform serving the entire Kamshet region.
          </p>
          <p className="text-gray-600">
            Today, we're proud to be the leading platform connecting customers with contractors and architects in Kamshet, 
            helping bring countless construction and renovation projects to successful completion.
          </p>
        </div>
      </div>
      
      {/* Our Vision */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-600 mb-6">
            We envision a future where finding and hiring the right construction and architecture professionals is 
            seamless, transparent, and stress-free. We strive to be the most trusted platform in the region, known for:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Curating a network of verified, high-quality professionals</li>
            <li>Providing transparent information about professionals' expertise, experience, and past work</li>
            <li>Facilitating clear communication between clients and professionals</li>
            <li>Supporting the growth of local construction and architecture businesses</li>
            <li>Promoting sustainable and innovative building practices in the Kamshet region</li>
          </ul>
        </div>
      </div>
      
      {/* Meet Our Team */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 mx-auto w-40 h-40 rounded-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Get In Touch</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-start mb-4">
                <Building2 className="text-primary mt-1 mr-3 inline-block" />
                <div>
                  <h3 className="font-bold mb-1">Kamshet Construction & Architecture Platform</h3>
                  <p className="text-gray-600">Connecting dreams with expertise</p>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <MapPin className="text-primary mt-1 mr-3 inline-block" />
                <div>
                  <h3 className="font-bold mb-1">Address</h3>
                  <p className="text-gray-600">123 Main Street, Kamshet, Maharashtra, India - 410405</p>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <Phone className="text-primary mt-1 mr-3 inline-block" />
                <div>
                  <h3 className="font-bold mb-1">Phone</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="text-primary mt-1 mr-3 inline-block" />
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <p className="text-gray-600">info@kamshetplatform.com</p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-gray-600 mb-4">
                Have questions or suggestions? We'd love to hear from you! Reach out to us using any of the contact methods 
                listed, or fill out our contact form.
              </p>
              <Link 
                to="/contact" 
                className="inline-block px-6 py-3 bg-primary text-white rounded font-medium hover:bg-primary-dark transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
