/**
 * TokenizedAssetBondingCurve: A simplified token system with dynamic price adjustment based on supply and demand.
 * @param {Object} options - Configuration for the token system
 */
export default class TokenBondingCurve {
    constructor(initialSupply = 100, initialPrice = 100, options = {}) {
        const {
            name = 'Token',
            maxPrice = 1000000,
            maxHistory = 2016,
            scalingFactor = 90
        } = options;

        // Initialize basic properties
        this.name = name;
        this.totalSupply = initialSupply;
        this.currentSupply = initialSupply;
        this.maxPrice = maxPrice;
        this.scalingFactor = scalingFactor;
        this.initialPrice = initialPrice;
        this.currentPrice = this._calculatePrice(initialSupply);
        this.priceHistory = [{
            time: new Date(),
            price: this.currentPrice
        }];
    }

    // Calculate token price based on supply and scaling factor
    _calculatePrice(s) {
        let k = this.scalingFactor;
        let p = this.initialPrice;
        let price = p + Math.log(k * s + 1);
        return Math.min(price, this.maxPrice); // Ensure price never exceeds maxPrice
    }

    // Process a trade (buy or sell)
    _processTrade(action, amount) {
        // Update total supply based on trade action
        if (action === 'buy') {
            this.totalSupply += amount;
            this.currentSupply += amount;
        } else if (action === 'sell') {
            if (this.totalSupply < amount) {
                throw new Error("Not enough tokens to sell");
            }
            this.totalSupply -= amount;
            this.currentSupply -= amount;
        }

        // Update the price
        const oldPrice = this.currentPrice;
        this.currentPrice = this._calculatePrice(this.totalSupply);

        // Record price history
        this.priceHistory.push({
            time: new Date(),
            price: this.currentPrice
        });

        // Maintain max history length
        if (this.priceHistory.length > 200) {
            this.priceHistory.shift();
        }

        return oldPrice;
    }

    // Buy tokens
    buyTokens(amount) {
        if (amount <= 0) {
            throw new Error("Amount to buy must be greater than 0");
        }
        return this._processTrade('buy', amount);
    }

    // Sell tokens
    sellTokens(amount) {
        if (amount <= 0) {
            throw new Error("Amount to sell must be greater than 0");
        }
        return this._processTrade('sell', amount);
    }

    // Get current token price
    getPrice() {
        return this.currentPrice;
    }
}