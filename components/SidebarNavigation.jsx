"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { MobileNav } from "@/components/ui/mobile-nav";
import {
  Home,
  ShoppingCart,
  Check,
  ChevronsUpDown,
  Star,
  ContainerIcon,
  BookOpenText,
  Info,
  Contact,
  ShoppingBasket,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Buttons/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AddLocation } from "@/components/ui/AddLocation";
import { updateSelectedLocation } from "@/app/actions";
import { toast } from "sonner";
import { SignOutButton } from "@clerk/nextjs";

export default function SidebarNavigation({
  passedLocations = [],
  passedSelectedLocation = null,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    passedSelectedLocation
  );

  const pathname = usePathname();
  const currentPathname = pathname.split("/")[1];

  const handleLocationChange = async (location) => {
    setSelectedLocation(location);
    setOpen(false);

    if (currentPathname !== "billing") {
      try {
        const data = await updateSelectedLocation(location, currentPathname);
        if (data.success) {
          router.push(data.newPath);
          toast.success("Location updated successfully");
        } else {
          toast.error("Failed to update location");
        }
      } catch (error) {
        console.error("Error updating location:", error);
        toast.error("An error occurred while updating location");
      }
    }
  };

  const activeLinkClass = (href) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
      currentPathname === href.split("/")[1]
        ? "bg-muted text-primary"
        : "text-muted-foreground"
    } group`;

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
                  {selectedLocation ? (
                    <span className="flex items-center">
                      {selectedLocation.organization_name}
                      {selectedLocation.is_primary && (
                        <Star className="ml-2 h-4 w-4 text-yellow-500" />
                      )}
                    </span>
                  ) : (
                    "Loading data..."
                    // "Select location..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[247px] p-0">
                <Command>
                  <CommandList className="w-full">
                    <CommandGroup className="w-full p-0">
                      <div className="w-full px-4 py-2 border-b mb-1">
                        <span className="text-[13px] text-muted-foreground">
                          Locations ({passedLocations.length})
                        </span>
                      </div>
                      {passedLocations
                        .sort((a, b) => {
                          if (a.is_primary && !b.is_primary) return -1;
                          if (!a.is_primary && b.is_primary) return 1;
                          return a.organization_name.localeCompare(
                            b.organization_name
                          );
                        })
                        .map((location) => (
                          <CommandItem
                            className="w-full p-2"
                            key={`location-${location.id}`}
                            value={location.organization_name}
                            onSelect={() => handleLocationChange(location)}
                          >
                            <div className="flex items-center w-full">
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedLocation?.organization_name ===
                                    location.organization_name
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {location.organization_name}
                              {location.is_primary && (
                                <Star className="ml-2 h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      <div className="p-1 mt-1">
                        <AddLocation />
                      </div>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col justify-between h-full">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                prefetch={false}
                href={`/dashboard/${selectedLocation?.id || ""}`}
                className={activeLinkClass("/dashboard")}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                prefetch={false}
                href={`/connections/${selectedLocation?.id || ""}`}
                className={activeLinkClass("/connections")}
              >
                <ContainerIcon className="h-4 w-4" />
                Connections
              </Link>
              {/* <Link
                prefetch={false}
                href={`/keywords/${selectedLocation?.id || ""}`}
                className={activeLinkClass("/keywords")}
              >
                <Info className="h-4 w-4" />
                Keywords
              </Link> */}
              <Link
                prefetch={false}
                href={`/employee_mentions/${selectedLocation?.id || ""}`}
                className={activeLinkClass("/employee_mentions")}
              >
                <Contact className="h-4 w-4" />
                Mentioned Employees
              </Link>
              <Link
                prefetch={false}
                href={`/product_feedback/${selectedLocation?.id || ""}`}
                className={activeLinkClass("/product_feedback")}
              >
                <ShoppingBasket className="h-4 w-4" />
                Product Feedback
              </Link>
              <Link
                prefetch={false}
                href={`/funnels/${selectedLocation?.id || ""}`}
                className={activeLinkClass("/funnels")}
              >
                <Star className="h-4 w-4" />
                Funnels
              </Link>
              <Link
                prefetch={false}
                href={`/customers/${selectedLocation?.id || ""}`}
                className={activeLinkClass("/customers")}
              >
                <Users className="h-4 w-4" />
                Customers
              </Link>
              <Link
                prefetch={false}
                href={`/reviews/${selectedLocation?.id || ""}`}
                className={activeLinkClass("/reviews")}
              >
                <BookOpenText className="h-4 w-4" />
                Reviews
              </Link>
              <Link
                prefetch={false}
                href="/billing"
                className={activeLinkClass("/billing")}
              >
                <ShoppingCart className="h-4 w-4" />
                Billing
              </Link>
            </nav>

            <div className="flex items-center justify-start pb-2 px-4">
              <SignOutButton redirectUrl="/sign-in">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-[6px]"
                >
                  <ArrowLeft size={14} className="mt-[1px]" />
                  <p className="leading-7">Signout</p>
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </aside>

      <div>
        <MobileNav />
      </div>
    </div>
  );
}
