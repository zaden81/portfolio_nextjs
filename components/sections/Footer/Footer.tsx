import { Container } from "@/components/ui";
import { FadeIn } from "@/components/motion";

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border py-4 sm:py-6">
      <Container className="text-center">
        <FadeIn duration={0.4}>
          <p className="text-text-muted text-xs sm:text-sm">
            Copyright &copy; {new Date().getFullYear()}{" "}
            <span className="text-text-secondary">Thuong&apos;s Portfolio</span> By
            Nguyen Hoai Thuong
          </p>
        </FadeIn>
      </Container>
    </footer>
  );
}
