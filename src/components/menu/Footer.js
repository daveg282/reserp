'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-serif text-2xl mb-4">Bistro Elegante</h4>
            <p className="text-gray-400 leading-relaxed">
              Experience the art of fine dining with our carefully curated menu and exceptional service.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Contact</h5>
            <div className="space-y-2 text-gray-400">
              <p>123 Gourmet Avenue</p>
              <p>Addis Ababa, Ethiopia</p>
              <p>+251 911 234 567</p>
              <p>info@bistroelegante.com</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Hours</h5>
            <div className="space-y-2 text-gray-400">
              <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
              <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Bistro Elegante. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}