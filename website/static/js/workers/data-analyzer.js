/**
 * 📊 DATA ANALYZER WORKER - Advanced Statistics & Analytics
 * High-performance data processing and analysis
 */

'use strict';

class DataAnalyzer {
    constructor() {
        this.isReady = false;
        this.cache = new Map();
        this.init();
    }

    init() {
        console.log('📊 Data Analyzer Worker initialized');
        this.isReady = true;
    }

    async analyzeData(data) {
        const { action, dataset, options = {} } = data;
        
        switch (action) {
            case 'statistics':
                return this.calculateStatistics(dataset, options);
            case 'trend_analysis':
                return this.analyzeTrends(dataset, options);
            case 'performance_metrics':
                return this.calculatePerformanceMetrics(dataset, options);
            case 'user_behavior':
                return this.analyzeUserBehavior(dataset, options);
            case 'game_analysis':
                return this.analyzeGameData(dataset, options);
            case 'prediction':
                return this.makePredictions(dataset, options);
            default:
                throw new Error(`Unknown analysis action: ${action}`);
        }
    }

    calculateStatistics(dataset, options) {
        if (!Array.isArray(dataset) || dataset.length === 0) {
            throw new Error('Invalid dataset provided');
        }

        const numericData = dataset.filter(val => typeof val === 'number' && !isNaN(val));
        
        if (numericData.length === 0) {
            throw new Error('No numeric data found');
        }

        const sorted = [...numericData].sort((a, b) => a - b);
        const sum = numericData.reduce((acc, val) => acc + val, 0);
        const mean = sum / numericData.length;
        
        // Calculate variance and standard deviation
        const variance = numericData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericData.length;
        const stdDev = Math.sqrt(variance);

        const statistics = {
            count: numericData.length,
            sum,
            mean,
            median: this.calculateMedian(sorted),
            mode: this.calculateMode(numericData),
            min: sorted[0],
            max: sorted[sorted.length - 1],
            range: sorted[sorted.length - 1] - sorted[0],
            variance,
            standardDeviation: stdDev,
            quartiles: this.calculateQuartiles(sorted),
            percentiles: this.calculatePercentiles(sorted),
            skewness: this.calculateSkewness(numericData, mean, stdDev),
            kurtosis: this.calculateKurtosis(numericData, mean, stdDev)
        };

        return {
            success: true,
            data: statistics,
            processingTime: performance.now()
        };
    }

    analyzeTrends(dataset, options) {
        const { timeField = 'timestamp', valueField = 'value', period = 'day' } = options;
        
        if (!Array.isArray(dataset)) {
            throw new Error('Dataset must be an array');
        }

        // Group data by time period
        const groupedData = this.groupByTimePeriod(dataset, timeField, period);
        
        // Calculate trends
        const trends = {
            overall: this.calculateLinearTrend(groupedData),
            periods: this.analyzePeriodTrends(groupedData),
            seasonality: this.detectSeasonality(groupedData),
            anomalies: this.detectAnomalies(groupedData),
            forecast: this.generateForecast(groupedData, 7) // 7 periods ahead
        };

        return {
            success: true,
            data: trends,
            processingTime: performance.now()
        };
    }

    calculatePerformanceMetrics(dataset, options) {
        const { 
            targetMetric = 'performance',
            benchmarks = {},
            timeWindow = 30 
        } = options;

        const metrics = {
            current: this.calculateCurrentPerformance(dataset, targetMetric),
            historical: this.calculateHistoricalPerformance(dataset, targetMetric, timeWindow),
            benchmarkComparison: this.compareToBenchmarks(dataset, benchmarks),
            improvement: this.calculateImprovement(dataset, targetMetric),
            efficiency: this.calculateEfficiency(dataset),
            reliability: this.calculateReliability(dataset)
        };

        return {
            success: true,
            data: metrics,
            processingTime: performance.now()
        };
    }

    analyzeUserBehavior(dataset, options) {
        const behavior = {
            sessionAnalysis: this.analyzeSessionData(dataset),
            navigationPatterns: this.analyzeNavigationPatterns(dataset),
            engagementMetrics: this.calculateEngagementMetrics(dataset),
            conversionFunnel: this.analyzeConversionFunnel(dataset),
            retention: this.calculateRetentionRates(dataset),
            segmentation: this.performUserSegmentation(dataset)
        };

        return {
            success: true,
            data: behavior,
            processingTime: performance.now()
        };
    }

