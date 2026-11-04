"use client"

import * as React from "react"
import { cn } from "cn"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { ChevronDown } from "lucide-react"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-zinc-800/80", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex min-h-14 flex-1 cursor-pointer items-center justify-between gap-4 py-4 text-left text-base font-medium text-[#F4F4F4] transition-colors hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0d0e]",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="size-4 shrink-0 text-zinc-400 transition-transform duration-200 ease-out-strong group-data-[state=open]:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-accordion-close data-[state=open]:animate-accordion-open motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-fade-in-quick"
      {...props}
    >
      <div className={cn("pb-5 text-base leading-relaxed text-zinc-400", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
