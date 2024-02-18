import { useAuthContext } from "./useAuthContext"
import { Redirect, usePathname } from "expo-router";
import LoadingScreen from "../components/LoadingScreen";

export default function AuthGuard({ children }) {

  const { isAuthenticated, isInitiated } = useAuthContext();

  const pathname = usePathname();

  if(!isInitiated) {
    return <LoadingScreen />
  }

  if (isInitiated && !isAuthenticated) {
    return <Redirect href={'auth/login?redirect='+pathname} />;
  }

  return (
    <>{children}</>
  )
}