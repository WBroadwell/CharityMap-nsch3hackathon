import { Card } from "@/components/ui/card";
import Link from "next/dist/client/link";
import Image from "next/image";

export default function NavigationBar() {
  return (
    <div className="w-full flex justify-center h-16 mb-8 px-12">
      <Card className="w-3/5 justify-center rounded-lg">
        <nav className="flex items-center justify-between px-20 py-4">
          <Link href="/" className="transition hover:scale-110 hover:brightness-90 h-8 w-auto">
            <Image src="/charitymapheart.png" alt="Charity Map Logo" width={32} height={32} />
          </Link>
          <Link href="/events" className="transition text-2xl font-semibold text-blue-900 hover:scale-110 hover:brightness-85">Events</Link>
          <Link href="/addevent" className="transition text-2xl font-semibold text-blue-900 hover:scale-110 hover:brightness-85">Add Event</Link>
        </nav>
      </Card>
    </div>
  );
}