import Link from 'next/link';

export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 shadow-lg">
      <div className="flex flex-col space-y-4">
        <div className="border-t border-gray-200 pt-4">
          <Link 
            href="/login" 
            className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
            onClick={onClose}
          >
            Staff Login
          </Link>
          <Link 
            href="/menu" 
            className="block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors font-medium text-center mt-2 shadow-lg"
            onClick={onClose}
          >
            View Demo Menu
          </Link>
        </div>
      </div>
    </div>
  );
}