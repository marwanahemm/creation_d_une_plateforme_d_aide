import Link from 'next/link'
import { BookOpen, Users, Shield, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-linear-to-br from-indigo-600 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Vos démarches administratives simplifiées
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Des guides pas à pas pour vous accompagner dans vos démarches en ligne
          </p>
          <Link 
            href="/tutoriels" 
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Voir les tutoriels <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <BookOpen className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">3</div>
              <div className="text-gray-600">Tutoriels disponibles</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">3</div>
              <div className="text-gray-600">Services couverts</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600">Gratuit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services rapides */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Accès rapide aux services</h2>
          <div className="grid md:grid-cols-3 gap-8">

            {/* Ameli - bleu */}
            <Link href="/tutoriels" className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-blue-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                  <path d="M6 15h4" />
                  <path d="M14 15h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Ameli</h3>
              <p className="text-gray-600">Assurance maladie et remboursements</p>
            </Link>

            {/* CAF - vert */}
            <Link href="/tutoriels" className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-emerald-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
                  <path d="M17 8c1.5 0 3 .5 3 2s-1.5 2-3 2" strokeLinecap="round"/>
                  <path d="M7 8c-1.5 0-3 .5-3 2s1.5 2 3 2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">CAF</h3>
              <p className="text-gray-600">Allocations familiales</p>
            </Link>

            {/* France Travail - orange */}
            <Link href="/tutoriels" className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-orange-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <path d="M12 12v4" strokeLinecap="round"/>
                  <path d="M8 14h8" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">France Travail</h3>
              <p className="text-gray-600">Emploi et allocations chômage</p>
            </Link>

          </div>
        </div>
      </section>
    </div>
  )
}