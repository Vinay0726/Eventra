export default function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo & Description */}
        <div>
          <h3 className="text-2xl font-bold text-green-400">Eventra</h3>
          <p className="text-sm mt-2 text-gray-400">
            Your one-stop platform for organizing and exploring amazing events.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-2">Quick Links</h4>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>
              <a href="#features" className="hover:text-green-400 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-green-400 transition">
                Contact
              </a>
            </li>
            
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-lg mb-2">Get in Touch</h4>
          <p className="text-sm text-gray-300">eventra.support@email.com</p>
          <p className="text-sm text-gray-300 mt-1">+91 98765 43210</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-sm text-gray-500 text-center">
        &copy; {new Date().getFullYear()} Eventra. All rights reserved.
      </div>
    </footer>
  );
}
