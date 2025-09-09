// FILE: src/app/about/page.tsx

"use client"; // Add this directive at the very top

import Link from 'next/link';

export default function AboutUsPage() {
  // Team members data - Replace with your actual team information
  const teamMembers = [
    {
      id: 1,
      name: "Bisseck Handt Caroline",
      role: "Scrum Master",
      description: "Catalyzing agile brilliance to revolutionize the CAMOrphange website into a pulsating ecosystem of impactful connections ",
      imageUrl: "/images/team/member1.jpg", // Replace with individual photo
      email: "bisseckhandtcarolinechantald@gmail.com",
      expertise: ["Agile Mastery and Leadership", "Obstacle Navigation", "Team Amplification "]
    },
    {
      id: 2,
      name: "Kefeyin Hariette Sela",
      role: "Product Owner",
      description: "Passionate about connecting communities and making a difference in children's lives worldwide.",
      imageUrl: "/images/team/member2.jpg", // Replace with actual image path
      email: "hariettesela@gmail.com",
      expertise: ["Product vision ", "Stakeholder management", "Customer feedback"]
    },
    {
      id: 3,
      name: "Njoukekang Loïc Derval",
      role: "Technical Support",
      description: "Identifying and resolving technical issues",
      imageUrl: "/images/team/member3.jpg", // Replace with actual image path
      email: "loicderval68@gmail.com",
      expertise: ["Troubleshooting", "Documentation", "Customer support"]
    },
    {
      id: 4,
      name: "Ndam Arnold ",
      role: "UI designer",
      description: "Designing Visual Elements ; color schemes,icons and other visual elements ",
      imageUrl: "/images/team/member4.jpg", // Replace with actual image path
      email: "david@example.com",
      expertise: ["UI/UX Design", "Visual Crafting", "Visual Communication"]
    },
    {
      id: 5,
      name: "Ngemenang Praise ",
      role: "Frontend",
      description: "In charge of the creation of the visual aspects of the CAMOrphanage Website",
      imageUrl: "/images/team/member5.jpg", // Replace with actual image path
      email: "ngemenangpraise@gmail.com",
      expertise: ["UI Implementation", "Responsive coding ", "Interactive development"]
    },
    {
      id: 6,
      name: "Dylane Younga",
      role: "Chief Technical Officer",
      description: "Developed and implemented the technical strategy ,aligning it with CAMOrphanage goals",
      imageUrl: "/images/team/member6.jpg", // Replace with actual image path
      email: "dilaneyounga@gmail.com",
      expertise: ["Technical Vision", "Srategic execution ", "Innovation"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/50 to-white">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-orange-300/15 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-1/2 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-orange-700/5 rounded-full blur-xl animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-20 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                <span className="block bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
                  Meet Our
                </span>
                <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                  Amazing Team
                </span>
              </h1>
            </div>

            {/* Mission Statement */}
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                We're a passionate group of individuals united by one mission: 
                <span className="font-semibold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  {" "}connecting hearts and building brighter futures for children in need.
                </span>
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Our diverse team brings together expertise in technology, child welfare, design, and community building 
                to create meaningful connections between support organizations and orphanages worldwide.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                <div className="text-3xl font-black text-orange-600 mb-2">6</div>
                <div className="text-gray-600 font-medium">Team Members</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                <div className="text-3xl font-black text-orange-600 mb-2">2+</div>
                <div className="text-gray-600 font-medium">Weeks Combined Experience</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                <div className="text-3xl font-black text-orange-600 mb-2">5+</div>
                <div className="text-gray-600 font-medium">Impacted</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                <div className="text-3xl font-black text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Dedicated Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <main className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            The People Behind the Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each member of our team brings unique skills and unwavering dedication to making a positive impact in children's lives
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="group relative overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Card Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur opacity-0 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
              
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-3 border border-orange-100 overflow-hidden">
                {/* Profile Image Section */}
                <div className="relative h-80 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
                  {/* Image Placeholder - Replace src with actual image paths */}
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      // Fallback if image doesn't load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  
                  {/* Fallback Avatar */}
                  <div className="absolute inset-0 hidden items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      {/* Social Links */}
                      <div className="flex space-x-3 justify-center">
                        <a
                          href={member.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-orange-600 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                        <a
                          href={`mailto:${member.email}`}
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-orange-600 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-4">
                  {/* Name and Role */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-orange-600 font-semibold text-lg mt-2">
                      {member.role}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-center">
                    {member.description}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 justify-center pt-4">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement Section */}
        <section className="mt-20 py-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl text-white text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Our Shared Vision
            </h3>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              We believe that every child deserves love, care, and the opportunity to thrive. 
              Through technology and human connection, we're building bridges that transform lives 
              and create lasting positive impact in communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/orphanages"
                className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
              >
                <span className="mr-3">🏠</span>
                Explore Orphanages
                <span className="ml-3">→</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-orange-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-orange-800 transform hover:scale-110 transition-all duration-300"
              >
                <span className="mr-3">✨</span>
                Join Our Mission
                <span className="ml-3">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}