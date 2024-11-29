class Asset {
    constructor(initialPrice, initialSupply) {
        this.currentPrice = initialPrice;
        this.initialPrice = initialPrice;
        this.supply = initialSupply;
        this.marketCap = initialPrice * initialSupply;

        // Dynamic parameters
        this.volatility = 0.15;  // Base volatility
        this.marketSentiment = 0;  // Range: -1 to 1
        this.momentum = 0;  // Price momentum
        this.maxSupply = initialSupply * 10;  // Maximum supply cap

        // Market cycle parameters
        this.cyclePhase = 0;  // 0 to 2π
        this.cycleSpeed = 0.1;  // How fast market cycles move

        // External factors
        this.externalFactors = {
            regulatoryRisk: Math.random() * 0.2,
            adoptionRate: Math.random() * 0.3,
            competitorPressure: Math.random() * 0.15
        };

        this.history = [];
        this.metrics = {
            allTimeHigh: initialPrice,
            allTimeLow: initialPrice,
            volatilityHistory: [],
            averageReturn: 0
        };
    }

    updateDynamicK() {
        // K factor changes based on market conditions
        const supplySaturation = this.supply / this.maxSupply;
        const marketCycleFactor = Math.sin(this.cyclePhase);
        const sentimentImpact = this.marketSentiment * 0.2;

        return 0.1 * (1 - supplySaturation) +
            0.05 * marketCycleFactor +
            sentimentImpact;
    }

    updateMarketSentiment() {
        // Update market sentiment based on price performance and random events
        const randomShock = (Math.random() - 0.5) * 0.2;
        const momentumEffect = this.momentum * 0.3;
        const cyclicalEffect = Math.sin(this.cyclePhase) * 0.2;

        this.marketSentiment = Math.max(-1, Math.min(1,
            this.marketSentiment + randomShock + momentumEffect + cyclicalEffect
        ));
    }

    calculatePriceChange() {
        const k = this.updateDynamicK();
        const e = Math.E;

        // Base price movement
        let newPrice = this.initialPrice * Math.pow(e, k * this.supply);

        // Apply market sentiment
        newPrice *= (1 + this.marketSentiment * 0.1);

        // Apply external factors
        newPrice *= (1 - this.externalFactors.regulatoryRisk);
        newPrice *= (1 + this.externalFactors.adoptionRate);
        newPrice *= (1 - this.externalFactors.competitorPressure);

        // Add random volatility
        const volatilityFactor = 1 + (Math.random() - 0.5) * this.volatility;
        newPrice *= volatilityFactor;

        // Calculate momentum
        this.momentum = (newPrice - this.currentPrice) / this.currentPrice;

        return Math.max(0.01, newPrice); // Ensure price doesn't go below 0.01
    }

    updateMetrics() {
        this.metrics.allTimeHigh = Math.max(this.metrics.allTimeHigh, this.currentPrice);
        this.metrics.allTimeLow = Math.min(this.metrics.allTimeLow, this.currentPrice);

        // Calculate rolling volatility
        if (this.history.length > 1) {
            const returns = this.history.slice(-30).map((entry, i, arr) => {
                if (i === 0) return 0;
                return (arr[i].price - arr[i - 1].price) / arr[i - 1].price;
            });

            const volatility = Math.sqrt(returns.reduce((sum, ret) => sum + ret * ret, 0) / returns.length);
            this.metrics.volatilityHistory.push(volatility);
        }

        // Update average return
        if (this.history.length > 1) {
            const totalReturn = (this.currentPrice - this.initialPrice) / this.initialPrice;
            this.metrics.averageReturn = totalReturn / this.history.length;
        }
    }

    addSupply(amount) {
        const newSupply = Math.min(this.maxSupply, this.supply + amount);
        if (newSupply === this.maxSupply) {
            console.log("WARNING: Maximum supply cap reached!");
        }
        this.supply = newSupply;
    }

    simulateTime() {
        return setInterval(() => {
            // Update market cycle
            this.cyclePhase = (this.cyclePhase + this.cycleSpeed) % (2 * Math.PI);

            // Randomly adjust external factors
            Object.keys(this.externalFactors).forEach(factor => {
                this.externalFactors[factor] += (Math.random() - 0.5) * 0.05;
                this.externalFactors[factor] = Math.max(0, Math.min(1, this.externalFactors[factor]));
            });

            // Update market sentiment
            this.updateMarketSentiment();

            // Add random supply based on price and market conditions
            const supplyChange = Math.floor((Math.random() - 0.4) * 10 * (1 + this.marketSentiment));
            if (supplyChange > 0) this.addSupply(supplyChange);

            // Update price
            this.currentPrice = this.calculatePriceChange();
            this.marketCap = this.currentPrice * this.supply;

            // Store history and update metrics
            this.history.push({
                timestamp: new Date(),
                price: this.currentPrice,
                supply: this.supply,
                marketCap: this.marketCap,
                sentiment: this.marketSentiment
            });

            this.updateMetrics();
            this.display();
        }, 1000);
    }

    display() {
        console.log(`
Market Status:
--------------
Price: $${this.currentPrice.toFixed(2)}
Supply: ${this.supply.toLocaleString()}
Market Cap: $${this.marketCap.toLocaleString()}
Market Sentiment: ${(this.marketSentiment * 100).toFixed(1)}%

Key Metrics:
-----------
All-Time High: $${this.metrics.allTimeHigh.toFixed(2)}
All-Time Low: $${this.metrics.allTimeLow.toFixed(2)}
30-Day Volatility: ${(this.metrics.volatilityHistory[this.metrics.volatilityHistory.length - 1] * 100).toFixed(1)}%
Average Return: ${(this.metrics.averageReturn * 100).toFixed(1)}%

External Factors:
---------------
Regulatory Risk: ${(this.externalFactors.regulatoryRisk * 100).toFixed(1)}%
Adoption Rate: ${(this.externalFactors.adoptionRate * 100).toFixed(1)}%
Competitor Pressure: ${(this.externalFactors.competitorPressure * 100).toFixed(1)}%
        `);
    }

    getAnalytics() {
        const priceChange24h = this.history.length > 24
            ? (this.currentPrice - this.history[this.history.length - 24].price) / this.history[this.history.length - 24].price
            : 0;

        return {
            priceChange24h: priceChange24h * 100,
            marketCycle: {
                phase: (this.cyclePhase / (2 * Math.PI) * 360).toFixed(1) + "°",
                sentiment: this.marketSentiment,
                momentum: this.momentum
            },
            supplyMetrics: {
                circulatingSupply: this.supply,
                maxSupply: this.maxSupply,
                supplyUtilization: (this.supply / this.maxSupply * 100).toFixed(1) + "%"
            },
            performance: {
                allTimeHigh: this.metrics.allTimeHigh,
                allTimeLow: this.metrics.allTimeLow,
                averageReturn: this.metrics.averageReturn
            }
        };
    }
}

// Example usage:
const asset = new Asset(100, 1000);
const simulation = asset.simulateTime();

// Stop simulation after 1 minute
setTimeout(() => {
    clearInterval(simulation);
    console.log("\nFinal Analytics:", asset.getAnalytics());
}, 60000);