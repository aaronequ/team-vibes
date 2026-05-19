import Image from "next/image";
import Link from "next/link";
import { Button } from "./components/ui/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-bg-surface items-center justify-center p-6">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md space-y-12">
        
        <div className="flex flex-col items-center space-y-4 text-center">
          <Image 
            src="/logo.png" 
            alt="SnapChef Logo" 
            width={300} 
            height={150} 
            priority
            className="mb-4"
          />
          <div>
            <h1 className="text-4xl font-bold text-secondary tracking-tight mb-2">SnapChef</h1>
            <p className="text-text-main text-lg font-medium">Your Smart Fridge Recipe Assistant</p>
          </div>
        </div>

        <div className="w-full space-y-4">
          <Link href="/team-1/scan" className="block w-full">
            <Button size="lg" fullWidth variant="primary" className="text-lg">
              Scan Fridge
            </Button>
          </Link>
          <p className="text-center text-text-light text-sm">
            Effortless, fresh, and smart cooking.
          </p>
        </div>

      </div>
    </main>
  );
}
