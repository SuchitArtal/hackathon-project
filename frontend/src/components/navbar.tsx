"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useAuthStore } from '../store/auth'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const setToken = useAuthStore((state: any) => state.setToken)
  const { token, userName } = useAuthStore(); // Get token and userName from useAuthStore

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      console.log("Firebase User in Navbar:", user);
    })
    return () => unsubscribe()
  }, [])

  console.log("Token from Auth Store in Navbar:", token);
  console.log("User Name from Auth Store in Navbar:", userName);

  const handleSignOut = async () => {
    await signOut(auth);
    setToken(null); // Clear the token from auth store
    navigate('/login');
  }

  const isDashboard = location.pathname.startsWith('/dashboard')
  const isDomains = location.pathname.startsWith('/domains')
  const isRoadmap = location.pathname.startsWith('/roadmap')

  const handleSearch = (_e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Implement setDashboardQuery
    // setDashboardQuery(e.target.value)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {(isDashboard || isDomains || isRoadmap) ? (
          <div className="flex items-center space-x-2 cursor-default select-none">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold"
            >
              {/* <span className="bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">జ్ఞಾನ</span>{" "}
              <span>Setu</span> */}
            </motion.div>
          </div>
        ) : (
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold"
            >
              {/* <span className="bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">జ్ఞಾನ</span>{" "}
              <span>Setu</span> */}
            </motion.div>
          </Link>
        )}
        {/* Search bar in navbar only on dashboard */}
        {isDashboard && (
          <div className="flex-1 flex justify-center mx-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search..."
                // value={dashboardQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-purple-600 transition"
                aria-label="Search"
              />
            </div>
          </div>
        )}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <ThemeToggle />
          {(firebaseUser || token) ? (
            <div className="flex items-center space-x-4">
              {userName && ( // Display user initial if userName exists
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-lg font-bold">
                    {userName[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-muted-foreground font-semibold">{userName}</span>
                </div>
              )}
              <Button
                onClick={handleSignOut}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-red-600 hover:to-pink-600 transition"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
        {/* Mobile Menu Button */}
        <button
          className="block md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto border-t border-border/40 px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col space-y-4">
            {/* Features and Roadmaps links removed */}
            <div className="flex items-center space-x-4 pt-2">
              <ThemeToggle />
              {(firebaseUser || token) ? (
                <div className="flex flex-col space-y-2">
                  {userName && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-lg font-bold">
                        {userName[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-muted-foreground font-semibold">{userName}</span>
                    </div>
                  )}
                  <Button
                    onClick={handleSignOut}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-red-600 hover:to-pink-600 transition"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}
