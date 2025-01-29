import { useAuthContext } from "./useAuthContext";
import { Redirect, usePathname } from "expo-router";
import LoadingScreen from "../components/LoadingScreen";
import {MaintenanceLight} from "../components/SVG/MaintenanceLight";
import {useTheme} from "react-native-paper";
import {MaintenanceDark} from "../components/SVG/MaintenanceDark";

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitiated } = useAuthContext();
  const theme = useTheme();

  const pathname = usePathname();

  // if (!isInitiated) {
  //   return <LoadingScreen />;
  // }
  //
  // if (isInitiated && !isAuthenticated) {
  //   return <Redirect href={"auth/login?redirect=" + pathname} />;
  // }
  //
  // return <>{children}</>;

  return (
    <>
    {theme.dark ? <MaintenanceDark /> : <MaintenanceLight />}
    </>
  )
}
