'use client';
import { useSettingsStore } from '@/store/settingsStore';

export default function DynamicLogo({ className = "" }: { className?: string }) {
  const { businessName } = useSettingsStore(s => s.settings);

  if (!businessName) return null;

  // 1. If multiple words: "My Awesome Store" -> "My Awesome" + "Store" (indigo)
  const words = businessName.split(' ');
  if (words.length > 1) {
    const lastWord = words.pop();
    const firstPart = words.join(' ');
    return (
      <span className={className}>
        {firstPart} <span className="text-indigo-400">{lastWord}</span>
      </span>
    );
  }

  // 2. If single word and camelCase: "NovaCart" -> "Nova" + "Cart" (indigo)
  const camelMatch = businessName.match(/([a-z])([A-Z])/);
  if (camelMatch) {
    const index = camelMatch.index! + 1;
    return (
      <span className={className}>
        {businessName.slice(0, index)}
        <span className="text-indigo-600">{businessName.slice(index)}</span>
      </span>
    );
  }

  // 3. Just the name
  return <span className={className}>{businessName}</span>;
}
