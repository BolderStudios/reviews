"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { MobileNav } from "@/components/ui/mobile-nav";
import {
  Home,
  ShoppingCart,
  Check,
  ChevronsUpDown,
  Star,
  ContainerIcon,
  BookOpenText,
  Contact,
  ShoppingBasket,
  Users,
  ArrowLeft,
  Loader,
  Text,
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
import { AddLocation } from "@/components/ui/Locations/AddLocation";
import { updateSelectedLocation } from "@/app/actions";
import { toast } from "sonner";
import { SignOutButton } from "@clerk/nextjs";

export default function SidebarNavigation({
  passedLocations = [],
  passedSelectedLocation = null,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const lastKnownLocationIdRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname();
  const currentPathname = pathname.split("/")[1];

  useEffect(() => {
    // console.log("Current pathname:", pathname);
    // console.log("Selected location:", passedSelectedLocation);

    // Extract location ID from URL if available
    const pathParts = pathname.split("/");
    if (pathParts.length > 2) {
      lastKnownLocationIdRef.current = pathParts[2];
    }

    if (passedSelectedLocation) {
      lastKnownLocationIdRef.current = passedSelectedLocation.id;

      setIsLoading(false);
    } else if (passedLocations.length > 0) {
      // If locations are loaded but no selection, assume first location
      lastKnownLocationIdRef.current = passedLocations[0].id;

      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    setIsNavigating(false);
  }, [pathname, passedSelectedLocation, passedLocations]);

  const handleLocationChange = useCallback(
    async (location) => {
      setOpen(false);
      setIsNavigating(true);

      if (currentPathname !== "billing") {
        try {
          // console.log("Updating location to:", location);
          const data = await updateSelectedLocation(location, currentPathname);

          if (data.success) {
            // console.log("Location update successful, new path:", data.newPath);
            lastKnownLocationIdRef.current = location.id;

            router.push(data.newPath);
            toast.success("Location updated successfully");
          } else {
            console.error("Failed to update location:", data);
            toast.error("Failed to update location");
          }
        } catch (error) {
          console.error("Error updating location:", error);
          toast.error("An error occurred while updating location");
        } finally {
          setIsNavigating(false);
        }
      }
    },
    [currentPathname, router]
  );

  const activeLinkClass = useCallback(
    (href) =>
      `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${currentPathname === href.split("/")[1]
        ? "bg-muted text-primary"
        : "text-muted-foreground"
      } group`,
    [currentPathname]
  );

  const sortedLocations = useMemo(
    () =>
      [...passedLocations].sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return a.organization_name.localeCompare(b.organization_name);
      }),
    [passedLocations]
  );

  const navigationLinks = useMemo(
    () => [
      {
        href: "dashboard",
        icon: Home,
        label: "Dashboard",
        hasLocationId: true,
      },
      {
        href: "connections",
        icon: ContainerIcon,
        label: "Connections",
        hasLocationId: true,
      },
      {
        href: "employee_mentions",
        icon: Contact,
        label: "Mentioned Employees",
        hasLocationId: true,
      },
      {
        href: "product_feedback",
        icon: ShoppingBasket,
        label: "Product Feedback",
        hasLocationId: true,
      },
      { href: "web-forms", icon: Text, label: "Forms", hasLocationId: true },
      {
        href: "customers",
        icon: Users,
        label: "Customers",
        hasLocationId: true,
      },
      {
        href: "reviews",
        icon: BookOpenText,
        label: "Reviews",
        hasLocationId: true,
      },
      {
        href: "billing",
        icon: ShoppingCart,
        label: "Billing",
        hasLocationId: false,
      },
    ],
    []
  );

  const getLocationId = useCallback(() => {
    return passedSelectedLocation?.id || lastKnownLocationIdRef.current;
  }, [passedSelectedLocation]);

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
                  className="w-full"
                  disabled={isNavigating || isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </span>
                  ) : passedSelectedLocation ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="flex-1 truncate mr-2">
                        {passedSelectedLocation.organization_name}
                      </span>
                      {passedSelectedLocation.is_primary && (
                        <Star className="flex-shrink-0 h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  ) : (
                    <span>Select a location</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[247px] p-0">
                <Command>
                  <CommandList className="w-full">
                    <CommandGroup className="w-full p-0">
                      <div className="w-full px-4 py-2 border-b mb-1">
                        <span className="text-sm text-muted-foreground">
                          Locations ({sortedLocations.length})
                        </span>
                      </div>
                      {sortedLocations.map((location) => (
                        <CommandItem
                          className="w-full p-2"
                          key={`location-${location.id}`}
                          value={location.organization_name}
                          onSelect={() => handleLocationChange(location)}
                          disabled={isNavigating}
                        >
                          <div className="flex items-center w-full">
                            <Check
                              className={cn(
                                "flex-shrink-0 mr-2 h-4 w-4",
                                passedSelectedLocation?.organization_name ===
                                  location.organization_name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <span className="flex-1 truncate mr-2">
                              {location.organization_name}
                            </span>
                            {location.is_primary && (
                              <Star className="flex-shrink-0 h-4 w-4 text-yellow-500" />
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
              {navigationLinks.map(
                ({ href, icon: Icon, label, hasLocationId }) => {
                  const locationId = getLocationId();
                  const fullHref =
                    hasLocationId && locationId
                      ? `/${href}/${locationId}`
                      : `/${href}`;

                  return (
                    <Link
                      key={href}
                      prefetch={false}
                      href={fullHref}
                      className={cn(
                        activeLinkClass(`/${href}`),
                        currentPathname === href ? "pointer-events-none" : isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"
                      )}
                      onClick={(e) => {
                        if (isNavigating || isLoading) {
                          e.preventDefault();
                        } else {
                          setIsNavigating(true);
                          // console.log(`Navigating to: ${fullHref}`);
                        }
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  );
                }
              )}
            </nav>

            <div className="flex items-center justify-start pb-2 px-4">
              <SignOutButton redirectUrl="/sign-in">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-[6px]"
                  disabled={isNavigating || isLoading}
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
