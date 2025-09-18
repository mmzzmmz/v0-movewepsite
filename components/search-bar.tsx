"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ onSearch, placeholder = "Search movies...", className }: SearchBarProps) {
  const [query, setQuery] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`pl-10 pr-10 search-input bg-background/60 backdrop-blur-sm border-purple-500/40 focus:border-purple-500 transition-all duration-300 ${
            isFocused ? "ring-2 ring-purple-500/20" : ""
          }`}
        />
        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Button variant="ghost" size="sm" onClick={clearSearch} className="h-6 w-6 p-0 hover:bg-destructive/20">
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 -z-10 blur-sm"
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
