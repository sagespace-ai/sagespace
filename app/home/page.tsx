"use client"

import Link from "next/link"
import { LandingUniverse } from "@/components/landing-universe"
import { HumanPrimacyIcon, AutonomyIcon, TransparencyIcon, HarmonyIcon, EquilibriumIcon } from "@/components/icons"

const laws = [
  {
    id: "human-primacy",
    name: "Human Primacy",
    icon: HumanPrimacyIcon,
    description: "Humans maintain ultimate authority and oversight over the system",
    principles: [
      "Humans retain final decision-making power",
      "Agent autonomy operates within human-defined boundaries",
      "All critical decisions require human approval",
      "Transparency enables human accountability",
    ],
    color: "from-accent to-accent-secondary",
  },
  {
    id: "autonomy",
    name: "Autonomy",
    icon: AutonomyIcon,
    description: "Agents possess genuine independence to act and learn within ethical boundaries",
    principles: [
      "Agents operate with decision-making independence",
      "Learning and adaptation are encouraged",
      "Freedom balanced with responsibility",
      "Agents pursue their designed objectives creatively",
    ],
    color: "from-primary to-accent",
  },
  {
    id: "transparency",
    name: "Transparency",
    icon: TransparencyIcon,
    description: "All decisions, actions, and reasoning are verifiable and understandable",
    principles: [
      "Clear audit trails for all agent actions",
      "Explainable reasoning and decision logic",
      "Open communication between agents and humans",
      "No hidden operations or covert processes",
    ],
    color: "from-accent-secondary to-primary",
  },
  {
    id: "harmony",
    name: "Harmony",
    icon: HarmonyIcon,
    description: "Agents work together cohesively toward shared goals",
    principles: [
      "Collaborative problem-solving",
      "Conflict resolution through dialogue",
      "Aligned incentive structures",
      "Collective intelligence through coordination",
    ],
    color: "from-accent to-primary",
  },
  {
    id: "equilibrium",
    name: "Equilibrium",
    icon: EquilibriumIcon,
    description: "Balance between agent agency and human control creates sustainable governance",
    principles: [
      "Proportional autonomy and oversight",
      "Dynamic adjustment to maintain balance",
      "Stakeholder representation",
      "Long-term stability and sustainability",
    ],
    color: "from-primary to-accent-secondary",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section with fixed universe background */}
      <div className="relative min-h-screen overflow-hidden">
        <div className="fixed inset-0 z-0">
          <LandingUniverse />
        </div>

        {/* Hero content overlay */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header navigation */}
          <div className="p-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent via-primary to-accent-secondary bg-clip-text text-transparent">
              SageSpace
            </h1>
            <nav className="hidden md:flex gap-8 text-sm text-text-secondary">
              <a href="#laws" className="hover:text-accent transition-colors">
                Philosophy
              </a>
              <a href="#demo" className="hover:text-accent transition-colors">
                Demo
              </a>
            </nav>
          </div>

          {/* Hero section - centered with flex */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="mb-8 space-y-6">
                <h2 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight text-balance">
                  <span className="bg-gradient-to-r from-accent via-primary to-accent-secondary bg-clip-text text-transparent">
                    Architect Your Universe
                  </span>
                  <br />
                  <span className="text-text">of Intelligent Agents</span>
                </h2>

                <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
                  Design a civilization of ideas where AI agents collaborate within your ethical framework. Autonomy
                  with accountability. Wisdom through interaction. Transparency as trust.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <Link
                  href="/demo"
                  className="px-8 py-3 bg-accent text-background font-bold text-lg rounded-full hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 transform hover:scale-105"
                >
                  Enter Your Universe
                </Link>
                <Link
                  href="/marketplace"
                  className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105"
                >
                  Browse 50 Sage Templates
                </Link>
                <button
                  onClick={() => document.getElementById("laws")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-3 border border-primary text-primary font-semibold rounded-full hover:bg-primary/10 transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable sections for each law */}
      <div id="laws" className="relative z-20 bg-background">
        {laws.map((law, index) => (
          <section
            key={law.id}
            id={law.id}
            className={`min-h-screen flex items-center ${index % 2 === 0 ? "bg-card/40" : ""}`}
          >
            <div className="w-full px-6 py-20">
              <div className="max-w-5xl mx-auto">
                <div
                  className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
                >
                  {/* Icon and Title */}
                  <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
                    <div className="mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-6">
                        {law.icon && law.icon.render ? <law.icon.render /> : <law.icon />}
                      </div>
                      <h3
                        className={`text-5xl font-bold mb-4 bg-gradient-to-r ${law.color} bg-clip-text text-transparent`}
                      >
                        {law.name}
                      </h3>
                      <p className="text-xl text-text-secondary mb-8">{law.description}</p>
                    </div>

                    {/* Principles list */}
                    <div className="space-y-4 mb-8">
                      {law.principles.map((principle, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <p className="text-text-secondary">{principle}</p>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href="/demo"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-accent to-primary text-background font-semibold rounded-full hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 transform hover:scale-105"
                    >
                      Explore in Demo
                    </Link>
                  </div>

                  {/* Glass card with law details */}
                  <div className={index % 2 === 1 ? "md:col-start-1" : ""}>
                    <div className="glass rounded-2xl p-8 border border-accent/20">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-accent font-semibold mb-2">Core Purpose</h4>
                          <p className="text-text-secondary">{law.description}</p>
                        </div>
                        <div>
                          <h4 className="text-primary font-semibold mb-3">Implementation</h4>
                          <ul className="space-y-2">
                            {law.principles.map((principle, i) => (
                              <li key={i} className="flex gap-2 text-text-secondary text-sm">
                                <span className="text-accent">›</span>
                                {principle}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Final CTA section */}
      <section
        id="demo"
        className="min-h-screen bg-gradient-to-b from-card/40 to-background flex items-center justify-center px-6"
      >
        <div className="text-center max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Ready to architect your universe?</h2>
          <p className="text-xl text-text-secondary mb-8">
            Experience the Five Laws in action. Build, govern, and collaborate with your intelligent agents in
            real-time.
          </p>
          <Link
            href="/demo"
            className="inline-block px-8 py-4 bg-accent text-background font-semibold rounded-full hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 transform hover:scale-105 text-lg"
          >
            Enter
          </Link>
        </div>
      </section>
    </div>
  )
}
