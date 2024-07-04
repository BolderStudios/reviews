"use client";

import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/ui/mobile-nav";

import {
  Bell,
  Home,
  Package2,
  ShoppingCart,
  FileUp,
  FormInput,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// const frameworks = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
// ];

export default function SidebarNavigation({ locations }) {
  const [open, setOpen] = useState(false);

  // Default location value
  const [value, setValue] = useState(
    `${
      locations.filter((location) => location.is_primary === true)[0]
        .organization_name
    }`
  );
  const pathname = usePathname();
  const currentPathname = pathname.split("/")[1];

  const activeLinkClass = (href) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
      currentPathname === href.split("/")[1]
        ? "bg-muted text-primary"
        : "text-muted-foreground"
    } group`;

  console.log("Value: ", value);

  return (
    <div className="grid min-h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {value
                    ? locations.find(
                        (location) => location.organization_name === value
                      )?.organization_name
                    : "Select location..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[247px] p-0">
                <Command>
                  <CommandList className="w-full">
                    <CommandGroup className="w-full p-0">
                      <div className="w-full px-4 py-2 border-b mb-1">
                        <span className="text-[13px] text-muted-foreground">
                          Locations ({locations.length})
                        </span>
                      </div>

                      {locations.map((location) => (
                        <div className="px-1">
                          <CommandItem
                            className="w-full p-2"
                            key={location.created_at}
                            value={location.organization_name}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === location.organization_name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {location.organization_name}
                          </CommandItem>
                        </div>
                      ))}

                      <div className="p-1 mt-1">
                        <Button
                          className="w-full p-0 text-foreground"
                          variant="outline"
                          size="sm"
                        >
                          Add new location
                        </Button>
                      </div>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className={`${activeLinkClass("/dashboard")}`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>

              <Link
                href="/billing"
                className={`${activeLinkClass("/billing")}`}
              >
                <ShoppingCart className="h-4 w-4" />
                Billing
                {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge> */}
              </Link>

              <Link
                href="/file-uploader"
                className={`${activeLinkClass("/file-uploader")}`}
              >
                <FileUp className="h-4 w-4" />
                File Uploader Example{" "}
              </Link>

              <Link href="/form" className={`${activeLinkClass("/form")}`}>
                <FormInput className="h-4 w-4" />
                Form Example
              </Link>
            </nav>
          </div>

          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>

      <div>
        <MobileNav />
      </div>
    </div>
  );
}
