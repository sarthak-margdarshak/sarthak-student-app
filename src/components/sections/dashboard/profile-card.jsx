"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  Package,
  ShoppingCart,
  PenSquare,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import ImagePickerDialog from "./image-dialogue";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { appwriteAccount, appwriteFunction } from "@/hook/auth/AppwriteContext";
import { APPWRITE_API } from "@/config-global";
import { toast } from "sonner";

export default function ProfileCard() {
  const { user, logout } = useAuthContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    console.log("Logout");
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

  const handleEditProfile = () => {
    setIsDialogOpen(true);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // let scheduledDeleteDate = new Date(
      //   Math.floor(Date.now() / (1000 * 60)) * 60 * 1000 +
      //     90 * 24 * 60 * 60 * 1000
      // );
      // const deleteFunction = await appwriteFunction.createExecution(
      //   "sarthak-api",
      //   undefined,
      //   true,
      //   "/user/update/permanently-delete",
      //   "GET",
      //   {},
      //   scheduledDeleteDate.toISOString().replace("T", " ").replace("Z", "")
      // );

      const tempPrefs = await appwriteAccount.getPrefs();
      appwriteAccount.updatePrefs({
        ...tempPrefs,
        scheduledDeleteFunctionId: deleteFunction.$id,
      });

      appwriteFunction.createExecution(
        APPWRITE_API.functions.sarthakAPI,
        undefined,
        true,
        "/user/update/delete"
      );
      toast.success("Account deletion scheduled. You will be logged out soon.");
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Function to get user initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <main className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Profile Card with beautiful gradient background */}
          <div className="rounded-2xl shadow-md overflow-hidden mb-8">
            {/* Gradient background */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pt-12 pb-6 px-6">
              <div className="flex flex-col items-center">
                {/* Avatar with white ring and edit button */}
                <div className="relative mb-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                    {user?.prefs?.photo ? (
                      <Image
                        src={user?.prefs?.photo}
                        alt={user.name}
                        fill
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-gray-600">
                        {getInitials(user.name)}
                      </span>
                    )}
                  </div>

                  {/* Edit profile button */}
                  <button
                    onClick={handleEditProfile}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                    aria-label="Edit profile picture"
                  >
                    <PenSquare size={18} className="text-indigo-600" />
                  </button>
                </div>

                {/* User Information */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-white/80">{user.email}</p>
                </div>
              </div>
            </div>

            {/* White bottom section */}
            <div className="bg-white p-6 rounded-b-2xl">
              <div className="w-full h-1 bg-gray-100 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Orders */}
                <Link href={PATH_DASHBOARD.orders.root} className="group">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:border-blue-100 hover:scale-102">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                        <Package size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Orders
                        </h3>
                        <p className="text-sm text-gray-500">
                          View your order history
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Purchased */}
                <Link href={PATH_DASHBOARD.purchased} className="group">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:border-green-100 hover:scale-102">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                        <ShoppingCart size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Purchased
                        </h3>
                        <p className="text-sm text-gray-500">
                          Browse your mock test series
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 flex flex-col gap-4 items-center">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full max-w-md py-4 px-6"
              disabled={loggingOut}
            >
              {loggingOut && <Loader2 className="animate-spin mr-2" />}
              <LogOut size={20} className="mr-2" />
              <span>Logout</span>
            </Button>

            {/* Delete Account Button */}
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full max-w-md py-4 px-6 text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="animate-spin mr-2" />}
              <Trash2 size={20} className="mr-2" />
              <span>Delete Account</span>
            </Button>
          </div>
        </div>
      </main>

      <ImagePickerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      {/* Delete Account Alert Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  By clicking Delete Account, it will:
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500/60" />
                    <span className="text-sm text-muted-foreground">
                      Remove access to all purchased mock test series
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500/60" />
                    <span className="text-sm text-muted-foreground">
                      Delete your test history and all saved progress
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500/60" />
                    <span className="text-sm text-muted-foreground">
                      Disable access to all app features and settings
                    </span>
                  </div>
                </div>
                <div className="mt-4 rounded-md bg-amber-50 p-3">
                  <span className="text-sm font-medium text-amber-700">
                    Your account will enter a 90-day recovery period. Contact
                    our support team during this time if you wish to recover
                    your account.
                  </span>
                </div>
                <div className="mt-2 rounded-md bg-slate-50 p-3">
                  <span className="text-sm text-slate-600">
                    <strong>Note:</strong> After 90 days, all data will be
                    permanently deleted and cannot be recovered.
                  </span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