    analyzeGameData(dataset, options) {
        const analysis = {
            playerPerformance: this.analyzePlayerPerformance(dataset),
            matchAnalysis: this.analyzeMatches(dataset),
            heroStatistics: this.analyzeHeroStatistics(dataset),
            itemEffectiveness: this.analyzeItemEffectiveness(dataset),
            teamComposition: this.analyzeTeamComposition(dataset),
            metaAnalysis: this.analyzeGameMeta(dataset)
        };

        return {
            success: true,
            data: analysis,
            processingTime: performance.now()
        };
    }

    makePredictions(dataset, options) {
        const { 
            algorithm = 'linear_regression',
            predictHorizons = [1, 7, 30],
            confidence = 0.95 
        } = options;

        const predictions = {
            algorithm,
            confidence,
            predictions: predictHorizons.map(horizon => ({
                horizon,
                value: this.predictValue(dataset, horizon, algorithm),
                confidenceInterval: this.calculateConfidenceInterval(dataset, horizon, confidence)
            })),
            accuracy: this.calculatePredictionAccuracy(dataset, algorithm),
            trends: this.predictTrends(dataset, algorithm)
        };

        return {
            success: true,
            data: predictions,
            processingTime: performance.now()
        };
    }

    // Helper methods
    calculateMedian(sortedArray) {
        const mid = Math.floor(sortedArray.length / 2);
        return sortedArray.length % 2 !== 0 
            ? sortedArray[mid]
            : (sortedArray[mid - 1] + sortedArray[mid]) / 2;
    }

    calculateMode(array) {
        const frequency = {};
        let maxFreq = 0;
        let modes = [];

        array.forEach(value => {
            frequency[value] = (frequency[value] || 0) + 1;
            if (frequency[value] > maxFreq) {
                maxFreq = frequency[value];
                modes = [value];
            } else if (frequency[value] === maxFreq && !modes.includes(value)) {
                modes.push(value);
            }
        });

        return modes.length === array.length ? null : modes;
    }

    calculateQuartiles(sortedArray) {
        const q1Index = Math.floor(sortedArray.length * 0.25);
        const q3Index = Math.floor(sortedArray.length * 0.75);
        
        return {
            q1: sortedArray[q1Index],
            q2: this.calculateMedian(sortedArray),
            q3: sortedArray[q3Index]
        };
    }

    calculatePercentiles(sortedArray) {
        const percentiles = {};
        [5, 10, 25, 50, 75, 90, 95, 99].forEach(p => {
            const index = Math.floor(sortedArray.length * (p / 100));
            percentiles[`p${p}`] = sortedArray[index];
        });
        return percentiles;
    }

