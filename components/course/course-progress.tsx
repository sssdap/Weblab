import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface CourseProgressProps {
  progress: number;
}

export function CourseProgress({ progress }: CourseProgressProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="py-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Общий прогресс</span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          Пройди все модули и проекты — получишь сертификат
        </p>
      </CardContent>
    </Card>
  );
}
