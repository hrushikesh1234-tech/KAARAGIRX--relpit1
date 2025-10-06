import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="bg-white py-12">
      <Helmet>
        <title>Terms of Service | Kamshet.Build</title>
        <meta name="description" content="Terms of Service for Kamshet.Build - Read our terms and conditions" />
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <div className="prose prose-lg max-w-none">
            <h2>Introduction</h2>
            <p>
              Welcome to Kamshet.Build. These Terms of Service ("Terms") govern your use of the Kamshet.Build website, 
              mobile applications, and services (collectively, the "Services"). By accessing or using our Services, 
              you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
            </p>
            
            <h2>Acceptance of Terms</h2>
            <p>
              By creating an account, accessing, or using our Services, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms. We may modify these Terms at any time by posting the revised Terms 
              on our website or within our applications. Your continued use of the Services after such changes constitutes 
              your acceptance of the revised Terms.
            </p>
            
            <h2>User Accounts</h2>
            <p>
              To access certain features of our Services, you may need to create an account. You are responsible for 
              maintaining the confidentiality of your account credentials and for all activities that occur under your account. 
              You agree to provide accurate, current, and complete information during the registration process and to update 
              such information to keep it accurate, current, and complete.
            </p>
            
            <p>
              You are solely responsible for safeguarding your password and for any use of your account. You agree to 
              notify us immediately of any unauthorized use of your account or any other breach of security. We cannot 
              and will not be liable for any loss or damage arising from your failure to comply with these requirements.
            </p>
            
            <h2>User Content</h2>
            <p>
              Our Services allow you to post, link, store, share, and otherwise make available certain information, text, 
              graphics, videos, or other material ("User Content"). You are responsible for the User Content that you post 
              to the Services, including its legality, reliability, and appropriateness.
            </p>
            
            <p>
              By posting User Content to the Services, you grant us a non-exclusive, worldwide, royalty-free, sublicensable, 
              and transferable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, 
              distribute, perform, and display such User Content in connection with operating and providing the Services.
            </p>
            
            <h2>Intellectual Property</h2>
            <p>
              The Services and their original content (excluding User Content), features, and functionality are and will remain 
              the exclusive property of Kamshet.Build and its licensors. The Services are protected by copyright, trademark, 
              and other laws of both India and foreign countries. Our trademarks and trade dress may not be used in connection 
              with any product or service without the prior written consent of Kamshet.Build.
            </p>
            
            <h2>Prohibited Conduct</h2>
            <p>
              You agree not to use the Services:
            </p>
            <ul>
              <li>In any way that violates any applicable law or regulation.</li>
              <li>To impersonate or attempt to impersonate Kamshet.Build, a Kamshet.Build employee, another user, or any other person or entity.</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services.</li>
              <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Services.</li>
              <li>To use the Services for any fraudulent or unlawful purpose.</li>
              <li>To post false, misleading, or deceptive reviews or information about professionals on the platform.</li>
            </ul>
            
            <h2>Disclaimer of Warranties</h2>
            <p>
              The Services are provided on an "as is" and "as available" basis, without warranties of any kind, either 
              express or implied. Kamshet.Build disclaims all warranties, including implied warranties of merchantability, 
              fitness for a particular purpose, and non-infringement.
            </p>
            
            <p>
              We do not warrant that our Services will be uninterrupted or error-free, that defects will be corrected, 
              or that our Services or the server that makes them available are free of viruses or other harmful components.
            </p>
            
            <h2>Limitation of Liability</h2>
            <p>
              In no event shall Kamshet.Build, its directors, employees, partners, agents, suppliers, or affiliates be 
              liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your access to or use of or inability to access or use the Services;</li>
              <li>Any conduct or content of any third party on the Services;</li>
              <li>Any content obtained from the Services; and</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
            </ul>
            
            <h2>Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Kamshet.Build, its parent, subsidiaries, affiliates, and 
              their respective directors, officers, employees, and agents from and against all claims, damages, obligations, 
              losses, liabilities, costs or debt, and expenses arising from your use of and access to the Services.
            </p>
            
            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, 
              for any reason, including without limitation if you breach these Terms. Upon termination, your right to use the 
              Services will immediately cease.
            </p>
            
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is 
              material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a 
              material change will be determined at our sole discretion.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:terms@kamshet.build">terms@kamshet.build</a><br />
              Address: Kamshet Office, Maharashtra, India
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              For any questions regarding our Terms of Service, please contact us.
            </p>
            <Link to="/contact" className="bg-[#3b82f6] text-white px-6 py-2 rounded-md font-medium hover:bg-[#2563eb] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
