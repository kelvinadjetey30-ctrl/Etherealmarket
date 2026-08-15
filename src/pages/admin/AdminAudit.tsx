import { Card } from '@/components/ui/Card';

export default function AdminAudit() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Audit Log</h1>
      <Card className="py-8 text-center text-muted text-sm">
        Audit events appear here when connected to Supabase. Local demo mode stores actions in browser storage only.
      </Card>
    </div>
  );
}
