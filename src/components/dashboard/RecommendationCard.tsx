import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CATEGORY_LABELS } from '@/types/scoring';
import { Recommendation } from '@/lib/recommendations/generator';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const priorityVariant = {
  high: 'danger' as const,
  medium: 'warning' as const,
  low: 'info' as const,
};

const priorityLabel = {
  high: 'High Priority',
  medium: 'Medium',
  low: 'Low',
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { category, priority, title, description, impact } = recommendation;

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={priorityVariant[priority]}>{priorityLabel[priority]}</Badge>
            <span className="text-xs text-gray-400 dark:text-gray-500">{CATEGORY_LABELS[category]}</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">{impact}</p>
        </div>
      </div>
    </Card>
  );
}
