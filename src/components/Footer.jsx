import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-12">
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 font-black text-[#000091] text-lg w-fit mb-2">
              <span className="w-1 h-6 rounded-sm" style={{ background: 'linear-gradient(180deg,#000091 50%,#e1000f 50%)' }} />
              Les guides
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Guides pas à pas pour vos démarches administratives en ligne.
              Gratuit, sans inscription et sans collecte de données.
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Navigation</span>
            <Link href="/" className="text-sm text-slate-600 hover:text-[#000091] transition-colors w-fit">Accueil</Link>
            <Link href="/tutoriels" className="text-sm text-slate-600 hover:text-[#000091] transition-colors w-fit">Tous les guides</Link>
          </nav>

        </div>

        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={13} className="text-green-600" />
            Site non officiel — aucune affiliation avec les organismes mentionnés.
          </p>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Les guides</p>
        </div>
      </section>
    </footer>
  )
}