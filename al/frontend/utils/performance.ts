// Performance monitoring utilities
export class PerformanceMonitor {
  private static startTimes: Map<string, number> = new Map();
  private static metrics: Map<string, number[]> = new Map();

  static startTimer(label: string): void {
    this.startTimes.set(label, performance.now());
  }

  static endTimer(label: string): number {
    const startTime = this.startTimes.get(label);
    if (!startTime) {
      console.warn(`Timer '${label}' was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.startTimes.delete(label);

    // Store metric for averaging
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);

    // Log if duration is concerning (> 100ms)
    if (duration > 100) {
      console.warn(`⚠️ Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    } else {
      console.log(`✅ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  static getAverageTime(label: string): number {
    const times = this.metrics.get(label);
    if (!times || times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  static clearMetrics(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }
}

// React Native specific performance helpers
export const measureRender = (componentName: string) => {
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    if (duration > 16) { // 60fps = 16ms per frame
      console.warn(`⚠️ Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
    }
  };
};

// Network performance monitoring
export const measureNetworkRequest = async <T>(
  requestName: string,
  requestFn: () => Promise<T>
): Promise<T> => {
  PerformanceMonitor.startTimer(requestName);
  try {
    const result = await requestFn();
    return result;
  } finally {
    PerformanceMonitor.endTimer(requestName);
  }
};

// Memory usage monitoring (basic)
export const logMemoryUsage = () => {
  if (__DEV__) {
    // This is a basic implementation - in production you'd use a proper memory monitoring library
    console.log('📊 Memory usage check - consider implementing proper memory monitoring');
  }
};