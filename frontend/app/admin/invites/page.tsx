"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminInvites() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        inviteUrl?: string;
        error?: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const frontendUrl = typeof window !== "undefined" ? window.location.origin : "";

    useEffect(() => {
        if (!isLoading && (!user || !user.is_admin)) {
            router.push("/");
        }
    }, [user, isLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResult(null);
        setIsSubmitting(true);
        setCopied(false);

        try {
            const response = await fetch(`${baseUrl}/auth/create-invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult({
                    success: true,
                    inviteUrl: `${frontendUrl}${data.invite_url}`,
                });
                setEmail("");
            } else {
                setResult({
                    success: false,
                    error: data.error || "Failed to create invite",
                });
            }
        } catch {
            setResult({
                success: false,
                error: "Network error. Please try again.",
            });
        }

        setIsSubmitting(false);
    };

    const copyToClipboard = async () => {
        if (result?.inviteUrl) {
            await navigator.clipboard.writeText(result.inviteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
            </main>
        );
    }

    if (!user || !user.is_admin) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                            Send Invites
                        </span>
                    </h1>
                    <p className="mt-3 text-gray-600">
                        Invite organizations to join Charity Map
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Organization Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                    placeholder="organization@example.com"
                                    required
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Enter the email address of the organization you want to invite.
                                    They will receive a unique registration link.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl p-4 font-semibold hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
                            >
                                {isSubmitting ? "Creating Invite..." : "Generate Invite Link"}
                            </button>
                        </form>

                        {result && (
                            <div className="mt-6">
                                {result.success ? (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-green-700 mb-2">
                                                    Invite link created successfully!
                                                </p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={result.inviteUrl}
                                                        readOnly
                                                        className="flex-1 text-xs bg-white border border-green-300 rounded-lg p-2 text-gray-600"
                                                    />
                                                    <button
                                                        onClick={copyToClipboard}
                                                        className="px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition"
                                                    >
                                                        {copied ? "Copied!" : "Copy"}
                                                    </button>
                                                </div>
                                                <p className="mt-2 text-xs text-green-600">
                                                    Share this link with the organization to complete their registration.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <p className="text-sm text-red-600">{result.error}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href="/profile"
                        className="text-rose-500 hover:text-rose-600 font-medium"
                    >
                        Back to Profile
                    </Link>
                </div>
            </div>
        </main>
    );
}
