import { Helmet } from "react-helmet";

const AboutUsPage = () => {
  return (
    <div className="bg-white py-12">
      <Helmet>
        <title>About Us | Kamshet.Build</title>
        <meta name="description" content="Learn about Kamshet.Build, connecting customers with the best construction professionals in Kamshet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 font-inter mb-6">About Kamshet.Build</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting customers with quality contractors and architects in the Kamshet region
          </p>
        </div>
        
        {/* Our Mission */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            At Kamshet.Build, our mission is to simplify the construction and design process by creating a transparent marketplace 
            that connects customers with the best local professionals. We aim to take the stress out of finding reliable contractors 
            and architects, while helping skilled professionals showcase their work and grow their businesses.
          </p>
          <p className="text-gray-600">
            We believe that everyone deserves access to quality construction services, and we're dedicated to making the building 
            process more transparent, efficient, and enjoyable for all parties involved.
          </p>
        </div>
        
        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Kamshet.Build was born out of personal frustration. Our founder, having built a vacation home in Kamshet, 
              experienced firsthand the challenges of finding reliable contractors and architects in the area. What should have been 
              an exciting project became a stressful endeavor due to lack of information, transparency, and accountability.
            </p>
            <p className="text-gray-600 mb-4">
              This experience revealed a gap in the market - while Kamshet was growing as a destination for second homes and 
              investment properties, there was no reliable way to connect with quality construction professionals. 
            </p>
            <p className="text-gray-600">
              Founded in 2023, Kamshet.Build aims to solve this problem by creating a dedicated platform for the local construction 
              ecosystem, benefiting both customers and professionals alike.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Kamshet landscape" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        
        {/* Our Values */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-[#eff6ff] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-check-circle text-[#3b82f6] text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">
                We carefully vet all professionals on our platform to ensure they maintain high standards of workmanship.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-[#eff6ff] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-lock text-[#3b82f6] text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Trust</h3>
              <p className="text-gray-600">
                We build trust through verified reviews, clear information, and transparency in all interactions.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-[#eff6ff] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-handshake text-[#3b82f6] text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                We support the local Kamshet community by promoting regional professionals and sustainable building practices.
              </p>
            </div>
          </div>
        </div>
        
        {/* Meet Our Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                  alt="Rajiv Sharma" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-lg font-semibold">Rajiv Sharma</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                  alt="Priya Patel" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-lg font-semibold">Priya Patel</h3>
              <p className="text-gray-600">Head of Operations</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                  alt="Amit Desai" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-lg font-semibold">Amit Desai</h3>
              <p className="text-gray-600">Technical Lead</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                  alt="Sneha Mehta" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-lg font-semibold">Sneha Mehta</h3>
              <p className="text-gray-600">Customer Relations</p>
            </div>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions, suggestions, or feedback? We'd love to hear from you!
          </p>
          <div className="flex justify-center space-x-4">
            <a href="mailto:contact@kamshet.build" className="bg-[#3b82f6] text-white px-6 py-3 rounded-md font-medium hover:bg-[#2563eb] transition-colors">
              <i className="far fa-envelope mr-2"></i> Email Us
            </a>
            <a href="tel:+919876543210" className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
              <i className="fas fa-phone-alt mr-2"></i> Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
