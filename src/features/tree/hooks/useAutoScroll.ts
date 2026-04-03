import { useEffect, useRef } from "react";

type UseAutoScrollOptions = {
  threshold?: number;
  behavior?: ScrollBehavior;
};

export const useAutoScroll = (
  dependency: number,
  options: UseAutoScrollOptions = {},
) => {
  const { threshold = 50, behavior = "smooth" } = options;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const previousDependencyRef = useRef(dependency);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateShouldAutoScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      shouldAutoScrollRef.current = distanceFromBottom <= threshold;
    };

    updateShouldAutoScroll();
    container.addEventListener("scroll", updateShouldAutoScroll, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", updateShouldAutoScroll);
    };
  }, [threshold]);

  useEffect(() => {
    const container = containerRef.current;
    const previousDependency = previousDependencyRef.current;
    previousDependencyRef.current = dependency;

    if (!container) {
      return;
    }

    const wasNodeAdded = dependency > previousDependency;

    if (!wasNodeAdded) {
      return;
    }

    const hasOverflow = container.scrollHeight > container.clientHeight;

    if (!hasOverflow || !shouldAutoScrollRef.current) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  }, [behavior, dependency]);

  return containerRef;
};
