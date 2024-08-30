import Image from "next/image";
import Link from "next/link";

import Logo from "@/public/logoBlack.png";

export default function Footer() {
    return (
        <footer className="not-prose flex flex-col sm:flex-row items-center justify-center pb-[2rem] max-w-[800px] mx-auto px-[1.6rem]">
            <div className="grid gap-4">
                <div className="grid gap-4">
                    <Link href="/">
                        <Image
                            src={Logo}
                            alt="Logo"
                            width={80}
                            height={160}
                            className="transition-all hover:opacity-75 dark:invert"
                        />
                    </Link>
                    <p className="text-stone-900 text-base leading-normal tracking-tight">
                        BrandArmor is a platform that allows local businesses to offer prepaid credit to their customers. We help you get more customers, keep them longer, and make more money.
                    </p>
                    {/* <div className="flex mb-2 gap-4 text-sm text-muted-foreground underline underline-offset-4 md:mb-0 md:flex-row">
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <Link href="/terms-of-service">Terms of Service</Link>
                    </div> */}
                    <p className="text-muted-foreground text-xs ">
                        ©{" "}
                        <a href="https://www.bolderstudios.com/" className="underline">Bolder Studios LLC</a>
                        . All rights reserved. 2024-present.
                    </p>
                </div>
            </div>
        </footer>
    );
}
