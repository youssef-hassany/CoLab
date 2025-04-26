import { AuthFormsContainer } from "@/components/auth/AuthFormContainer";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { CheckCircle, Chrome, Github } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Section - Login Form */}
        {/* Left Section - Auth Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-800 p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-emerald-400">CoLab</h1>
              {/* <p className="text-gray-400 mt-2">
                {isSignup
                  ? "Create an account"
                  : "Sign in to start collaborating"}
              </p> */}
            </div>

            <AuthFormsContainer />

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <GoogleAuthButton />
                <button className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 cursor-pointer">
                  <Github />
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Marketing Content */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-emerald-800 to-gray-900 text-white flex items-center justify-center p-8">
          <div className="max-w-md">
            <h2 className="text-5xl font-bold mb-6">
              Collaboration Reimagined
            </h2>
            <p className="text-xl mb-8 text-emerald-100">
              Connect, create, and collaborate with your team, no matter where
              they are.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-emerald-400" />
                Organized Tasks Sharing
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-emerald-400" />
                Stay Up-To-Date With Your Team
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-emerald-400" />
                Easier to take Feedbacks
              </li>
            </ul>
            <div className="text-lg font-medium">
              Your team's next breakthrough starts here
              <div className="mt-2 text-emerald-300">
                Start Collaborating Today
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
