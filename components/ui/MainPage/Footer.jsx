import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

import Logo from "@/public/logoBlack.png";

export default function Footer() {
    return (
        <footer className="not-prose flex flex-col sm:flex-row items-center justify-center pb-[2rem] max-w-[800px] mx-auto">
            <div className="grid gap-6">
                <div className="grid gap-6">
                    <Link href="/">
                        <h3 className="sr-only">brijr/components</h3>
                        <Image
                            src={Logo}
                            alt="Logo"
                            width={120}
                            height={27.27}
                            className="transition-all hover:opacity-75 dark:invert"
                        ></Image>
                    </Link>
                    <p className="text-stone-900 text-base leading-normal tracking-tight">
                        BrandArmor is a platform that allows local businesses to offer prepaid credit to their customers. We help you get more customers, keep them longer, and make more money.
                    </p>
                    <div className="flex mb-2 gap-4 text-sm text-muted-foreground underline underline-offset-4 md:mb-0 md:flex-row">
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <Link href="/terms-of-service">Terms of Service</Link>
                        <Link href="/cookie-policy">Cookie Policy</Link>
                    </div>
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
