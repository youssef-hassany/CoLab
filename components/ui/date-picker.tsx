"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700 hover:border-zinc-500",
            !date && "text-zinc-400",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-zinc-900 border-zinc-700"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange?.(selectedDate);
            setOpen(false);
          }}
          initialFocus
          weekStartsOn={1}
          className="bg-zinc-900 text-white"
          classNames={{
            root: "w-fit bg-zinc-900",
            months: "flex gap-4 flex-col md:flex-row relative",
            month: "flex flex-col w-full gap-4",
            nav: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
            button_previous:
              "h-8 w-8 bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700 aria-disabled:opacity-50 p-0 select-none rounded-full",
            button_next:
              "h-8 w-8 bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700 aria-disabled:opacity-50 p-0 select-none rounded-full",
            month_caption: "flex items-center justify-center h-8 w-full px-8",
            dropdowns:
              "w-full flex items-center text-sm font-medium justify-center h-8 gap-1.5",
            dropdown_root:
              "relative has-focus:border-zinc-500 border border-zinc-600 shadow-xs has-focus:ring-zinc-500/50 has-focus:ring-[3px] rounded-md bg-zinc-800",
            dropdown: "absolute bg-zinc-800 inset-0 opacity-0",
            caption_label: "select-none font-medium text-sm text-white",
            table: "w-full border-collapse",
            weekdays: "flex gap-1",
            weekday:
              "text-zinc-400 rounded-md flex-1 font-normal text-[0.8rem] select-none",
            week: "flex w-full mt-2 gap-1",
            day: "relative w-full h-full p-0 text-center group/day aspect-square select-none",
            today:
              "bg-zinc-700 text-white rounded-md data-[selected=true]:rounded-none",
            outside: "text-zinc-600 opacity-50",
            disabled: "text-zinc-500 opacity-30",
            hidden: "invisible",
          }}
          components={{
            DayButton: ({ className, day, modifiers, ...props }) => {
              const ref = React.useRef<HTMLButtonElement>(null);
              React.useEffect(() => {
                if (modifiers.focused) ref.current?.focus();
              }, [modifiers.focused]);

              return (
                <Button
                  ref={ref}
                  variant="ghost"
                  size="icon"
                  data-day={day.date.toLocaleDateString()}
                  data-selected-single={
                    modifiers.selected &&
                    !modifiers.range_start &&
                    !modifiers.range_end &&
                    !modifiers.range_middle
                  }
                  data-range-start={modifiers.range_start}
                  data-range-end={modifiers.range_end}
                  data-range-middle={modifiers.range_middle}
                  className={cn(
                    "data-[selected-single=true]:bg-blue-600 data-[selected-single=true]:text-white data-[range-middle=true]:bg-zinc-700 data-[range-middle=true]:text-white data-[range-start=true]:bg-blue-600 data-[range-start=true]:text-white data-[range-end=true]:bg-blue-600 data-[range-end=true]:text-white group-data-[focused=true]/day:border-zinc-500 group-data-[focused=true]/day:ring-zinc-500/50 hover:text-white flex aspect-square size-auto w-full min-w-8 flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70 bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700",
                    modifiers.outside &&
                      "text-zinc-600 opacity-50 hover:bg-zinc-800 hover:text-zinc-600",
                    className
                  )}
                  {...props}
                />
              );
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
