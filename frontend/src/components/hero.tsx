"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your Journey to{" "}
              <span className="bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">
                Success
              </span>{" "}
              Starts Here
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Discover personalized learning paths, track your progress, and achieve your goals with our comprehensive roadmap system.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="#features">Learn More</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/20 to-purple-600/20 p-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
              <div className="relative h-full w-full rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center">
                
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
