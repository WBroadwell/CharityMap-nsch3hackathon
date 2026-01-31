"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 flex flex-col items-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 text-center leading-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-pink-500">Charity Map</span>!
        </h1>
        <p className="mt-8 text-xl text-gray-600 text-center max-w-2xl leading-relaxed">
          Connecting volunteers and donors with local opportunities and events in your community.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            href="/events"
            className="px-8 py-4 bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition text-center"
          >
            Browse Events
          </Link>
          <Link
            href="/addevent"
            className="px-8 py-4 bg-white text-rose-500 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition border-2 border-rose-500 text-center"
          >
            Host an Event
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          How <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-pink-500">Charity Map</span> Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Discover Events</h3>
            <p className="text-gray-600">Browse local charity events happening near you and find causes you care about.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Connect & Volunteer</h3>
            <p className="text-gray-600">Join events, meet like-minded people, and make a real impact in your community.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Host Your Own</h3>
            <p className="text-gray-600">Organizing a charity event? Add it to Charity Map and reach volunteers in your area.</p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-linear-to-r from-rose-500 to-pink-500 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-xl text-rose-100 leading-relaxed">
            Charity Map aims to bridge the gap between charitable organizations and community members
            who want to make a difference. We believe that everyone has the power to contribute,
            and finding the right opportunity should be simple and accessible.
          </p>
        </div>
      </div>

      {/* About / Hackathon Section */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-2 bg-linear-to-r from-rose-500 to-pink-500"></div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Project</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Charity Map was developed by <span className="font-semibold text-rose-500">William B.</span> for
              the <span className="font-semibold">NSCH3 Hackathon</span>. This project was built with the goal
              of creating a platform that makes it easier for people to discover and participate in charitable
              activities within their local communities.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The NSCH3 Hackathon challenges developers to create innovative solutions that address real-world
              problems. Charity Map tackles the challenge of connecting passionate volunteers with organizations
              that need their help, making community involvement more accessible than ever.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-medium">Next.js</span>
              <span className="px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-medium">Flask</span>
              <span className="px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-medium">PostgreSQL</span>
              <span className="px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-medium">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>

      
    </main>
  );
}