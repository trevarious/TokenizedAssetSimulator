export default class PriceManager {
    constructor(maxHistoryLength, maxPrice, initialPrice, scalingFactor, totalSupply, logger) {
        this.logger = logger
        this.MAX_HISTORY_LENGTH = maxHistoryLength;
        this.MAX_PRICE = maxPrice;
        this.priceHistory = []
        this.scalingFactor = scalingFactor;
        this.initialPrice = initialPrice;
        this.currentPrice = this.initialPrice;
        this.totalSupply = totalSupply;
        this.highestPrice = initialPrice;
        this.numberOfTokensAtHighestPrice = 0;
    }
    _calculatePrice() {
        return this.initialPrice + Math.log(this.scalingFactor * this.totalSupply + 1);
    }

    updatePrice(action, amount, burnAmount) {
        const oldPrice = this.currentPrice;
        const oldSupply = this.totalSupply;
        this.totalSupply += (action === 'buy' ? amount : -amount);
        this.totalSupply -= burnAmount;
        this.currentPrice = Math.min(this._calculatePrice(), this.MAX_PRICE);
        const priceChange = this.currentPrice - oldPrice;
        const percentChange = (priceChange / oldPrice) * 100;
        this._logPriceChange(priceChange, percentChange);
        this._adjustScalingFactor(action)
        this._updateHighestPrice(this.currentPrice);
        const newPrice = this.currentPrice;
        this.volumeManager.recordVolume(amount);

        this.logger.logTradeDetails(action === 'buy' ? 'BUY' : 'SELL', amount, oldSupply, oldPrice, newPrice);
        return this.currentPrice;

    }

    updatePriceHistory(currentPrice) {
        this.priceHistory.push({
            timestamp: new Date(),
            price: currentPrice
        });
        if (priceHistory > this.MAX_HISTORY_LENGTH) {
            priceHistory.shift();
        }
        return this.priceHistory;
    }
    _logPriceChange(priceChange, percentChange) {
        console.log(`Price Dynamics:
  Change: $${priceChange.toFixed(2)}
  Percent Change: ${percentChange.toFixed(2)}%`);
    }
    _updateHighestPrice(newPrice) {
        if (newPrice > this.highestPrice) {
            this.highestPrice = newPrice;
            this.numberOfTokensAtHighestPrice = this.totalSupply;
        }
    }
    _adjustScalingFactor(action) {
        const adjustment = action === 'buy' ? 1 : -1;
        this.scalingFactor += adjustment;
        this.logger.logAdjustedScalingFactor(action, scalingFactor)
    }


}