import { Container, SectionHeader } from "@/components/ui";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="bg-[#232323] py-20">
      <Container>
        <SectionHeader
          imageSrc="/images/aerial-view-man-using-computer-laptop-wooden-table.jpg"
          imageAlt="Contact"
          title="Say Hi"
        />

        <div className="flex flex-col lg:flex-row gap-12">
          <ContactInfo />
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
