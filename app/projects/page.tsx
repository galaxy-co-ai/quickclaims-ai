import { db } from '@/lib/db'
import Link from 'next/link'

export default async function ProjectsIndex() {
  const userId = process.env.TEMP_USER_ID || 'dev-user-001'
  const projects = await db.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { uploads: true, documents: true } } },
  })

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card-soft">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Projects</h1>
            <Link href="/dashboard" className="text-primary underline">Create new</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map(p => (
            <Link key={p.id} href={`/projects/${p.id}`} className="card-soft block">
              <h3 className="text-xl font-semibold">{p.clientName}</h3>
              <p className="text-muted-foreground">{p.address} · {p.projectType}</p>
              <div className="mt-3 text-sm text-muted-foreground">
                {p._count.uploads} uploads · {p._count.documents} docs · <span className="capitalize">{p.status}</span>
              </div>
            </Link>
          ))}

          {projects.length === 0 && (
            <div className="card-soft">
              <p className="text-muted-foreground">No projects yet. Create one with the AI concierge.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