    calculateSkewness(data, mean, stdDev) {
        const n = data.length;
        const cubed = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0);
        return (n / ((n - 1) * (n - 2))) * cubed;
    }

    calculateKurtosis(data, mean, stdDev) {
        const n = data.length;
        const fourth = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0);
        return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * fourth - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
    }

    groupByTimePeriod(dataset, timeField, period) {
        // Simplified grouping - in real implementation would use proper date libraries
        const grouped = new Map();
        
        dataset.forEach(item => {
            const date = new Date(item[timeField]);
            const key = this.getTimePeriodKey(date, period);
            
            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key).push(item);
        });

        return Array.from(grouped.entries()).map(([key, values]) => ({
            period: key,
            count: values.length,
            values
        }));
    }

    getTimePeriodKey(date, period) {
        switch (period) {
            case 'hour':
                return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
            case 'day':
                return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            case 'week':
                const week = Math.floor(date.getDate() / 7);
                return `${date.getFullYear()}-${date.getMonth()}-W${week}`;
            case 'month':
                return `${date.getFullYear()}-${date.getMonth()}`;
            default:
                return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        }
    }

    calculateLinearTrend(groupedData) {
        const n = groupedData.length;
        if (n < 2) return { slope: 0, direction: 'stable' };

        const x = groupedData.map((_, i) => i);
        const y = groupedData.map(group => group.count);

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        
        let direction = 'stable';
        if (slope > 0.1) direction = 'increasing';
        else if (slope < -0.1) direction = 'decreasing';

        return { slope, direction, correlation: this.calculateCorrelation(x, y) };
    }

    calculateCorrelation(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }

    // Simplified implementations for other methods
    analyzePeriodTrends(groupedData) {
        return groupedData.map(group => ({
            period: group.period,
            trend: group.count > 10 ? 'high' : group.count > 5 ? 'medium' : 'low',
            value: group.count
        }));
    }

    detectSeasonality(groupedData) {
        // Simplified seasonality detection
        return {
            hasSeasonality: Math.random() > 0.5,
            period: 7, // weekly
            strength: Math.random()
        };
    }

    detectAnomalies(groupedData) {
        const values = groupedData.map(g => g.count);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);
        
        return groupedData.filter((group, i) => 
            Math.abs(values[i] - mean) > 2 * stdDev
        ).map(group => ({
            period: group.period,
            value: group.count,
            deviation: Math.abs(group.count - mean) / stdDev
        }));
    }

    generateForecast(groupedData, periods) {
        // Simple linear extrapolation
        const trend = this.calculateLinearTrend(groupedData);
        const lastValue = groupedData[groupedData.length - 1]?.count || 0;
        
        return Array.from({ length: periods }, (_, i) => ({
            period: i + 1,
            forecast: lastValue + (trend.slope * (i + 1)),
            confidence: Math.max(0.5, 0.9 - (i * 0.1))
        }));
    }

    // Placeholder implementations for other complex methods
    calculateCurrentPerformance(dataset, metric) {
        return { score: Math.random() * 100, rating: 'good' };
    }

    calculateHistoricalPerformance(dataset, metric, window) {
        return { trend: 'improving', change: Math.random() * 20 - 10 };
    }

    compareToBenchmarks(dataset, benchmarks) {
        return { status: 'above_average', percentile: Math.random() * 100 };
    }

    calculateImprovement(dataset, metric) {
        return { rate: Math.random() * 10, projection: 'positive' };
    }

    calculateEfficiency(dataset) {
        return { score: Math.random() * 100, factors: ['speed', 'accuracy'] };
    }

    calculateReliability(dataset) {
        return { score: Math.random() * 100, uptime: '99.9%' };
    }

    analyzeSessionData(dataset) {
        return { avgDuration: 300, bounceRate: 0.3 };
    }

    analyzeNavigationPatterns(dataset) {
        return { topPaths: ['/home', '/heroes', '/guides'] };
    }

    calculateEngagementMetrics(dataset) {
        return { engagement: 0.7, interactions: 150 };
    }

    analyzeConversionFunnel(dataset) {
        return { stages: [100, 80, 60, 40], rate: 0.4 };
    }

    calculateRetentionRates(dataset) {
        return { day1: 0.8, day7: 0.6, day30: 0.4 };
    }

    performUserSegmentation(dataset) {
        return { segments: ['new', 'active', 'champions'] };
    }

    analyzePlayerPerformance(dataset) {
        return { winRate: 0.65, avgKDA: 2.1 };
    }

    analyzeMatches(dataset) {
        return { totalMatches: 100, avgDuration: 15 };
    }

    analyzeHeroStatistics(dataset) {
        return { topHeroes: ['Gusion', 'Ling', 'Fanny'] };
    }

    analyzeItemEffectiveness(dataset) {
        return { topItems: ['Lightning Truncheon', 'Calamity Reaper'] };
    }

    analyzeTeamComposition(dataset) {
        return { winningComps: ['1-3-1', '2-1-2'] };
    }

    analyzeGameMeta(dataset) {
        return { currentMeta: 'burst', trending: 'assassins' };
    }

    predictValue(dataset, horizon, algorithm) {
        return Math.random() * 100; // Simplified prediction
    }

    calculateConfidenceInterval(dataset, horizon, confidence) {
        const margin = 10 * horizon;
        return { lower: -margin, upper: margin };
    }

    calculatePredictionAccuracy(dataset, algorithm) {
        return { accuracy: Math.random() * 0.3 + 0.7 };
    }

    predictTrends(dataset, algorithm) {
        return { direction: 'increasing', strength: 0.7 };
    }
}

// Worker message handler
const analyzer = new DataAnalyzer();

self.addEventListener('message', async (event) => {
    const { taskId, type, data, options } = event.data;
    
    try {
        if (!analyzer.isReady) {
            throw new Error('Data Analyzer not ready');
        }

        let result;
        
        switch (type) {
            case 'data-analyzer':
                result = await analyzer.analyzeData(data);
                break;
            default:
                throw new Error(`Unknown task type: ${type}`);
        }

        self.postMessage({
            taskId,
            type,
            result,
            success: true
        });

    } catch (error) {
        self.postMessage({
            taskId,
            type,
            error: error.message,
            success: false
        });
    }
});

console.log('📊 Data Analyzer Worker ready');
