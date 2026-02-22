import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function Placeholder({ title }: { title: string }) {
    return (
        <div className="animate-in fade-in zoom-in duration-500 max-w-2xl">
            <Card className="border-white/10 shadow-2xl backdrop-blur-xl bg-surface/50">
                <CardHeader>
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    <CardDescription>This feature is currently under development.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-text-secondary pb-4">
                        The {title.toLowerCase()} interface is being actively developed and will be available in the next release.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
