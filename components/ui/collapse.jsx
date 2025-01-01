"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Collapse = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("collapse collapse-plus bg-base-100", className)}
      {...props}
    >
      {children}
    </div>
  )
})
Collapse.displayName = "Collapse"

const CollapseTitle = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("collapse-title text-xl font-medium", className)}
      {...props}
    >
      {children}
    </div>
  )
})
CollapseTitle.displayName = "CollapseTitle"

const CollapseContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("collapse-content", className)}
      {...props}
    >
      {children}
    </div>
  )
})
CollapseContent.displayName = "CollapseContent"

export { Collapse, CollapseTitle, CollapseContent }
