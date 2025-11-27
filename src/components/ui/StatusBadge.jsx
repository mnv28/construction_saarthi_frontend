/**
 * StatusBadge Component
 * Displays status badge with colored background and border
 */

// Export background colors (without borders) for reuse
export const statusBadgeBgColors = {
  red: "bg-[rgba(255,59,48,0.08)]",
  green: "bg-[rgba(52,199,89,0.08)]",
  yellow: "bg-[rgba(255,149,0,0.08)]",
  blue: "bg-[rgba(0,122,255,0.078)]",
  purple: "bg-[rgba(175,82,222,0.078)]",
  pink: "bg-[rgba(255,45,85,0.006)]",
  darkblue: "bg-[rgba(33,0,93,0.06)]",
};

// Export colors from StatusBadge for reuse across the app
export const statusBadgeColors = {
  red: {
    border: "rgba(255, 59, 48, 1)",
    background: "rgba(255,59, 48, 0.08)",
    text: "#FF3B30",
  },
  green: {
    border: "rgba(52, 199, 89, 0.4)",
    background: "rgba(52, 199, 89, 0.08)",
    text: "#34C759",
  },
  yellow: {
    border: "rgba(255, 149, 0, 0.4)",
    background: "rgba(255, 149, 0, 0.08)",
    text: "#FF9500",
  },
  blue: {
    border: "rgba(0, 122, 255, 0.4)",
    background: "rgba(0, 122, 255, 0.078)",
    text: "#007AFF",
  },
  purple: {
    border: "rgba(175, 82, 222, 0.4)",
    background: "rgba(175, 82, 222, 0.078)",
    text: "#AF52DE",
  },
  pink: {
    border: "rgba(255, 45, 85, 0.4)",
    background: "rgba(255, 45, 85, 0.006)",
    text: "#FF2D55",
  },
  darkblue: {
    border: "rgba(33, 0, 93, 0.4)",
    background: "rgba(33, 0, 93, 0.06)",
    text: "#21005D",
  },
};

// Export individual color arrays for convenience
export const statusBadgeColorHex = {
  red: statusBadgeColors.red.text,
  green: statusBadgeColors.green.text,
  yellow: statusBadgeColors.yellow.text,
  blue: statusBadgeColors.blue.text,
  purple: statusBadgeColors.purple.text,
  pink: statusBadgeColors.pink.text,
  darkblue: statusBadgeColors.darkblue.text,
};

export const statusBadgeBorderColors = {
  red: statusBadgeColors.red.border,
  green: statusBadgeColors.green.border,
  yellow: statusBadgeColors.yellow.border,
  blue: statusBadgeColors.blue.border,
  purple: statusBadgeColors.purple.border,
  pink: statusBadgeColors.pink.border,
  darkblue: statusBadgeColors.darkblue.border,
};

export const statusBadgeAvatarColors = {
  red: statusBadgeColors.red.border,
  green: statusBadgeColors.green.border,
  yellow: statusBadgeColors.yellow.border,
  blue: statusBadgeColors.blue.border,
  purple: statusBadgeColors.purple.border,
  pink: statusBadgeColors.pink.border,
  darkblue: statusBadgeColors.darkblue.border,
};

/**
 * StatusAvatar
 * Reusable avatar used for workspaces / language badges etc.
 * Uses the same color system as StatusBadge.
 */
export function StatusAvatar({
  label,
  color = "red",
  variant = "square", // 'square' | 'circle'
  size = "md", // 'sm' | 'md'
  className = "",
}) {
  const bgClass = statusBadgeBgColors[color] || statusBadgeBgColors.red;
  const borderColor = statusBadgeBorderColors[color] || statusBadgeBorderColors.red;
  const textColor = statusBadgeColorHex[color] || statusBadgeColorHex.red;

  const sizeClasses =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : "w-10 h-10 text-sm";

  const radiusClass =
    variant === "circle" ? "rounded-full" : "rounded-[8px]";

  return (
    <div
      className={`border flex items-center justify-center font-bold flex-shrink-0 ${sizeClasses} ${radiusClass} ${bgClass} ${className}`}
      style={{ color: textColor, borderColor }}
    >
      {label}
    </div>
  );
}

export default function StatusBadge({ text, color = "red", className = "" }) {
  const colors = {
    red: `border-1 border-[${statusBadgeColors.red.border}] bg-[${statusBadgeColors.red.background}] text-[${statusBadgeColors.red.text}]`,
    green: `border-1 border-[${statusBadgeColors.green.border}] bg-[${statusBadgeColors.green.background}] text-[${statusBadgeColors.green.text}]`,
    yellow: `border-1 border-[${statusBadgeColors.yellow.border}] bg-[${statusBadgeColors.yellow.background}] text-[${statusBadgeColors.yellow.text}]`,
    blue: `border-1 border-[${statusBadgeColors.blue.border}] bg-[${statusBadgeColors.blue.background}] text-[${statusBadgeColors.blue.text}]`,
    purple: `border-1 border-[${statusBadgeColors.purple.border}] bg-[${statusBadgeColors.purple.background}] text-[${statusBadgeColors.purple.text}]`,
    pink: `border-1 border-[${statusBadgeColors.pink.border}] bg-[${statusBadgeColors.pink.background}] text-[${statusBadgeColors.pink.text}]`,
    darkblue: `border-1 border-[${statusBadgeColors.darkblue.border}] bg-[${statusBadgeColors.darkblue.background}] text-[${statusBadgeColors.darkblue.text}]`,
  };

  return (
    <div
      className={`px-3 py-2 rounded-lg flex items-center justify-center font-semibold ${colors[color] || colors.red} ${className}`}
    >
      {text}
    </div>
  );
}
