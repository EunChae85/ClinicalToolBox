import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle } from 'lucide-react';

export type Flag = {
    id: string;
    type: 'error' | 'warning';
    message: string;
};

export function FlagList({ flags }: { flags: Flag[] }) {
    if (!flags || flags.length === 0) return null;

    return (
        <div className="space-y-3 mt-6">
            <h3 className="font-medium text-sm text-muted-foreground">Flags & Diagnostics</h3>
            {flags.map(flag => (
                <Alert
                    key={flag.id}
                    variant={flag.type === 'error' ? 'destructive' : 'default'}
                    className={flag.type === 'warning' ? "border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200" : ""}
                >
                    {flag.type === 'error' ? (
                        <AlertCircle className="h-4 w-4" />
                    ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    )}
                    <AlertTitle className="text-sm font-semibold">{flag.id}</AlertTitle>
                    <AlertDescription className="text-xs">
                        {flag.message}
                    </AlertDescription>
                </Alert>
            ))}
        </div>
    );
}
