import Link from 'next/link';

const features = [
  {
    title: 'Content Generation',
    description: 'Create polished text, code, and media-ready outputs in seconds.'
  },
  {
    title: 'Agent Automation',
    description: 'Run multi-step workflows with AI agents and reusable prompt templates.'
  },
  {
    title: 'Unified Interfaces',
    description: 'Use chat, voice-ready endpoints, and API access from one secure platform.'
  }
];

export default function LandingPage() {
  return (
    <section className="space-y-10">
      <div className="glass overflow-hidden rounded-3xl p-8 md:p-12">
        <p className="mb-3 inline-flex rounded-full bg-ember/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ember">
          Production-Ready AI Platform
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate md:text-6xl">
          Loomis AI turns prompts into products, workflows, and outcomes.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate/80 md:text-lg">
          Ship AI-powered experiences with secure auth, conversation memory, and scalable backend APIs.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth" className="rounded-xl bg-pine px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            Start Free
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-pine/25 bg-white px-5 py-3 text-sm font-semibold text-pine">
            Open Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="glass rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-pine">{feature.title}</h2>
            <p className="mt-2 text-sm text-slate/80">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
