import { db } from '@/lib/db'
import { UploadBox } from '@/components/project/UploadBox'
import { GenerateButton } from '@/components/project/GenerateButton'
import Link from 'next/link'
import { RoadmapView, MaterialsView, EstimateView } from '@/components/project/DocumentViews'

export default async function ProjectDetail({ params }: { params: { id: string } }) {
  const project = await db.project.findUnique({
    where: { id: params.id },
    include: {
      uploads: { orderBy: { createdAt: 'desc' } },
      documents: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!project) {
    return (
      <div className="min-h-screen p-6">
        <div className="card-soft">
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <Link className="text-primary underline" href="/dashboard">Back to dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card-soft">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{project.clientName}</h1>
              <p className="text-muted-foreground">{project.address} · {project.projectType}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm capitalize">{project.status}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-soft space-y-4">
            <h3 className="text-xl font-semibold">Upload documents & photos</h3>
            <UploadBox projectId={project.id} />

            <div>
              <h4 className="font-semibold mb-2">Recent uploads</h4>
              <ul className="space-y-2">
                {project.uploads.length === 0 && (
                  <li className="text-muted-foreground text-sm">No uploads yet.</li>
                )}
                {project.uploads.map(u => (
                  <li key={u.id} className="flex items-center justify-between border border-border rounded-xl p-3">
                    <div>
                      <p className="font-medium">{u.fileName}</p>
                      <p className="text-xs text-muted-foreground">{u.fileType} · {(u.fileSize/1024/1024).toFixed(2)} MB</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={u.fileUrl} className="text-primary underline" target="_blank">View</Link>
                      <form action={`/api/uploads/${u.id}`} method="post" className="flex items-center gap-2" onSubmit={(e)=>{}}>
                        {/* Rename via JS fetch - simple prompt */}
                        <button type="button" className="text-sm text-foreground/70 hover:text-foreground" onClick={async()=>{
                          const name = prompt('Rename file', `${u.fileName}`)
                          if(!name) return
                          await fetch(`/api/uploads/${u.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileName: name }) })
                          location.reload()
                        }}>Rename</button>
                        <button type="button" className="text-sm text-destructive hover:opacity-80" onClick={async()=>{
                          if(!confirm('Delete this file?')) return
                          await fetch(`/api/uploads/${u.id}`, { method: 'DELETE' })
                          location.reload()
                        }}>Delete</button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">AI Documents</h3>
              <div className="flex gap-2">
                <a href={`/api/exports/${project.id}/materials.csv`} className="h-10 px-4 py-2 rounded-xl border border-border text-sm">Materials CSV</a>
                <a href={`/api/exports/${project.id}/estimate.csv`} className="h-10 px-4 py-2 rounded-xl border border-border text-sm">Estimate CSV</a>
                <a href={`/api/exports/${project.id}/estimate/pdf`} className="h-10 px-4 py-2 rounded-xl border border-border text-sm">Estimate PDF</a>
                <GenerateButton projectId={project.id} />
              </div>
            </div>

            <div className="space-y-3">
              {project.documents.length === 0 && (
                <p className="text-muted-foreground text-sm">No documents yet. Upload a scope and click Generate.</p>
              )}
              {project.documents.map(d => (
                <div key={d.id} className="border border-border rounded-xl p-4 space-y-2">
                  <h4 className="font-semibold mb-1 capitalize">{d.type}</h4>
                  {d.type === 'roadmap' && <RoadmapView data={d.content as any} />}
                  {d.type === 'materials' && <MaterialsView data={d.content as any} />}
                  {d.type === 'estimate' && <EstimateView data={d.content as any} />}
                  {d.type === 'brief' && (
                    <pre className="text-sm overflow-auto whitespace-pre-wrap">{JSON.stringify(d.content, null, 2)}</pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
