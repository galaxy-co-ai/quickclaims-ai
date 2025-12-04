import { AppShell } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/Card'

export default function EmailPage() {
  return (
    <AppShell mobileTitle="Email">
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold mb-2">Email Integration</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Send supplement submissions, rebuttals, and follow-ups directly to carriers — all from within QuickClaims.
          </p>
          
          <Card className="text-left max-w-md mx-auto">
            <CardContent className="p-6">
              <h3 className="font-medium mb-3">Coming Soon</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  One-click supplement submission to adjusters
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  Pre-written email templates for every stage
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  Automatic follow-up reminders
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  Email history linked to each claim
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="mt-8 p-4 bg-muted/50 rounded-xl max-w-md mx-auto">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Want early access?</span>
              {' '}
              Email integration is in development. Contact us to be notified when it launches.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
