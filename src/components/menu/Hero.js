'use client';

export default function Hero() {
  return (
    <div className="relative h-96 bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 h-full flex items-center justify-center text-center">
        <div className="text-white">
          <h2 className="text-5xl font-serif font-light mb-4">Our Menu</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Carefully crafted dishes using the finest ingredients
          </p>
        </div>
      </div>
    </div>
  );
}