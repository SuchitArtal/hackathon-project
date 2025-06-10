"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const roadmaps = [
  {
    title: "Web Development",
    description: "Master modern web development from basics to advanced concepts.",
    level: "Beginner to Advanced",
    duration: "6-12 months",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Data Science",
    description: "Learn data analysis, machine learning, and statistical methods.",
    level: "Intermediate",
    duration: "8-12 months",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Mobile Development",
    description: "Build native and cross-platform mobile applications.",
    level: "Beginner to Advanced",
    duration: "6-10 months",
    color: "from-green-500 to-emerald-500",
  },
]

export default function RoadmapShowcase() {
  return (
    <section id="roadmaps" className="bg-background py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explore Our Learning Roadmaps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose from our carefully curated learning paths designed to help you achieve your career goals.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap, index) => (
            <motion.div
              key={roadmap.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/80 p-6 shadow-sm backdrop-blur-sm"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${roadmap.color} opacity-0 transition-opacity group-hover:opacity-10`} />
              <h3 className="text-xl font-semibold text-foreground">{roadmap.title}</h3>
              <p className="mt-2 text-muted-foreground">{roadmap.description}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{roadmap.level}</span>
                <span>•</span>
                <span>{roadmap.duration}</span>
              </div>
              <Button className="mt-6 w-full" variant="outline" asChild>
                <Link to={`/roadmaps/${roadmap.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  View Roadmap
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link to="/roadmaps">View All Roadmaps</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
