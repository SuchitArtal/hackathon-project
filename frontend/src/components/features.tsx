"use client"

import { motion } from "framer-motion"
import { BookOpen, Target, Users, Zap } from "lucide-react"

const features = [
  {
    name: "Structured Learning Paths",
    description: "Follow expert-curated roadmaps designed to help you achieve your career goals efficiently.",
    icon: BookOpen,
  },
  {
    name: "Progress Tracking",
    description: "Monitor your learning journey with detailed progress tracking and milestone achievements.",
    icon: Target,
  },
  {
    name: "Community Support",
    description: "Connect with fellow learners, share experiences, and get help when you need it.",
    icon: Users,
  },
  {
    name: "Quick Start",
    description: "Get started in minutes with our intuitive interface and guided onboarding process.",
    icon: Zap,
  },
]

export default function Features() {
  return (
    <section id="features" className="bg-background py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform provides all the tools and resources you need to achieve your learning goals.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl border border-border/40 bg-background/80 p-6 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{feature.name}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
