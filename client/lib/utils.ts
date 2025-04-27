"use client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { useEffect, useState } from "react"

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
