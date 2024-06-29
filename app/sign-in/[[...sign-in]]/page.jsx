// app/sign-in/[[...sign-in]]/page.jsx
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();
  if (userId) {
    redirect("/");
  }

  return (
    <SignIn
      appearance={{
        variables: {
          colorPrimary: "#0070f3",
          colorBackground: "#f0f4f8",
          fontFamily: "Arial, sans-serif",
        },
        elements: {
          formButtonPrimary: 
            "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out",
          card: "shadow-md rounded-lg",
          headerTitle: "text-2xl font-bold text-gray-800",
          headerSubtitle: "text-gray-600",
          socialButtonsBlockButton: 
            "border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out",
          formFieldInput: 
            "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          footerActionLink: "text-blue-600 hover:text-blue-800",
        },
      }}
    />
  );
}