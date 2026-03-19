import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col items-center justify-center px-4">
      <Link
        href="/"
        className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent mb-8"
      >
        CollegeForge
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
