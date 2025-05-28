"use client"
import { useState } from "react"
import { Users } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("mission")

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-6">
              Our <span className="text-slate-600">Journey</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-neutral-700">
              Born from passion. Built for every woman. A movement that
              celebrates strength, confidence, and inclusivity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Tabs */}
        <div className="flex justify-center mb-12 border-b border-neutral-200">
          <button
            onClick={() => setActiveSection("mission")}
            className={`px-6 py-3 font-medium ${
              activeSection === "mission"
                ? "text-slate-600 border-b-2 border-slate-600"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Our Mission
          </button>
          <button
            onClick={() => setActiveSection("values")}
            className={`px-6 py-3 font-medium ${
              activeSection === "values"
                ? "text-slate-600 border-b-2 border-slate-600"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Our Values
          </button>
          <button
            onClick={() => setActiveSection("founders")}
            className={`px-6 py-3 font-medium ${
              activeSection === "founders"
                ? "text-slate-600 border-b-2 border-slate-600"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Our Founders
          </button>
        </div>

        {/* Mission Content */}
        {activeSection === "mission" && (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-neutral-700 mb-6">
                Our mission is to create innovative activewear that solves real
                problems for women of all body types, ages, and backgrounds
                across the globe. We believe that every woman deserves to feel
                confident, comfortable, and empowered in her movement—whether in
                fitness or everyday life.
              </p>
              <p className="text-lg text-neutral-700 mb-6">
                Through thoughtful design, inclusivity, and performance-driven
                apparel, we are redefining activewear to support all women, no
                matter their journey.
              </p>
            </div>
            <div>
              <Image
                src="https://zhwxnlspudiutanxvunp.supabase.co/storage/v1/object/public/tres-assets/Journey/mission.JPG"
                alt="Our Mission"
                className="w-full h-auto rounded-lg object-cover"
                width={500}
                height={500}
              />
            </div>
          </div>
        )}

        {/* Values Content */}
        {activeSection === "values" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-100">
              <h3 className="text-xl font-bold mb-4 text-slate-600">
                Inclusivity
              </h3>
              <p className="text-neutral-700">
                We design for all women—regardless of body type, age, or
                background. Our activewear accommodates diverse shapes and
                sizes, ensuring every woman feels represented and valued.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-100">
              <h3 className="text-xl font-bold mb-4 text-slate-600">
                Quality & Performance
              </h3>
              <p className="text-neutral-700">
                We use high-quality fabrics that adapt to real bodies, offering
                the perfect blend of style, functionality, and performance for
                every movement and lifestyle.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-100">
              <h3 className="text-xl font-bold mb-4 text-slate-600">
                Empowerment
              </h3>
              <p className="text-neutral-700">
                Beyond clothing, we're building a community that celebrates
                strength, confidence, and self-expression. We empower women to
                feel strong, capable, and confident in their own skin.
              </p>
            </div>
          </div>
        )}

        {/* Founders Content */}
        {activeSection === "founders" && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Meet Our Founders</h2>
              <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
                As founders from different cultures, we came together with a
                shared passion for fitness, fashion, and inclusivity. We saw a
                gap in the market—too many brands catered to only a specific
                size or lifestyle, leaving many women without the comfort,
                support, and confidence they deserve.
              </p>
            </div>
            <div className="mt-12 flex justify-center">
              <Image
                src="https://zhwxnlspudiutanxvunp.supabase.co/storage/v1/object/public/tres-assets/Journey/founder.JPG"
                alt="Founders"
                className="w-[400px] h-[500px] rounded-lg object-cover"
                width={500}
                height={500}
              />
            </div>
          </div>
        )}

        {/* Quote Section */}
        <div className="my-20 bg-slate-50 p-12 rounded-xl">
          <blockquote className="text-2xl font-light italic text-center text-neutral-800">
            "Our journey began with a simple but powerful idea: activewear
            should work for all women—regardless of body type, age, or
            background."
          </blockquote>
        </div>

        {/* Community Banner */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
          <p className="mb-8 text-lg text-neutral-700 max-w-2xl mx-auto">
            More than just a brand, we are a community—empowering women
            worldwide to feel strong, capable, and confident in their own skin.
          </p>
          <button className="bg-slate-600 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-700 transition-colors">
            Join the Movement
          </button>
        </div>
      </div>
    </div>
  )
}
