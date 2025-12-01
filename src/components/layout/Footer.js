import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">InerNett</h4>
            <p className="text-gray-400 text-sm">
              Complete Restaurant Management System for modern Ethiopian restaurants.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">System</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/menu" className="hover:text-white transition-colors">Customer Menu</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Staff Login</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Contact</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Addis Ababa, Ethiopia</li>
              <li>+251 911 234 567</li>
              <li>info@inernett.com</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Technology</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Next.js 14</li>
              <li>React 18</li>
              <li>Tailwind CSS</li>
              <li>Real-time Updates</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 InerNett Restaurant ERP System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}