import FeedbacksDashboard from '@/components/admin/FeedbacksDashboard'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard admin</h1>
        <p className="text-sm text-slate-400 mt-1">Vue d'ensemble de la plateforme</p>
      </header>
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <FeedbacksDashboard />
      </section>
    </main>
  )
}