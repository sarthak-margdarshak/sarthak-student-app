import AuthGuard from "../auth/AuthGuard";
import { Redirect } from "expo-router";

export default function SarthakApp() {
  return (
    <AuthGuard>
      <Redirect href='/dashboard' />
    </AuthGuard>
  )
}