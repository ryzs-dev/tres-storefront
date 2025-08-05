"use client"
import Image from "next/image"

export default function AboutPage() {
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
            <p className="text-neutral-500 text-sm mt-6 max-w-2xl mx-auto">
              A comprehensive brand story showcase demonstrating modern web
              development, authentic storytelling, and user engagement
              strategies - crafted for <strong>TRES</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-600">
              Our Mission
            </h2>
            <p className="text-lg text-neutral-700 mb-6">
              Our mission is to create innovative activewear that solves real
              problems for women of all body types, ages, and backgrounds across
              the globe. We believe that every woman deserves to feel confident,
              comfortable, and empowered in her movement—whether in fitness or
              everyday life.
            </p>
            <p className="text-lg text-neutral-700 mb-6">
              Through thoughtful design, inclusivity, and performance-driven
              apparel, we are redefining activewear to support all women, no
              matter their journey.
            </p>
          </div>
          <div>
            <Image
              src="https://storage.tres.my/Journey/mission.JPG"
              alt="Our Mission"
              className="w-full h-[500px] rounded-lg object-cover object-[30%_20%] shadow-lg"
              width={500}
              height={800}
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-600 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              These core values guide everything we do, from design to community
              building.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold text-slate-600">
                  Inclusivity
                </h3>
              </div>
              <p className="text-neutral-700 text-center">
                We design for all women—regardless of body type, age, or
                background. Our activewear accommodates diverse shapes and
                sizes, ensuring every woman feels represented and valued.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-bold text-slate-600">
                  Quality & Performance
                </h3>
              </div>
              <p className="text-neutral-700 text-center">
                We use high-quality fabrics that adapt to real bodies, offering
                the perfect blend of style, functionality, and performance for
                every movement and lifestyle.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💪</span>
                </div>
                <h3 className="text-xl font-bold text-slate-600">
                  Empowerment
                </h3>
              </div>
              <p className="text-neutral-700 text-center">
                Beyond clothing, we're building a community that celebrates
                strength, confidence, and self-expression. We empower women to
                feel strong, capable, and confident in their own skin.
              </p>
            </div>
          </div>
        </div>

        {/* Founders Section */}
        <div className="mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <Image
                src="https://storage.tres.my/Journey/founder.JPG"
                alt="Founders"
                className="w-full h-auto rounded-lg object-cover object-[30%_20%] shadow-lg"
                width={500}
                height={800}
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6 text-slate-600">
                Meet Our Founders
              </h2>
              <p className="text-lg text-neutral-700 mb-6">
                As founders from different cultures, we came together with a
                shared passion for fitness, fashion, and inclusivity. We saw a
                gap in the market—too many brands catered to only a specific
                size or lifestyle, leaving many women without the comfort,
                support, and confidence they deserve.
              </p>
              <p className="text-lg text-neutral-700">
                Our diverse backgrounds and shared vision drive us to create
                activewear that truly works for every woman, celebrating the
                beauty of our differences while uniting us through movement and
                empowerment.
              </p>
            </div>
          </div>
        </div>

        {/* Meet Our Models Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-600 mb-4">
              Meet the Faces Behind the Moves
            </h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto mb-2">
              Our models are more than just faces—they're real women who train,
              hustle, and live boldly. Each one brings her own story, strength,
              and energy to the pieces she wears.
            </p>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              Get to know the powerful women repping our gear—and why they
              choose to move with us.
            </p>
          </div>

          {/* Lynn - Model 1 */}
          <div className="mb-16">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-neutral-100">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Profile Image Placeholder */}
                <div className="md:col-span-1">
                  <div className="aspect-[3/4] bg-neutral-100 rounded-lg flex items-center justify-center">
                    <Image
                      src="https://storage.tres.my/Journey/lynn.JPG"
                      alt="Maki's Photo"
                      className="w-full h-auto rounded-lg object-cover object-[30%_20%]"
                      width={200}
                      height={300}
                    />
                  </div>
                </div>

                {/* Story Content */}
                <div className="md:col-span-2">
                  <div className="space-y-4 text-neutral-700">
                    <p className="italic">
                      My name is Nuralynn Bt Mohd Shaari, but everyone calls me
                      Lynn. I'm 18 years old and from Penang, Malaysia. I'm
                      currently studying Form 6 at SMJK Heng Ee Hamilton.
                    </p>

                    <p className="italic">
                      I'm someone who loves expressing myself through modeling
                      and fashion. I enjoy being in front of the camera and also
                      capturing creative moments through photography. My
                      favourite sport is synchronized swimming—I actually
                      represented Malaysia and Penang in various national and
                      international competitions.
                    </p>

                    <div className="p-4 bg-slate-50 border-l-4 border-slate-300 rounded-r-lg">
                      <p className="italic text-slate-700">
                        I feel incredibly comfortable and confident when wearing
                        TRES outfits. The inner protective layer makes me feel
                        secure, while the lightweight fabric allows me to move
                        freely and effortlessly. The quality is top-notch and
                        the high-fashion design makes it perfect for both daily
                        wear and stylish moments.
                      </p>
                    </div>

                    <div className="pt-2">
                      <p className="italic font-medium text-slate-600">
                        "To all the incredible women, never dim your light to
                        fit into a smaller space. You are strong, worthy, and
                        capable."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Maki - Model 2 */}
          <div className="mb-16">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-neutral-100">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Profile Image Placeholder */}
                <div className="md:col-span-1 md:order-2">
                  <div className="aspect-[3/4] bg-neutral-100 rounded-lg flex items-center justify-center">
                    {/* <div className="text-center text-neutral-500">
                      <p className="text-sm font-medium">Maki's Photo</p>
                      <p className="text-xs mt-1">45, Japan</p>
                    </div> */}
                    <Image
                      src="https://storage.tres.my/Journey/maki.JPG"
                      alt="Maki's Photo"
                      className="w-full h-auto rounded-lg object-cover object-[30%_20%]"
                      width={200}
                      height={300}
                    />
                  </div>
                </div>

                {/* Story Content */}
                <div className="md:col-span-2 md:order-1">
                  <div className="space-y-4 text-neutral-700">
                    <p className="italic">
                      My name is Maki, and I'm 45 years old and from Japan. I
                      worked as a fashion model in Tokyo and Taiwan, but I
                      stepped away from the industry after giving birth at 30.
                      As I devoted myself to raising my child, I gradually
                      gained 20kg and began to lose sight of who I was.
                    </p>

                    <p className="italic">
                      Everything began to shift when I discovered strength
                      training at 42. In 2022, I proudly took home 1st place in
                      the SSA Tokyo Bikini Model category, and in 2024, I earned
                      1st place in the APF Tokyo Runway Model competition. These
                      wins weren't just trophies—they were reminders of what
                      discipline, self-belief, and hard work can truly build.
                    </p>

                    <p className="italic">
                      Today, I'm drawing from my roots as a model to teach
                      walking and posing—empowering others to move with
                      confidence and grace. I also continue to deepen my
                      practice of yoga, exploring breathwork and meditation to
                      bring harmony to both body and mind.
                    </p>

                    <div className="p-4 bg-slate-50 border-l-4 border-slate-300 rounded-r-lg">
                      <p className="italic text-slate-700">
                        And one thing that supports me in this journey is TRES
                        outfit. The gentle fit that frees my body also releases
                        tension in my heart. TRES is a cherished partner that
                        helps me feel truly like myself.
                      </p>
                    </div>

                    <div className="pt-2">
                      <p className="italic font-medium text-slate-600">
                        "Life can begin again—at any stage. Motherhood, body
                        changes, career pauses...Even after it all, you can find
                        your way back to yourself. A new chapter isn't something
                        you wait for—it's something you create, whenever you're
                        ready."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lyn - Model 3 */}
          <div className="mb-16">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-neutral-100">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Profile Image Placeholder */}
                <div className="md:col-span-1">
                  <div className="aspect-[3/4] bg-neutral-100 rounded-lg flex items-center justify-center">
                    <Image
                      src="https://storage.tres.my/Journey/lyn.JPG"
                      alt="Maki's Photo"
                      className="w-full h-auto rounded-lg object-cover object-[30%_20%]"
                      width={200}
                      height={300}
                    />
                  </div>
                </div>

                {/* Story Content */}
                <div className="md:col-span-2">
                  <div className="space-y-4 text-neutral-700">
                    <p className="italic">
                      Hey there, I'm Lyn! 34 years young and a proud island girl
                      from the one and only Penang!
                    </p>

                    <p className="italic">
                      By day, I'm a gazetting Family Medicine Specialist. By
                      heart, I'm the founder of SelflessTogether, an
                      organisation that provides free education to refugee and
                      stateless children right here in Penang. I've always
                      believed in standing up for the voiceless, lifting up the
                      helpless, and making sure no one gets left behind.
                    </p>

                    <p className="italic">
                      When I'm not in clinic or running community projects,
                      you'll probably catch me sweating it out on a spin bike,
                      running, or throwing weights around. That's my kind of
                      therapy!
                    </p>

                    <div className="p-4 bg-slate-50 border-l-4 border-slate-300 rounded-r-lg">
                      <p className="italic text-slate-700">
                        Oh, yes I'm obsessed with TRES' outfits. Their outfits
                        don't just look good, they feel incredible. Perfect for
                        my chaotic, on-the-go, sweat-soaked lifestyle.
                      </p>
                    </div>

                    <div className="pt-2">
                      <p className="italic font-medium text-slate-600">
                        There's this quote from Michelle Obama that has stuck
                        with me: "There's no limit to what we as women can
                        accomplish". It reminds me that women are powerful,
                        resilient, and so beautifully capable of creating
                        change, not just for ourselves, but for the people
                        around us too.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="mb-20 bg-slate-50 p-12 rounded-xl">
          <blockquote className="text-2xl font-light italic text-center text-neutral-800">
            "Our journey began with a simple but powerful idea: activewear
            should work for all women—regardless of body type, age, or
            background."
          </blockquote>
        </div>

        {/* Community Banner */}
        <div className="text-center bg-gradient-to-r from-slate-600 to-slate-700 text-white p-12 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
          <p className="mb-8 text-lg max-w-2xl mx-auto opacity-90">
            More than just a brand, we are a community—empowering women
            worldwide to feel strong, capable, and confident in their own skin.
          </p>
          <button className="bg-white text-slate-600 px-8 py-3 rounded-full font-medium hover:bg-neutral-100 transition-colors">
            Join the Movement
          </button>
        </div>
      </div>
    </div>
  )
}
