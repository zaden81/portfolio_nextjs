import { Container, SectionHeader } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="bg-bg-primary py-12 sm:py-16 lg:py-20">
      <Container>
        <FadeIn>
          <SectionHeader
            imageSrc="/images/aerial-view-man-using-computer-laptop-wooden-table.jpg"
            imageAlt="Contact"
            title="Say Hi"
          />
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <FadeIn direction="left" delay={0.1}>
            <ContactInfo />
          </FadeIn>
          <FadeIn direction="right" delay={0.2} className="flex-1">
            <ContactForm />
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
