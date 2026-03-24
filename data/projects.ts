import type { Project } from "@/types";

export const PROJECTS: Project[] = [
  {
    tag: "Angry Birds style physics game built with HTML5 Canvas and Matter.js. Slingshot mechanics, 3 levels with increasing difficulty, real-time physics simulation, and score tracking.",
    title: "Block Smasher",
    image: "/images/projects/true-agency-9Bjog5FZ-oc-unsplash.jpg",
    href: "/game",
    isInternal: true,
  },
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
