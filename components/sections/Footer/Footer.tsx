import { Container } from "@/components/ui";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] border-t border-gray-800 py-6">
      <Container className="text-center">
        <p className="text-gray-500 text-sm">
          Copyright &copy; {new Date().getFullYear()}{" "}
          <span className="text-gray-400">Thuong&apos;s Portfolio</span> By
          Nguyen Hoai Thuong
        </p>
      </Container>
    </footer>
  );
}
