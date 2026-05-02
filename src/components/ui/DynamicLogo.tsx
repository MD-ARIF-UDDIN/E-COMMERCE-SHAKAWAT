'use client';
import { useSettingsStore } from '@/store/settingsStore';

export default function DynamicLogo({ className = "" }: { className?: string }) {
  const { businessName } = useSettingsStore(s => s.settings);

  if (!businessName) return null;

  // 1. If multiple words: "My Awesome Store" -> "My Awesome" + "Store" (primary)
  const words = businessName.split(' ');
  if (words.length > 1) {
    const lastWord = words.pop();
    const firstPart = words.join(' ');
    return (
      <span className={className}>
        {firstPart} <span className="text-primary">{lastWord}</span>
      </span>
    );
  }

  // 2. If single word and camelCase: "NovaCart" -> "Nova" + "Cart" (primary)
  const camelMatch = businessName.match(/([a-z])([A-Z])/);
  if (camelMatch) {
    const index = camelMatch.index! + 1;
    return (
      <span className={className}>
        {businessName.slice(0, index)}
        <span className="text-primary">{businessName.slice(index)}</span>
      </span>
    );
  }

  // 3. Just the name
  return <span className={className}>{businessName}</span>;
}
