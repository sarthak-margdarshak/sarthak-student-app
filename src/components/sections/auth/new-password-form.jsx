"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PATH_AUTH } from "@/routes/paths";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { appwriteAccount, appwriteFunction } from "@/hook/auth/AppwriteContext";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { APPWRITE_API } from "@/config-global";
import { useRouter } from "next/navigation";

export function NewPasswordForm({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState(searchParams.get("userId"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const secret = searchParams.get("secret");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let response = await appwriteFunction.createExecution(
          APPWRITE_API.functions.sarthakAPI,
          JSON.stringify({ userId: userId }),
          false,
          "/user/fetch/id"
        );
        response = JSON.parse(response.responseBody);
        if (response.status === "success") {
          setUserId(response.user.$id);
          setName(response.user.name);
          setEmail(response.user.email);
        } else {
          toast.error("Issue while fetching user detail...");
        }
      } catch (e) {
        toast.error(e.message);
      }
      setLoading(false);
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (
      event.target.elements.password.value !==
      event.target.elements["confirm-password"].value
    ) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }
    try {
      await appwriteAccount.updateRecovery(
        userId,
        secret,
        event.target.elements.password.value
      );
      toast.success(
        "Password updated successfully!! Please login to continue..."
      );
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
                <h1 className="text-2xl font-bold">Create Your Password?</h1>
                <p className="text-balance text-muted-foreground">
                  Develop a new password
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="userId">User Id</Label>
                <Input id="userId" type="text" value={userId} disabled />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" value={name} disabled />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" disabled value={email} />
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
                Reset Password
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
