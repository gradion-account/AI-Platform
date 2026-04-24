import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-brand-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-brand-black mb-2">
          Access Restricted
        </h1>
        <p className="text-gray-500 mb-6">
          This platform is only accessible to{" "}
          <span className="font-semibold text-brand-black">@gradion.com</span>{" "}
          email addresses. Please sign in with your Gradion work email.
        </p>
        <Link href="/login" className="btn-primary">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
