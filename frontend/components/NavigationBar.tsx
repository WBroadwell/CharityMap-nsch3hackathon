/**
 * Navigation Bar Component
 *
 * The main navigation header that appears on all pages.
 * Shows different links based on whether the user is logged in:
 * - Not logged in: Events, Map, Sign In
 * - Logged in: Events, Map, Add Event, Profile
 * - Admin users: Also see "Invites" link and "ADMIN" badge
 */

"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function NavigationBar() {
    const { user, isLoading } = useAuth();

    return (
        <div className="w-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg">
            <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
                {/* Left side: Logo and admin badge */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="transition hover:scale-110 hover:opacity-80">
                        <Image src="/charitymapheart.png" alt="Charity Map Logo" width={40} height={40} />
                    </Link>
                    {/* Show ADMIN badge for admin users */}
                    {user?.is_admin && (
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/30">
                            ADMIN
                        </span>
                    )}
                </div>

                {/* Right side: Navigation links */}
                <div className="flex items-center space-x-6">
                    {/* Public links - always visible */}
                    <Link href="/events" className="text-lg font-semibold text-white hover:text-rose-100 transition">
                        Events
                    </Link>
                    <Link href="/map" className="flex items-center gap-2 text-lg font-semibold text-white hover:text-rose-100 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Map
                    </Link>

                    {/* Conditional links based on login status */}
                    {!isLoading && (
                        <>
                            {user ? (
                                // Logged in - show user-specific links
                                <>
                                    <Link
                                        href="/addevent"
                                        className="text-lg font-semibold text-white hover:text-rose-100 transition"
                                    >
                                        Add Event
                                    </Link>

                                    {/* Admin-only: Invites link */}
                                    {user.is_admin && (
                                        <Link
                                            href="/admin/invites"
                                            className="flex items-center gap-2 text-lg font-semibold text-white hover:text-rose-100 transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Invites
                                        </Link>
                                    )}

                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 bg-white text-rose-500 px-4 py-2 rounded-full font-semibold hover:bg-rose-50 transition"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profile
                                    </Link>
                                </>
                            ) : (
                                // Not logged in - show sign in button
                                <Link
                                    href="/signin"
                                    className="flex items-center gap-2 bg-white text-rose-500 px-4 py-2 rounded-full font-semibold hover:bg-rose-50 transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
}
