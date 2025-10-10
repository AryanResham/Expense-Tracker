import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

export function AuthModal({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const auth = useAuth()

  useEffect(() => {
    if (open) {
      setError(null)
      setLoading(false)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const em = email.trim()
    const pw = password

    if (!em || !pw) {
      setError("Please enter a valid email and password.")
      return
    }

    try {
      setLoading(true)
      
      if (isLogin) {
        await auth?.logInWithEmail(em, pw)
      } else {
        if (!name.trim()) {
          setError("Please enter your name.")
          return
        }
        await auth?.signUpWithEmail(em, pw)
        await auth?.updateUserProfile(name)
      }
      
      // Reset form and close modal
      setEmail("")
      setPassword("")
      setName("")
      setOpen(false)
      setIsLogin(true)
    } catch (err: any) {
      setError(err?.code?.replace("auth/", "") || err?.message || "Authentication failed")
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await auth?.signInWithGoogle()
      
      // Reset form and close modal
      setEmail("")
      setPassword("")
      setName("")
      setOpen(false)
      setIsLogin(true)
    } catch (err: any) {
      setError(err?.code?.replace("auth/", "") || err?.message || "Google sign-in failed")
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="relative z-[101] w-full max-w-sm mx-4">
        <Button
          variant="ghost"
          className="rounded-full absolute top-5 h-fit w-fit right-5 p-0"
          onClick={() => { setOpen(false); setError(null); }}
        >
          <X className="h-3 w-3 m-1" strokeWidth={1} />
        </Button>

        <div className="w-full mx-auto p-6 rounded-xl border shadow-sm bg-white">
          <h2 className="text-2xl font-semibold text-center mb-2">
            {isLogin ? "Log-in" : "Sign-up"}
          </h2>
          <p className="text-sm text-gray-500 text-center mb-4">
            {isLogin ? "Enter your email below to login" : "Fill in your details to sign up"}
          </p>

          {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {!isLogin && (
              <div className="grid gap-2 text-left">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="grid gap-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="xyz@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </Button>

            <Button onClick={handleGoogleSignIn} variant="outline" type="button" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Login with Google" : "Sign up with Google"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button type="button" onClick={() => { setIsLogin(false); setError(null); }} className="underline underline-offset-4">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => { setIsLogin(true); setError(null); }} className="underline underline-offset-4">
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
