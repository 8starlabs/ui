import { Goldman } from "next/font/google";
import { siteConfig } from "@/lib/config";

const goldman = Goldman({
  weight: "400",
  subsets: ["latin"],
  display: "swap"
});

export default function Home() {
  return (
    <div className="max-w-10xl  px-6 sm:px-16  mx-auto flex flex-col min-h-svh py-8 gap-8"></div>
  );
}
