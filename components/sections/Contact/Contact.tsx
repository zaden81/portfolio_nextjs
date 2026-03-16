import { Container, SectionHeader } from "@/components/ui";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="bg-bg-primary py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeader
          imageSrc="/images/aerial-view-man-using-computer-laptop-wooden-table.jpg"
          imageAlt="Contact"
          title="Say Hi"
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <ContactInfo />
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
