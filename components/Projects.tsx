import Image from "next/image";

const projects = [
  {
    tag: "An AI system for dog and cat recognition using YOLOv11 (data collection, preprocessing, model training). Classified pet fur colors using MobileNetV2 fine-tune.",
    title: "Dog & Cat Classification",
    image: "/images/projects/nikhil-KO4io-eCAXA-unsplash.jpg",
    href: "https://github.com/zaden81",
  },
  {
    tag: "Chatbot consulting on Vietnamese marriage and family law. Implemented using RAG, LangChain, LLMs (Gemma 3 in LM Studio), with vector storage on Pinecone. Proficient in NLP concepts: Transformers, Embedding, Chunking, etc.",
    title: "Chatbot RAG",
    image: "/images/projects/the-5th-IQYR7N67dhM-unsplash.jpg",
    href: "https://github.com/zaden81/chatbotrag2035",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="bg-[#1a1a1a] py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-12">
          <Image
            src="/images/white-desk-work-study-aesthetics.jpg"
            alt="Projects"
            width={56}
            height={56}
            className="rounded-full object-cover"
          />
          <h2 className="text-white text-3xl font-bold">Projects</h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="bg-[#2d2d2d] rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={350}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                    View on GitHub
                  </span>
                </a>
              </div>
              <div className="p-6">
                <p className="text-gray-400 text-xs mb-3 leading-relaxed">{project.tag}</p>
                <h3 className="text-white font-semibold text-lg">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
