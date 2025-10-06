import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Footer */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img src="/images/karagirx-logo.png" alt="KARAGIRX" className="h-48 md:mx-0" style={{ transform: 'scaleX(1.2)' }} />
            </div>
            <p className="text-gray-300 mb-4">
              Connecting customers with the best construction professionals in Kamshet and surrounding areas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/professionals?type=contractor" className="text-gray-300 hover:text-white">Find Contractors</Link></li>
              <li><Link to="/professionals?type=architect" className="text-gray-300 hover:text-white">Find Architects</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Construction Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Cost Calculator</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        {/* Mobile Footer - Modern Compact Design */}
        <div className="md:hidden">
          {/* Brand and Social */}
          <div className="text-center mb-6">
            <div className="mb-3">
              <img src="/images/karagirx-logo.png" alt="KARAGIRX" className="h-48 mx-auto" style={{ transform: 'scaleX(1.2)' }} />
            </div>
            <div className="flex justify-center space-x-6 mb-4">
              <a href="#" className="text-gray-300 hover:text-white text-lg" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-300 hover:text-white text-lg" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-300 hover:text-white text-lg" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-300 hover:text-white text-lg" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          {/* Two-column grid for links */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-400">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white text-sm block">Home</Link></li>
                <li><Link to="/professionals?type=contractor" className="text-gray-300 hover:text-white text-sm block">Contractors</Link></li>
                <li><Link to="/professionals?type=architect" className="text-gray-300 hover:text-white text-sm block">Architects</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white text-sm block">About</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white text-sm block">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-400">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white text-sm block">Guide</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm block">Calculator</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm block">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm block">FAQ</a></li>
              </ul>
            </div>
          </div>
          
          {/* Legal Links */}
          <div className="flex justify-center space-x-4 text-xs text-gray-400 mb-2">
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <span>•</span>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-4 pt-4 text-center text-gray-400 text-xs">
          <p>&copy; {new Date().getFullYear()} KARAGIRX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
