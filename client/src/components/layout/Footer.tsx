import { Link } from "react-router-dom";
// Social media icons replaced with text for compatibility

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🏢</span>
              Kamshet
            </h3>
            <p className="text-gray-400 mb-4">Connecting customers with the best contractors and architects in Kamshet, Maharashtra.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                FB
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                IG
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                TW
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                IN
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">For Professionals</h3>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-gray-400 hover:text-white transition">Join as a Professional</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Resources</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">For Customers</h3>
            <ul className="space-y-2">
              <li><Link to="/professionals" className="text-gray-400 hover:text-white transition">Find Professionals</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Project Planning</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Verification Process</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Dispute Resolution</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Kamshet Construction & Architecture Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
