import { SignIn } from "@clerk/nextjs";
import Image from "next/image"; // ✅ Use Next.js Image for images

export default function Page() {
  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Image */}
      <div className="hidden md:flex md:w-3/5 items-center justify-center bg-white">
        <div className="flex items-center justify-center h-full">
          <Image
            className="border border-purple-300 rounded-4xl p-10 shadow-2xl"
            src="/logo.svg"
            alt="Welcome"
            width={600}
            height={600}
          />
        </div>
      </div>

      {/* Right Side - Sign In */}
      <div className="w-full md:w-2/5 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome to AInterviewer
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to your account
            </p>
          </div>
          <SignIn routing="path" />
        </div>
      </div>
    </section>
  );
}
