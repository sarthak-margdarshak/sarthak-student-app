"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PATH_AUTH } from "@/routes/paths";
import { useState } from "react";
import { toast } from "sonner";
import { appwriteAccount } from "@/hook/auth/AppwriteContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignupForm({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function generateUserId(name) {
    const x = name.split(" ");
    let firstName = "";
    let lastName = "";
    if (x.length >= 2) {
      firstName = x[0];
      lastName = x[1];
    } else {
      firstName = x[0];
    }
    const sanitize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const sanitized = sanitize(firstName) + "-" + sanitize(lastName);
    const namePart = sanitized.slice(0, 24) || "user";
    const timestamp = Date.now().toString(36);
    return (namePart + "-" + timestamp).slice(0, 35);
  }

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    if (
      event.target.elements.password.value !==
      event.target.elements["confirm-password"].value
    ) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }
    try {
      await appwriteAccount.create(
        generateUserId(event.target.elements.name.value),
        event.target.elements.email.value,
        event.target.elements.password.value,
        event.target.elements.name.value
      );
      toast.success("Successfully Signed Up!! Please login to continue...");
      router.push(PATH_AUTH.login);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-balance text-muted-foreground">
                  Create a Sarthak Margdarshak account
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Type your name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sarthak@email.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Choose a password"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                </div>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  placeholder="Confirm your password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Sign Up
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href={PATH_AUTH.login}
                  className="underline underline-offset-4"
                >
                  Log In
                </a>
              </div>
            </div>
          </form>

          <div className="relative hidden border-l md:block">
            <img
              src="/splash/splash-1024x1024.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <a
          href="https://sarthakmargdarshak.in/terms-and-conditions"
          target="_blank"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="https://sarthakmargdarshak.in/privacy-policy" target="_blank">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
