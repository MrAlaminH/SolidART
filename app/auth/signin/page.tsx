"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("An error occurred:", result.error);
        setError("An unexpected error occurred. Please try again.");
      } else {
        router.push("/explore");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
      <Card className="w-[350px] bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl: "/explore" })}
            >
              {/* Add an icon here, e.g., a Google icon */}
              Sign in with Google
            </Button>
          </div>
          <div className="mt-4 text-center">
            <p>
              Dont have an account?{" "}
              <a href="/auth/register" className="text-blue-500">
                Register
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
