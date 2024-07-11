"use client";

import * as React from "react";
import { subDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DateRangePicker({ onDateRangeChange }) {
  const [selectedRange, setSelectedRange] = React.useState("");

  const handleRangeChange = (value) => {
    setSelectedRange(value);
    let startDate, endDate;
    const today = new Date();

    switch (value) {
      case "today":
        startDate = subDays(today, 1);
        endDate = today;
        break;
      case "yesterday":
        startDate = subDays(today, 2);
        endDate = subDays(today, 1);
        break;
      case "7days":
        startDate = subDays(today, 7);
        endDate = today;
        break;
      case "30days":
        startDate = subDays(today, 30);
        endDate = today;
        break;
      case "alltime":
        startDate = null;
        endDate = null;
        break;
      default:
        startDate = null;
        endDate = null;
    }

    if (onDateRangeChange) {
      onDateRangeChange({ startDate, endDate });
    }
  };

  const formatDateDisplay = () => {
    if (selectedRange === "alltime") return "All Time";
    if (!selectedRange) return "Select date range";

    const today = new Date();
    let startDate;

    switch (selectedRange) {
      case "today":
        return format(today, "PPP");
      case "yesterday":
        return format(subDays(today, 1), "PPP");
      case "7days":
        startDate = subDays(today, 7);
        break;
      case "30days":
        startDate = subDays(today, 30);
        break;
      default:
        return "Select date range";
    }

    return `${format(startDate, "PPP")} - ${format(today, "PPP")}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selectedRange && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateDisplay()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 mt-1">
        <Select value={selectedRange} onValueChange={handleRangeChange}>
          <SelectTrigger className="w-[277.5px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="alltime">All Time</SelectItem>
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
}
