import Header from "@/components/header";
import { Outlet, useNavigation } from "react-router-dom";

export default function Root() {
  const navigation = useNavigation();
  return (
    <>
      <Header />
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
