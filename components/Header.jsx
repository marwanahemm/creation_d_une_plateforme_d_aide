import Link from 'next/link'
import { Home, BookOpen } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          DémarchesSimples
        </Link>
        
        <nav className="flex gap-6">
          <Link href="/" className="flex items-center gap-2 hover:text-indigo-600 transition">
            <Home className="w-4 h-4" />
            Accueil
          </Link>
          <Link href="/tutoriels" className="flex items-center gap-2 hover:text-indigo-600 transition">
            <BookOpen className="w-4 h-4" />
            Tutoriels
          </Link>
          <Link href="/admin" className="flex items-center gap-2 hover:text-indigo-600 transition">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}