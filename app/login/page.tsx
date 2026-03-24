import { Suspense } from "react";
import { LoginForm } from "@/components/sections/Auth";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
