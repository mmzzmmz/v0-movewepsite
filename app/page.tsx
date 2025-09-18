"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchBar } from "@/components/search-bar"
import {
  Bars3Icon,
  AdjustmentsHorizontalIcon,
  PlayIcon,
  BookmarkIcon,
  PlusIcon,
  ShareIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline"
import { PlayIcon as PlayIconSolid } from "@heroicons/react/24/solid"

interface Movie {
  id: number
  original_title: string
  poster_path: string
  release_date: string
  popularity: number
  vote_average: number
  vote_count: number
  overview: string
  original_language: string
}

interface MovieDetails {
  genres: { id: number; name: string }[]
}

const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGNkNzE0NzM0ZmFhNjI4MzViNTFkYWY2ZTc4YjFkNCIsIm5iZiI6MTc1NjI5MDYxMi4xMzkwMDAyLCJzdWIiOiI2OGFlZGUzNDY5NDJmMTdhOWIzZDhhNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HEvvFu1cWbtbV__4HPN8rwvZa591F7wobIHmWxr2yS4"
const BASE_IMG_URL = "https://image.tmdb.org/t/p/original"

export default function MoviesApp() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState({ language: "all", media: "all" })
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [currentView, setCurrentView] = useState<"new" | "popular">("new")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchMovies()
  }, [currentView])

  useEffect(() => {
    let filtered = movies

    if (searchQuery.trim()) {
      filtered = filtered.filter((movie) => movie.original_title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredMovies(filtered)
  }, [movies, searchQuery])

  const fetchMovies = async () => {
    setLoading(true)
    try {
      const endpoint =
        currentView === "new"
          ? "https://api.themoviedb.org/3/movie/now_playing"
          : "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"

      const response = await fetch(endpoint, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      })
      const data = await response.json()
      setMovies(data.results || [])
    } catch (error) {
      console.error("Error fetching movies:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      })
      const data = await response.json()
      setMovieDetails(data)
    } catch (error) {
      console.error("Error fetching movie details:", error)
    }
  }

  const handleMovieClick = async (movie: Movie) => {
    setSelectedMovie(movie)
    await fetchMovieDetails(movie.id)
    setShowDetails(true)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      scale: 1.05,
      rotateY: 10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  }

  const detailsVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 100,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 100,
      transition: {
        duration: 0.3,
      },
    },
  }

  if (showDetails && selectedMovie) {
    return (
      <AnimatePresence>
        <motion.div
          className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background relative overflow-hidden theme-transition"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${BASE_IMG_URL}${selectedMovie.poster_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={detailsVariants}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full"
                animate={{
                  x: [0, Math.random() * 100, 0],
                  y: [0, Math.random() * 100, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col lg:flex-row items-center gap-8">
            <motion.div
              className="flex-1 text-foreground space-y-6"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {selectedMovie.original_title}
              </motion.h1>

              <motion.div
                className="flex flex-wrap gap-4 items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Badge variant="secondary" className="bg-primary/80 text-primary-foreground px-3 py-1">
                  Sub | Dub
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-xl">★</span>
                  <span className="text-lg font-semibold">{selectedMovie.vote_average.toFixed(1)}</span>
                  <span className="text-muted-foreground">({selectedMovie.vote_count.toLocaleString()})</span>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <PlayIconSolid className="w-5 h-5 mr-2" />
                  Start Watching
                </Button>

                {[BookmarkIcon, PlusIcon, ShareIcon, EllipsisVerticalIcon].map((Icon, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-primary/50 text-primary hover:bg-primary/20 hover:border-primary rounded-full p-3 bg-card/50 backdrop-blur-sm transition-all duration-300"
                    >
                      <Icon className="w-5 h-5" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                  className="border-primary/50 text-primary hover:bg-primary/20 hover:border-primary mt-6 bg-card/50 backdrop-blur-sm transition-all duration-300"
                >
                  ← Back to Movies
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background theme-transition">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <motion.h1
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              {currentView === "new" ? "New Added Movies" : "Popular Movies"}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-3">
              <SearchBar onSearch={handleSearch} placeholder="Search movies..." className="w-full sm:w-64" />

              <ThemeToggle />

              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="border-primary/40 text-primary hover:bg-primary/20 hover:border-primary bg-card/60 backdrop-blur-sm transition-all duration-300"
                >
                  <Bars3Icon className="w-4 h-4 mr-2" />
                  {sortBy === "newest" ? "Newest" : sortBy === "popularity" ? "Popularity" : "Alphabetical"}
                </Button>

                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      className="absolute top-full mt-2 right-0 bg-card/90 backdrop-blur-md border border-border rounded-lg p-2 min-w-[150px] z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {["newest", "popularity", "alphabetical"].map((option) => (
                        <button
                          key={option}
                          className={`w-full text-left px-3 py-2 rounded hover:bg-primary/20 transition-colors ${
                            sortBy === option ? "bg-primary/30 text-primary" : "text-foreground"
                          }`}
                          onClick={() => {
                            setSortBy(option)
                            setShowSortMenu(false)
                          }}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="border-primary/40 text-primary hover:bg-primary/20 hover:border-primary bg-card/60 backdrop-blur-sm transition-all duration-300"
                >
                  <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
                  Filter
                </Button>

                <AnimatePresence>
                  {showFilterMenu && (
                    <motion.div
                      className="absolute top-full mt-2 right-0 sm:right-0 left-0 sm:left-auto bg-card/90 backdrop-blur-md border border-border rounded-lg p-4 min-w-[200px] max-w-[280px] z-50 mx-2 sm:mx-0"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-foreground font-semibold mb-2">Language</h4>
                          {["all", "subtitled", "dubbed"].map((lang) => (
                            <label
                              key={lang}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer py-1"
                            >
                              <input
                                type="radio"
                                name="language"
                                value={lang}
                                checked={filterBy.language === lang}
                                onChange={(e) => setFilterBy((prev) => ({ ...prev, language: e.target.value }))}
                                className="text-primary"
                              />
                              {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </label>
                          ))}
                        </div>
                        <div>
                          <h4 className="text-foreground font-semibold mb-2">Media</h4>
                          {["all", "series", "movies"].map((media) => (
                            <label
                              key={media}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer py-1"
                            >
                              <input
                                type="radio"
                                name="media"
                                value={media}
                                checked={filterBy.media === media}
                                onChange={(e) => setFilterBy((prev) => ({ ...prev, media: e.target.value }))}
                                className="text-primary"
                              />
                              {media.charAt(0).toUpperCase() + media.slice(1)}
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={currentView === "new" ? "default" : "outline"}
                  onClick={() => setCurrentView("new")}
                  className={
                    currentView === "new"
                      ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg transition-all duration-300"
                      : "border-primary/40 text-primary hover:bg-primary/20 hover:border-primary bg-card/60 backdrop-blur-sm transition-all duration-300"
                  }
                >
                  New
                </Button>
                <Button
                  variant={currentView === "popular" ? "default" : "outline"}
                  onClick={() => setCurrentView("popular")}
                  className={
                    currentView === "popular"
                      ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg transition-all duration-300"
                      : "border-primary/40 text-primary hover:bg-primary/20 hover:border-primary bg-card/60 backdrop-blur-sm transition-all duration-300"
                  }
                >
                  Popular
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Movies Grid */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <motion.div
              className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mobile-cards-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                variants={cardVariants}
                whileHover="hover"
                className="group cursor-pointer mobile-card"
                onClick={() => handleMovieClick(movie)}
              >
                <Card className="bg-card/40 border-border overflow-hidden backdrop-blur-sm hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <motion.img
                      src={`${BASE_IMG_URL}${movie.poster_path}`}
                      alt={movie.original_title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-yellow-400 flex items-center gap-1">
                            ★ {movie.vote_average.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-300">{movie.release_date.split("-")[0]}</span>
                        </div>
                        <p className="text-xs text-gray-300 line-clamp-3 mb-3">{movie.overview}</p>
                        <motion.div
                          className="flex justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <PlayIcon className="w-4 h-4 mr-1" />
                            Play
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  <CardContent className="p-4 card-content">
                    <h3 className="text-foreground font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors card-title">
                      {movie.original_title}
                    </h3>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{movie.release_date}</span>
                      <span className="text-primary">★ {movie.vote_average.toFixed(1)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredMovies.length === 0 && searchQuery && (
          <motion.div className="text-center py-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-xl font-semibold text-foreground mb-2">No movies found</h3>
            <p className="text-muted-foreground">Try searching with different keywords</p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
