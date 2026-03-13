import Image from "next/image";

const skills = [
  {
    title: "Programming Languages",
    items: "Python, SQL, HTML/CSS, JavaScript",
  },
  {
    title: "Frameworks & Libraries",
    items: "TensorFlow, Keras, PyTorch, OpenCV, Transformer",
  },
  {
    title: "Development Tools",
    items: "Flask, Streamlit, Next.js, Git",
  },
  {
    title: "Database & Cloud",
    items: "SQL Server, PostgreSQL, SQLite, Render, Google Cloud",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-[#232323] py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* My Story */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          <div className="flex-1">
            <Image
              src="/images/IMG_2814.JPEG"
              alt="Thuong"
              width={500}
              height={400}
              className="rounded-2xl object-cover w-full max-h-[400px]"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-end gap-4 mb-6">
              <h2 className="text-white text-3xl font-bold">My Story</h2>
              <Image
                src="/images/happy-bearded-young-man.JPEG"
                alt="Avatar"
                width={56}
                height={56}
                className="rounded-full object-cover border-4 border-purple-500"
              />
            </div>
            <h3 className="text-gray-300 text-xl mb-4">a little bit about me</h3>
            <p className="text-gray-400 leading-relaxed">
              My name is Thuong – which can mean &ldquo;love&rdquo; or even &ldquo;cute&rdquo; ^^.
              I am majoring in Artificial Intelligence, and here you&apos;ll find some of the
              projects and demos I&apos;ve worked on.
            </p>
          </div>
        </div>

        {/* Info + Skills */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Info card */}
          <div className="flex-1">
            <div className="bg-[#2d2d2d] rounded-2xl overflow-hidden">
              <div className="bg-purple-600 px-6 py-4">
                <h4 className="text-white font-semibold text-lg">Information</h4>
              </div>
              <div className="px-6 py-4 space-y-3">
                {[
                  { label: "Name", value: "Nguyen Hoai Thuong" },
                  { label: "Birthday", value: "Feb 24, 2003" },
                  { label: "Phone", value: "0363467347", href: "tel:0363467347" },
                  {
                    label: "Email",
                    value: "thuonggg81@gmail.com",
                    href: "mailto:thuonggg81@gmail.com",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 text-sm">
                    <span className="text-gray-500 w-20 shrink-0">{item.label}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-gray-300 hover:text-purple-400 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-gray-300">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-0 border border-gray-700 rounded-2xl overflow-hidden">
              {skills.map((skill, i) => (
                <div
                  key={skill.title}
                  className={`p-5 ${
                    i % 2 === 1 ? "border-l border-gray-700" : ""
                  } ${i < 2 ? "border-b border-gray-700" : ""}`}
                >
                  <strong className="text-white text-sm block mb-2">{skill.title}</strong>
                  <p className="text-gray-400 text-xs leading-relaxed">{skill.items}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
