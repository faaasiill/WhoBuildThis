import { ArrowUpRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

const SectionHeader = ({
  title,
  subtitle,
  actionLabel = "View all",
  onActionClick,
}: SectionHeaderProps) => {
  return (
    <div className="w-full mb-8 px-4 sm:px-20">
      {/* Title */}
      <h2 className="text-3xl sm:text-5xl font-semibold tracking-tighter text-white">
        {title}
      </h2>

      {/* Subtitle + action row */}
      <div className="mt-2 flex items-center justify-between gap-4">
        <p className="text-sm sm:text-base tracking-tight text-zinc-400 max-w-xl">
          {subtitle}
        </p>

        <button
          onClick={onActionClick}
          className="
                        group inline-flex items-center gap-1.5
                        text-sm font-medium text-white
                        tracking-tight
                        transition-colors
                        hover:text-zinc-300
                        shrink-0
                    "
        >
          {actionLabel && (
            <>
              {actionLabel}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SectionHeader;
