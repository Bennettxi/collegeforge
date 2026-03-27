'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface UpgradePromptProps {
  feature: string;
  description?: string;
  className?: string;
}

export function UpgradePrompt({ feature, description, className }: UpgradePromptProps) {
  return (
    <div className={cn('relative rounded-2xl p-[2px] bg-gradient-to-r from-purple-500 to-emerald-500', className)}>
      <Card className="rounded-[14px] text-center">
        <div className="text-4xl mb-3">🌳</div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Unlock {feature}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {description}
          </p>
        )}
        <Link href="/dashboard/settings">
          <Button variant="primary" size="md">
            Upgrade to Mighty Oak
          </Button>
        </Link>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 font-medium">
          Currently free during beta!
        </p>
      </Card>
    </div>
  );
}
