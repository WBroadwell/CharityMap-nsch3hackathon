import Link from "next/dist/client/link";
import Image from "next/image";

export default function NavigationBar() {
  return (
    <div className="w-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
        <Link href="/" className="transition hover:scale-110 hover:opacity-80">
          <Image src="/charitymapheart.png" alt="Charity Map Logo" width={40} height={40} />
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/events" className="text-lg font-semibold text-white hover:text-rose-100 transition">
            Events
          </Link>
          <Link href="/map" className="flex items-center gap-2 text-lg font-semibold text-white hover:text-rose-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Map
          </Link>
          <Link href="/addevent" className="bg-white text-rose-500 px-4 py-2 rounded-full font-semibold hover:bg-rose-50 transition">
            Add Event
          </Link>
        </div>
      </nav>
    </div>
  );
}