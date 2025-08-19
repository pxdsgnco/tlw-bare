// Basic performance monitoring implementation
// This is a simplified version for the search modal

interface PerformanceTimer {
  (tags?: Record<string, string>): number;
}

class SimplePerformanceMonitor {
  startTimer(name: string): PerformanceTimer {
    const startTime = performance.now();
    
    return (tags?: Record<string, string>) => {
      const duration = performance.now() - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[PERF] ${name}:`, {
          duration: `${duration.toFixed(2)}ms`,
          tags
        });
      }
      
      return duration;
    };
  }

  recordAPICall(endpoint: string, method: string, duration: number, statusCode: number): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${method} ${endpoint}:`, {
        duration: `${duration.toFixed(2)}ms`,
        status: statusCode
      });
    }
  }
}

export const performanceMonitor = new SimplePerformanceMonitor();