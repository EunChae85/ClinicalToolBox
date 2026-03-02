import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function KpiCard({
    title,
    value,
    description,
    alert = false
}: {
    title: string;
    value: string | number;
    description?: string;
    alert?: boolean;
}) {
    return (
        <Card className={alert ? "border-destructive/50" : ""}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-3xl font-bold ${alert ? "text-destructive" : ""}`}>{value}</div>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </CardContent>
        </Card>
    );
}
