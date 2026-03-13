"use client";

import { useState } from "react";
import type { ContactFormData, FormStatus } from "@/types";
import { Input, Textarea, Button, StatusAlert } from "@/components/ui";

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setStatusMsg(data.success);
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setStatusMsg(data.error);
      }
    } catch {
      setStatus("error");
      setStatusMsg("Error saving message.");
    }
  };

  return (
    <div className="lg:flex-1">
      {status === "success" && (
        <StatusAlert variant="success">{statusMsg}</StatusAlert>
      )}
      {status === "error" && (
        <StatusAlert variant="error">{statusMsg}</StatusAlert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              placeholder="Name"
              maxLength={100}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email address"
              maxLength={120}
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <Textarea
          placeholder="Tell me about the project"
          rows={5}
          maxLength={2000}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
