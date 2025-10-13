"use client"
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Github } from 'lucide-react'

function Login() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/")
    }
  }, [status, router])

  const handleGithubSignIn = async () => {
    setError("")
    setLoading(true)
    
    try {
      await signIn("github", { 
        callbackUrl: "/",
      })
    } catch (error) {
      setError("Failed to sign in with GitHub")
      setLoading(false)
    }
  }

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  // Don't render login form if already authenticated
  if (status === "authenticated") {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-100 mb-6">
            Sign in to GitTube
          </h2>

          <p className="text-center text-gray-400 text-sm mb-6">
            Authenticate with your GitHub account to continue
          </p>

          {/* GitHub Sign In Button */}
          <button
            type="button"
            onClick={handleGithubSignIn}
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 font-medium py-3 px-4 rounded-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <Github className="w-5 h-5" />
            {loading ? "Connecting to GitHub..." : "Continue with GitHub"}
          </button>

          {error && (
            <div className="mt-4 bg-red-900/20 border border-red-800 text-red-400 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <p className="text-center text-gray-500 text-xs mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login