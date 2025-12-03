import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout";
import { ProjectDetailClient } from "./ProjectDetailClient";
import { ChevronRight, Home } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatAddress(address: string): { line1: string; line2: string } {
  const parts = address.split(",").map(p => p.trim());
  
  if (parts.length >= 3) {
    const street = parts[0];
    const cityStateZip = parts.slice(1).join(", ")
      .replace(/Oklahoma/gi, "OK")
      .replace(/Texas/gi, "TX")
      .replace(/California/gi, "CA")
      .replace(/Florida/gi, "FL")
      .replace(/New York/gi, "NY")
      .replace(/Arizona/gi, "AZ")
      .replace(/Colorado/gi, "CO")
      .replace(/Georgia/gi, "GA")
      .replace(/Illinois/gi, "IL")
      .replace(/Michigan/gi, "MI")
      .replace(/North Carolina/gi, "NC")
      .replace(/Ohio/gi, "OH")
      .replace(/Pennsylvania/gi, "PA")
      .replace(/Tennessee/gi, "TN")
      .replace(/Virginia/gi, "VA")
      .replace(/Washington/gi, "WA");
    return { line1: street, line2: cityStateZip };
  } else if (parts.length === 2) {
    return { line1: parts[0], line2: parts[1] };
  }
  
  return { line1: address, line2: "" };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: {
      uploads: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
      claim: {
        include: {
          activities: { orderBy: { createdAt: "desc" }, take: 10 },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  // Get activities from the claim if it exists
  const activities = project.claim?.activities || [];

  return (
    <AppShell showMobileBack mobileBackHref="/projects" mobileBackLabel="Projects">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Dashboard</span>
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/projects" className="hover:text-foreground transition-colors">
            Projects
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {project.clientName}
          </span>
        </nav>

        {/* Header */}
        <header className="mb-4 text-center">
          <h1 className="text-4xl font-semibold text-foreground tracking-wide">
            {project.clientName}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">{project.address}</p>
        </header>

        {/* Main Content */}
        <ProjectDetailClient
          project={{
            id: project.id,
            clientName: project.clientName,
            address: project.address,
            projectType: project.projectType,
            status: project.status,
            createdAt: project.createdAt.toISOString(),
          }}
          uploads={project.uploads.map((u) => ({
            id: u.id,
            fileName: u.fileName,
            fileUrl: u.fileUrl,
            fileType: u.fileType,
            mimeType: u.mimeType,
            fileSize: u.fileSize,
            createdAt: u.createdAt.toISOString(),
          }))}
          documents={project.documents.map((d) => ({
            id: d.id,
            type: d.type,
            title: d.title,
            content: d.content,
            createdAt: d.createdAt.toISOString(),
          }))}
          activities={activities.map((a) => ({
            id: a.id,
            action: a.action,
            description: a.description,
            createdAt: a.createdAt.toISOString(),
          }))}
        />
      </div>
    </AppShell>
  );
}
