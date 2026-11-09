import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-[#0878D1]/10 text-[#0878D1] flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
        </div>
        <div>
          <h1 className="text-5xl font-extrabold text-[#17243A]">404</h1>
          <h2 className="text-xl font-bold text-[#17243A] mt-1">Page Not Found</h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-2 max-w-sm mx-auto">
            The requested trail or destination route does not exist. Let's guide you back to Kolhapur's main attractions.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="bg-[#FF7900] hover:bg-[#E66D00] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/explore"
            className="bg-[#F5F8FC] hover:bg-gray-200 text-[#17243A] text-xs sm:text-sm font-bold px-6 py-3 rounded-xl border border-[#E5E7EB] transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Explore Destinations</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
