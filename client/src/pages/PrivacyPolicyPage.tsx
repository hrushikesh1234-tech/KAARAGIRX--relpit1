import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white py-12">
      <Helmet>
        <title>Privacy Policy | Kamshet.Build</title>
        <meta name="description" content="Privacy Policy for Kamshet.Build - Learn how we collect, use, and protect your data" />
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <div className="prose prose-lg max-w-none">
            <p>
              At Kamshet.Build, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website or use our services. Please read this privacy policy 
              carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect via the Site includes:
            </p>
            
            <h3>Personal Data</h3>
            <p>
              Personally identifiable information, such as your name, email address, telephone number, address, and demographic 
              information that you voluntarily give to us when you register with the Site or when you choose to participate in 
              various activities related to the Site. You are under no obligation to provide us with personal information of 
              any kind, however your refusal to do so may prevent you from using certain features of the Site.
            </p>
            
            <h3>Derivative Data</h3>
            <p>
              Information our servers automatically collect when you access the Site, such as your IP address, your browser type, 
              your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
            </p>
            
            <h3>Financial Data</h3>
            <p>
              Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, 
              expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services.
            </p>
            
            <h3>Mobile Device Data</h3>
            <p>
              Device information, such as your mobile device ID, model, and manufacturer, and information about the location of 
              your device, if you access the Site from a mobile device.
            </p>
            
            <h2>How We Collect Information</h2>
            <p>
              We collect information through various methods, including:
            </p>
            <ul>
              <li>Direct interactions when you register an account, contact us, or use our services</li>
              <li>Automated technologies such as cookies and similar tracking technologies</li>
              <li>Third parties or publicly available sources, such as our business partners or service providers</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>
              We may use the information we collect about you for various purposes, including:
            </p>
            <ul>
              <li>To create and manage your account</li>
              <li>To provide and maintain our services</li>
              <li>To process transactions and send related information</li>
              <li>To send administrative information, such as updates, security alerts, and support messages</li>
              <li>To respond to inquiries and offer support</li>
              <li>To personalize your experience and deliver content and product offerings relevant to your interests</li>
              <li>To facilitate communication between customers and professionals</li>
              <li>To gather analysis or valuable information so that we can improve our services</li>
              <li>To monitor the usage of our services</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To comply with legal obligations</li>
            </ul>
            
            <h2>Sharing Your Information</h2>
            <p>
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            
            <h3>By Law or to Protect Rights</h3>
            <p>
              If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy 
              potential violations of our policies, or to protect the rights, property, and safety of others, we may share your 
              information as permitted or required by any applicable law, rule, or regulation.
            </p>
            
            <h3>Business Transfers</h3>
            <p>
              If we or our subsidiaries are involved in a merger, acquisition, or asset sale, your information may be transferred 
              as a business asset. In such cases, we will provide notice before your information is transferred and becomes subject 
              to a different Privacy Policy.
            </p>
            
            <h3>Third-Party Service Providers</h3>
            <p>
              We may share your information with third parties that perform services for us or on our behalf, including payment 
              processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
            </p>
            
            <h3>With Your Consent</h3>
            <p>
              We may disclose your personal information for any other purpose with your consent.
            </p>
            
            <h2>Data Security</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While 
              we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite 
              our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed 
              against any interception or other type of misuse.
            </p>
            
            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing of your data</li>
              <li>Data portability (receiving your data in a structured, commonly used format)</li>
              <li>Objection to processing of your personal data</li>
            </ul>
            
            <p>
              To exercise these rights, please contact us using the information provided at the end of this policy.
            </p>
            
            <h2>Cookies and Tracking Technologies</h2>
            <p>
              We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize 
              the Site and improve your experience. For more information on how we use cookies, please refer to our Cookie Policy.
            </p>
            
            <h2>Third-Party Links</h2>
            <p>
              The Site may contain links to third-party websites and applications of interest, including advertisements and 
              external services, that are not affiliated with us. Once you have used these links to leave the Site, any information 
              you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and 
              privacy of your information.
            </p>
            
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy 
              Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically 
              for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:privacy@kamshet.build">privacy@kamshet.build</a><br />
              Address: Kamshet Office, Maharashtra, India
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              For any questions regarding our Privacy Policy, please contact us.
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

export default PrivacyPolicyPage;
