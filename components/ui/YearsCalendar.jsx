"use client";

import { useState, useEffect } from "react";
import { getCalendarDataByDay } from "@/utils/reviews";
import { SkeletonCard } from "@/components/ui/Misc/SkeletonCard";

const is_leap_year = (year) => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

const days_in_month = (year, month) => {
  const days = [
    31,
    is_leap_year(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return days[month];
};

const getMonthName = (month) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month];
};

const getDayName = (day) => {
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return dayNames[day];
};

const renderMonth = (year, month, calendarData, setHoverDate) => {
  const days = days_in_month(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const weeks = Math.ceil((days + firstDay) / 7);
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return (
    <div
      key={`${year}-${month}`}
      className="border border-gray-200 p-2 rounded-lg"
    >
      <h3 className="text-sm font-semibold mb-1 text-center">
        {getMonthName(month)} {year}
      </h3>
      <div className="grid grid-cols-7 gap-[1px]">
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={`day-name-${i}`}
            className="text-xs font-medium text-center text-gray-500"
          >
            {getDayName(i)}
          </div>
        ))}

        {Array.from({ length: weeks * 7 }, (_, i) => {
          const day = i - firstDay + 1;
          const isValidDay = day > 0 && day <= days;
          const isFutureDate =
            year > currentYear ||
            (year === currentYear && month > currentMonth) ||
            (year === currentYear &&
              month === currentMonth &&
              day > today.getDate());

          const formattedDate = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          const dayData = calendarData.find((d) => d.date === formattedDate);

          let bgColor = "bg-white"; // Default for non-date cells

          if (isValidDay) {
            if (isFutureDate) {
              bgColor = "bg-gray-100";
            } else if (dayData) {
              // Determine color based on average rating
              if (dayData.avgRating > 4.5) bgColor = "bg-green-500";
              else if (dayData.avgRating > 3.5) bgColor = "bg-yellow-500";
              else if (dayData.avgRating > 2.5) bgColor = "bg-orange-500";
              else if (dayData.avgRating <= 2.5) bgColor = "bg-red-500";
              else bgColor = "bg-gray-300";
            } else {
              bgColor = "bg-gray-200";
            }
          }

          return (
            <div
              key={`day-${year}-${month}-${i}`}
              className={`w-full aspect-square relative ${bgColor} border border-gray-100`}
              onMouseEnter={() =>
                isValidDay && dayData && setHoverDate(dayData)
              }
              onMouseLeave={() => setHoverDate(null)}
            >
              {isValidDay && isFutureDate && (
                <div
                  className="absolute inset-0 bg-white"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                    borderTop: "1px solid #e5e7eb",
                    borderRight: "1px solid #e5e7eb",
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const renderYear = (year, calendarData, setHoverDate) => {
  return (
    <div className="grid grid-rows-2 gap-1">
      <div className="grid grid-cols-6 gap-1">
        {Array.from({ length: 6 }, (_, i) =>
          renderMonth(year, i, calendarData, setHoverDate)
        )}
      </div>
      <div className="grid grid-cols-6 gap-1">
        {Array.from({ length: 6 }, (_, i) =>
          renderMonth(year, i + 6, calendarData, setHoverDate)
        )}
      </div>
    </div>
  );
};

export function YearsCalendar({ selectedLocation }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [calendarData, setCalendarData] = useState([]);
  const [hoverDate, setHoverDate] = useState(null);
  const [firstReviewYear, setFirstReviewYear] = useState(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      setIsLoading(true);
      const result = await getCalendarDataByDay(selectedLocation.id);
      if (result.success) {
        setCalendarData(result.data);
        const firstYear = new Date(result.data[0].date).getFullYear();
        setFirstReviewYear(firstYear);
        setYear(Math.max(year, firstYear));
      } else {
        console.error(result.error);
      }
      setIsLoading(false);
    };

    fetchCalendarData();
  }, [selectedLocation.id]);

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="max-w-full mt-6">
      <h2 className="text-2xl font-bold mb-4">Sentiment by Day</h2>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setYear(Math.max(year - 1, firstReviewYear))}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={year <= firstReviewYear}
        >
          Previous Year
        </button>
        <span className="text-xl font-semibold">{year}</span>
        <button
          onClick={() => setYear(Math.min(year + 1, new Date().getFullYear()))}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={year >= new Date().getFullYear()}
        >
          Next Year
        </button>
      </div>

      {renderYear(year, calendarData, setHoverDate)}

      {hoverDate && (
        <div className="mt-2 text-sm">
          <p>Date: {hoverDate.date}</p>
          <p>Total Reviews: {hoverDate.nCount}</p>
          <p>Average Rating: {hoverDate.avgRating}</p>
          <p>
            Positive: {hoverDate.nPositive} | Negative: {hoverDate.nNegative} |
            Mixed: {hoverDate.nMixed}
          </p>
          <p>Response Rate: {hoverDate.responseRate}%</p>
          <p>
            Sources: Google - {hoverDate.sources.google}, Yelp -{" "}
            {hoverDate.sources.yelp}
          </p>
        </div>
      )}
    </div>
  );
}
