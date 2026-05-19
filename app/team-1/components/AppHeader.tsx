import Link from 'next/link';
import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="flex items-center px-6 py-4 bg-bg-surface border-b border-slate-100 sticky top-0 z-40">
      <Link href="/team-1" className="flex items-center">
        <Image 
          src="/logo.png" 
          alt="SnapChef Logo" 
          width={120} 
          height={60} 
          className="object-contain"
        />
      </Link>
    </header>
  );
}
