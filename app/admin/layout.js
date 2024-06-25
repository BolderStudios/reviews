import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import { currentUser } from "@clerk/nextjs/server";
import Cookies from 'js-cookie';

export default async function AdminLayout({ children }) {
  const user = await currentUser();

  const userId = Cookies.get('user-id');

  const { data: userData, error: userDataError } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", user?.id);

  console.log("userId: ", userId);

  console.log(await currentUser())

  // if (data === undefined || data === null) {
  //   console.log("User not found");
  //   // const host = window.location.host;

  //   // console.log("host: ", host);
  //   return redirect("http://localhost:3000/sign-in");
  // }

  return (
    <div>
      <nav>Admin Layout</nav>
      <main>{children}</main>
    </div>
  );
}
