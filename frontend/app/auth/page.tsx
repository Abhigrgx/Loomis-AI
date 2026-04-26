import { AuthForm } from '@/components/AuthForm';

export default function AuthPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold text-slate">Sign in to Loomis AI</h1>
      <p className="text-sm text-slate/75">Secure JWT authentication with role-ready user access controls.</p>
      <AuthForm />
    </section>
  );
}
