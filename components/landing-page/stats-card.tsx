"use client"
import { EyeIcon, RocketIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";

/* ---------------------------
   Data
---------------------------- */
const statsData = [
  { icon: RocketIcon, value: "2.5k+", label: "Project Shared" },
  { icon: UsersIcon, value: "10k+", label: "Active Creators" },
  { icon: EyeIcon, value: "50k+", label: "Monthly Visitors" },
];

/* ---------------------------
   Count-up hook (ease-out)
---------------------------- */
function useCountUp(target, duration = 1400) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime = null;

    // extract number and suffix
    const number = parseFloat(target.replace(/[^\d.]/g, ""));
    const suffix = target.replace(/[\d.]/g, "");

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (time) => {
      if (!startTime) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setCurrent(Math.floor(easedProgress * number));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  const suffix = target.replace(/[\d.]/g, "");
  return `${current}${suffix}`;
}

/* ---------------------------
   Component
---------------------------- */
const StatsCard = () => {
  return (
    <div className="w-full pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Always one row */}
        <div className="grid grid-cols-3 mx-5">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            const animatedValue = useCountUp(stat.value);

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-xl sm:text-2xl font-semibold text-white tracking-tight tabular-nums">
                    {animatedValue}
                  </span>
                </div>

                <span className="mt-1 text-[11px] sm:text-xs text-zinc-500 tracking-tight">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
