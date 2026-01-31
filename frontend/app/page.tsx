"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Image
        src="/charitymaplogo.png"
        alt="Logo"
        width={450}
        height={450}
      />
      <h1 className="text-4xl font-bold py-5">Welcome to Charity Map!</h1>
      <Card className="p-5 font-semibold text-md">Charity Map is a hub for connecting volunteers and donors with local opportunities and events!</Card>
    </main>
  );
}