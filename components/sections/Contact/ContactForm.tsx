"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            key="success-alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <StatusAlert variant="success">{statusMsg}</StatusAlert>
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            key="error-alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <StatusAlert variant="error">{statusMsg}</StatusAlert>
          </motion.div>
        )}
      </AnimatePresence>

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
