"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/dist/style.css"; // Usa los estilos por defecto y los pisaremos con CSS
import { es } from "date-fns/locale";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <div className="p-4 bg-[#131720] rounded-3xl border border-white/10 shadow-2xl">
            <DayPicker
                locale={es}
                showOutsideDays={showOutsideDays}
                className={className}
                classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md border border-white/10 hover:bg-white/5",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-white/5 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal hover:bg-white/10 rounded-md aria-selected:opacity-100 transition-colors",
                    day_selected:
                        "bg-[var(--electric-blue)] text-white hover:bg-[var(--metallic-blue)] focus:bg-[var(--electric-blue)] font-bold",
                    day_today: "border border-[var(--electric-blue)] text-white",
                    day_outside: "text-gray-600 opacity-50",
                    day_disabled: "text-gray-600 opacity-50 cursor-not-allowed",
                    day_range_middle:
                        "aria-selected:bg-[var(--electric-blue)]/20 aria-selected:text-white rounded-none",
                    day_range_start: "rounded-l-md",
                    day_range_end: "rounded-r-md",
                    day_hidden: "invisible",
                    ...classNames,
                }}
                components={{
                    Chevron: ({ orientation, ...props }) => {
                        const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
                        return <Icon className="h-4 w-4" {...props} />;
                    },
                }}
                {...props}
            />
        </div>
    );
}
