import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-display font-bold text-2xl text-foreground">
            QuickClaims<span className="text-primary">.ai</span>
          </span>
        </div>

        {/* Clerk SignIn Component */}
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-border bg-card",
              headerTitle: "text-foreground font-display",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border-border hover:bg-muted",
              formButtonPrimary: "bg-primary hover:bg-primary-hover text-primary-foreground",
              footerActionLink: "text-primary hover:text-primary-hover",
              formFieldInput: "border-border bg-background text-foreground",
              formFieldLabel: "text-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
            },
          }}
        />
      </div>
    </div>
  );
}
