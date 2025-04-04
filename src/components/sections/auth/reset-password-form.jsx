"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PATH_AUTH } from "@/routes/paths";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { appwriteAccount } from "@/hook/auth/AppwriteContext";
import { toast } from "sonner";

export function ResetPasswordForm({ className, ...props }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await appwriteAccount.createRecovery(
        event.target.elements.email.value,
        `${window.location.origin}${PATH_AUTH.newPassword}`
      );
      toast.success("Email sent successfully. Please check your mailbox...");
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
                <h1 className="text-2xl font-bold">Forgot Your Password?</h1>
                <p className="text-balance text-muted-foreground">
                  Don't worry! Please enter your email address below and we'll
                  send you a link to reset your password.
                </p>
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Send Verification Email
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href={PATH_AUTH.signup}
                  className="underline underline-offset-4"
                >
                  Sign up
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
