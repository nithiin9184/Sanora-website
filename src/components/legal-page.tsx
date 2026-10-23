import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { highlightLegalText, securityNotice, type LegalDocument } from "@/lib/legal-content";
import logo from "@/assets/sanora-logo.webp";

function Highlighted({ text }: { text: string }) {
  return (
    <>
      {highlightLegalText(text).map((segment, index) =>
        segment.tone ? (
          <strong key={index} className={`font-semibold ${segment.tone === "red" ? "text-red-500" : "text-green-500"}`}>{segment.text}</strong>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}

export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <div className="legal-page min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5">
          <Link to="/" className="flex items-center gap-3 text-sm font-semibold">
            <img src={logo} alt="" className="h-8 w-8" /> SANORA Music
          </Link>
          <Button asChild variant="outline" size="sm"><Link to="/"><ArrowLeft /> Back to home</Link></Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 pb-16 pt-8 sm:pt-10">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
            <li>Legal</li>
            <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
            <li aria-current="page" className="text-foreground">{document.title}</li>
          </ol>
        </nav>

        <aside aria-label="Official Security Notice" className="mt-8 flex items-start gap-3 rounded-lg border border-border bg-foreground/[0.03] p-4 backdrop-blur-xl sm:p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-xs leading-6 text-muted-foreground sm:text-sm"><strong className="font-semibold text-foreground">Official Security Notice:</strong> <Highlighted text={securityNotice.slice("Official Security Notice:".length)} /></p>
        </aside>

        <div className="mt-10 border-b border-border pb-8">
          <p className="text-xs text-muted-foreground">Last updated: October 2026</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{document.title}</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground"><Highlighted text={document.introduction} /></p>
        </div>

        <div className="mt-9 grid items-start gap-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
          <nav aria-label="On this page" className="border-b border-border pb-7 lg:sticky lg:top-8 lg:border-b-0 lg:pb-0">
            <h2 className="text-xs font-semibold text-foreground">On this page</h2>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {document.sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="block text-xs leading-5 text-muted-foreground hover:text-foreground">{section.title}</a></li>)}
            </ol>
          </nav>
          <article className="min-w-0">
            {document.sections.map((section) => (
              <section id={section.id} key={section.id} className="scroll-mt-8 border-b border-border pb-8 [&+section]:pt-8">
                <h2 className="text-lg font-semibold leading-7">{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-7 text-muted-foreground"><Highlighted text={paragraph} /></p>)}
                {section.items && <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-muted-foreground">{section.items.map((item) => <li key={item} className="pl-1"><Highlighted text={item} /></li>)}</ul>}
              </section>
            ))}
            <section aria-label="Contact SANORA" className="pt-8">
              <h2 className="text-lg font-semibold">Contact SANORA</h2>
              <div className="mt-5 space-y-5">
                {document.contacts.map((contact) => <div key={contact.email}><p className="text-xs text-muted-foreground">{contact.label}</p><a href={`mailto:${contact.email}`} className="mt-2 inline-flex items-center gap-2 break-all text-sm underline-offset-4 hover:underline"><Mail className="h-4 w-4 shrink-0" />{contact.email}</a></div>)}
              </div>
              <Button asChild variant="outline" className="mt-8"><Link to="/"><ArrowLeft /> Back to home</Link></Button>
            </section>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}