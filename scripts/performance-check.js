#!/usr/bin/env node

/**
 * Performance Monitoring Script for Lagos Lifestyle Platform
 * 
 * This script runs automated performance checks and generates reports
 * with actionable insights and recommendations.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Performance budgets from configuration
const PERFORMANCE_BUDGETS = {
  performance: 85,
  accessibility: 90,
  bestPractices: 90,
  seo: 90,
  fcp: 1500,
  lcp: 2500,
  cls: 0.1,
  tti: 3000,
  tbt: 200
};

class PerformanceMonitor {
  constructor() {
    this.timestamp = new Date().toISOString();
    this.reportDir = path.join(__dirname, '..', 'performance-reports');
    this.ensureReportDir();
  }

  ensureReportDir() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  async runLighthouseAudit() {
    console.log('🚀 Running Lighthouse performance audit...');
    
    try {
      // Run Lighthouse audit
      const reportPath = path.join(this.reportDir, `lighthouse-${Date.now()}.json`);
      
      execSync(`npx lighthouse http://localhost:3000 \\
        --output=json \\
        --output-path=${reportPath} \\
        --only-categories=performance,accessibility,best-practices,seo \\
        --chrome-flags="--headless"`, { stdio: 'inherit' });
      
      return this.analyzeLighthouseReport(reportPath);
    } catch (error) {
      console.error('❌ Lighthouse audit failed:', error.message);
      throw error;
    }
  }

  analyzeLighthouseReport(reportPath) {
    console.log('📊 Analyzing performance results...');
    
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const categories = report.categories;
    const audits = report.audits;

    const metrics = {
      scores: {
        performance: categories.performance.score * 100,
        accessibility: categories.accessibility.score * 100,
        bestPractices: categories['best-practices'].score * 100,
        seo: categories.seo.score * 100
      },
      coreWebVitals: {
        fcp: audits['first-contentful-paint'].numericValue,
        lcp: audits['largest-contentful-paint'].numericValue,
        cls: audits['cumulative-layout-shift'].numericValue,
        tti: audits['interactive'].numericValue,
        tbt: audits['total-blocking-time'].numericValue,
        speedIndex: audits['speed-index'].numericValue
      },
      opportunities: this.extractOpportunities(audits),
      diagnostics: this.extractDiagnostics(audits)
    };

    return metrics;
  }

  extractOpportunities(audits) {
    const opportunities = [];
    
    // Check for common optimization opportunities
    const opportunityChecks = [
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'uses-optimized-images',
      'efficiently-encode-images',
      'offscreen-images',
      'unminified-css',
      'unminified-javascript'
    ];

    opportunityChecks.forEach(check => {
      if (audits[check] && audits[check].score < 1) {
        opportunities.push({
          id: check,
          title: audits[check].title,
          description: audits[check].description,
          score: audits[check].score,
          savings: audits[check].details?.overallSavingsMs || 0
        });
      }
    });

    return opportunities.sort((a, b) => b.savings - a.savings);
  }

  extractDiagnostics(audits) {
    const diagnostics = [];
    
    // Check for performance diagnostics
    const diagnosticChecks = [
      'mainthread-work-breakdown',
      'network-requests',
      'resource-summary',
      'largest-contentful-paint-element'
    ];

    diagnosticChecks.forEach(check => {
      if (audits[check] && audits[check].details) {
        diagnostics.push({
          id: check,
          title: audits[check].title,
          details: audits[check].details
        });
      }
    });

    return diagnostics;
  }

  generateReport(metrics) {
    console.log('📝 Generating performance report...');
    
    const report = {
      timestamp: this.timestamp,
      metrics,
      budgetStatus: this.checkBudgets(metrics),
      recommendations: this.generateRecommendations(metrics),
      summary: this.generateSummary(metrics)
    };

    // Save report
    const reportPath = path.join(this.reportDir, `performance-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate human-readable summary
    this.printSummary(report);
    
    return report;
  }

  checkBudgets(metrics) {
    const status = {};
    
    // Check score budgets
    Object.entries(PERFORMANCE_BUDGETS).forEach(([key, budget]) => {
      if (key in metrics.scores) {
        status[key] = {
          value: metrics.scores[key],
          budget,
          status: metrics.scores[key] >= budget ? 'PASS' : 'FAIL',
          difference: metrics.scores[key] - budget
        };
      } else if (key in metrics.coreWebVitals) {
        const value = metrics.coreWebVitals[key];
        status[key] = {
          value: Math.round(value),
          budget,
          status: value <= budget ? 'PASS' : 'FAIL',
          difference: Math.round(value - budget)
        };
      }
    });

    return status;
  }

  generateRecommendations(metrics) {
    const recommendations = [];

    // LCP recommendations
    if (metrics.coreWebVitals.lcp > PERFORMANCE_BUDGETS.lcp) {
      recommendations.push({
        priority: 'CRITICAL',
        title: 'Optimize Largest Contentful Paint',
        description: 'LCP is significantly above budget. Focus on image optimization and preloading critical resources.',
        actions: [
          'Preload LCP image with <link rel="preload">',
          'Optimize and compress images',
          'Use Next.js Image component instead of CSS backgrounds',
          'Implement responsive images with proper sizing'
        ]
      });
    }

    // Performance score recommendations
    if (metrics.scores.performance < PERFORMANCE_BUDGETS.performance) {
      recommendations.push({
        priority: 'HIGH',
        title: 'Improve Overall Performance Score',
        description: 'Performance score is below target. Address top opportunities.',
        actions: metrics.opportunities.slice(0, 3).map(opp => opp.title)
      });
    }

    // Add opportunity-based recommendations
    metrics.opportunities.slice(0, 5).forEach(opp => {
      if (opp.savings > 100) { // Only include if savings > 100ms
        recommendations.push({
          priority: opp.savings > 500 ? 'HIGH' : 'MEDIUM',
          title: opp.title,
          description: opp.description,
          actions: [`Implement ${opp.title.toLowerCase()}`]
        });
      }
    });

    return recommendations;
  }

  generateSummary(metrics) {
    const failedBudgets = Object.entries(this.checkBudgets(metrics))
      .filter(([_, status]) => status.status === 'FAIL')
      .length;

    return {
      overallStatus: failedBudgets === 0 ? 'PASS' : failedBudgets <= 3 ? 'WARNING' : 'FAIL',
      failedBudgets,
      topOpportunity: metrics.opportunities[0],
      performanceScore: metrics.scores.performance,
      criticalIssues: metrics.coreWebVitals.lcp > 5000 || metrics.coreWebVitals.tti > 10000
    };
  }

  printSummary(report) {
    console.log('\\n' + '='.repeat(60));
    console.log('📈 PERFORMANCE AUDIT SUMMARY');
    console.log('='.repeat(60));
    
    // Overall status
    const statusEmoji = {
      'PASS': '✅',
      'WARNING': '⚠️',
      'FAIL': '❌'
    };
    
    console.log(`\\n${statusEmoji[report.summary.overallStatus]} Overall Status: ${report.summary.overallStatus}`);
    console.log(`📊 Performance Score: ${report.metrics.scores.performance}/100`);
    
    // Core Web Vitals
    console.log('\\n🚀 Core Web Vitals:');
    Object.entries(report.metrics.coreWebVitals).forEach(([metric, value]) => {
      const budget = PERFORMANCE_BUDGETS[metric];
      const status = budget ? (value <= budget ? '✅' : '❌') : 'ℹ️';
      const displayValue = metric === 'cls' ? value.toFixed(3) : Math.round(value) + 'ms';
      console.log(`  ${status} ${metric.toUpperCase()}: ${displayValue}`);
    });

    // Budget status
    console.log('\\n💰 Budget Status:');
    Object.entries(report.budgetStatus).forEach(([key, status]) => {
      const emoji = status.status === 'PASS' ? '✅' : '❌';
      console.log(`  ${emoji} ${key}: ${status.value} (budget: ${status.budget})`);
    });

    // Top recommendations
    console.log('\\n🔧 Top Recommendations:');
    report.recommendations.slice(0, 3).forEach((rec, index) => {
      const priorityEmoji = {
        'CRITICAL': '🔴',
        'HIGH': '🟡',
        'MEDIUM': '🟢'
      };
      console.log(`  ${index + 1}. ${priorityEmoji[rec.priority]} ${rec.title}`);
    });

    console.log('\\n' + '='.repeat(60));
  }

  async run() {
    try {
      console.log('🎯 Starting performance monitoring...');
      
      const metrics = await this.runLighthouseAudit();
      const report = this.generateReport(metrics);
      
      // Exit with appropriate code
      process.exit(report.summary.overallStatus === 'FAIL' ? 1 : 0);
      
    } catch (error) {
      console.error('💥 Performance monitoring failed:', error.message);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.run();
}

module.exports = PerformanceMonitor;