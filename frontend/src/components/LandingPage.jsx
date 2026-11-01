import React from 'react';

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#0b1329] text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="w-full px-8 py-5 flex justify-between items-center border-b border-gray-800/40">
        <div className="text-xl font-bold tracking-tight text-blue-500">
          HRM Portal
        </div>
        <button
          onClick={onGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors duration-150 shadow-md"
        >
          Login / Register
        </button>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow flex flex-col items-center justify-center text-center">
        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Empower Your Workforce with <span className="text-blue-500">HRM Portal</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 max-w-2xl text-sm sm:text-base mb-8 leading-relaxed">
          A smart Human Resource Management platform designed to simplify attendance tracking,
          leave management, employee records, and communication across teams.
        </p>

        {/* Get Started CTA */}
        <button
          onClick={onGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm mb-16 transition-all duration-150 shadow-lg shadow-blue-600/20"
        >
          Get Started
        </button>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* Card 1: Employee Management */}
          <div className="bg-[#111c38]/60 border border-gray-800/80 rounded-xl p-8 flex flex-col items-center text-center hover:border-gray-700/80 transition duration-200">
            <div className="mb-5 text-blue-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-3 text-base">Employee Management</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Manage employee records, roles, and information efficiently.
            </p>
          </div>

          {/* Card 2: Attendance & Leave */}
          <div className="bg-[#111c38]/60 border border-gray-800/80 rounded-xl p-8 flex flex-col items-center text-center hover:border-gray-700/80 transition duration-200">
            <div className="mb-5 text-emerald-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-3 text-base">Attendance & Leave</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Track attendance and handle leave approvals easily.
            </p>
          </div>

          {/* Card 3: HR & Manager Tools */}
          <div className="bg-[#111c38]/60 border border-gray-800/80 rounded-xl p-8 flex flex-col items-center text-center hover:border-gray-700/80 transition duration-200">
            <div className="mb-5 text-amber-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 1321 13.255A2.375 2.375 0 0 0 19 11.625V5.375A2.375 2.375 0 0 0 16.625 3H7.375A2.375 2.375 0 0 0 5 5.375v6.25A2.375 2.375 0 0 0 7.375 14H10M3 13h18M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-3 text-base">HR & Manager Tools</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Handle team announcements, performance, and training modules.
            </p>
          </div>

          {/* Card 4: Employee Growth */}
          <div className="bg-[#111c38]/60 border border-gray-800/80 rounded-xl p-8 flex flex-col items-center text-center hover:border-gray-700/80 transition duration-200">
            <div className="mb-5 text-pink-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-3 text-base">Employee Growth</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Monitor performance and assign development trainings.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-gray-800/40 text-center text-gray-500 text-xs">
        © 2025 HRM Portal — Empowering Teams, Simplifying Workflows.
      </footer>
    </div>
  );
}