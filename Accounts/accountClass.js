export default class Account {
    constructor(name, balance) {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new Error("Name must be a non-empty string");
        }
        if (typeof balance !== 'number' || balance < 0) {
            throw new Error("Balance must be a non-negative number");
        }
        this.name = name.trim();
        this.balance = balance;
        this.profit = 0;
        this.assets = new Map(); // Track multiple assets
        this.tradeHistory = []; // Optional: Track trade history
    }

    executeTrade(asset, action, amount) {
        if (amount <= 0) {
            throw new Error("Trade amount must be positive");
        }

        switch (action.toLowerCase()) {
            case 'buy':
                this.executeBuyTrade(asset, amount);
                break;
            case 'sell':
                this.executeSellTrade(asset, amount);
                break;
            default:
                throw new Error("Invalid trade action. Use 'buy' or 'sell'.");
        }
    }

    executeBuyTrade(asset, amount) {
        const tradeCost = amount * asset.currentPrice;

        if (this.balance < tradeCost) {
            throw new Error("Insufficient funds for this trade");
        }

        this.balance -= tradeCost;

        // Update asset tracking
        const currentAssetAmount = this.assets.get(asset) || 0;
        this.assets.set(asset, currentAssetAmount + amount);

        // Optional: Track trade history
        this.tradeHistory.push({
            type: 'buy',
            asset: asset,
            amount: amount,
            price: asset.currentPrice,
            timestamp: new Date()
        });

        asset.buyTokens(amount);
    }

    executeSellTrade(asset, amount) {
        const currentAssetAmount = this.assets.get(asset) || 0;

        if (amount > currentAssetAmount) {
            throw new Error("Insufficient asset balance for this trade");
        }

        const sellProceeds = amount * asset.currentPrice;
        this.balance += sellProceeds;

        // Update asset tracking
        this.assets.set(asset, currentAssetAmount - amount);

        // Optional: Track trade history
        this.tradeHistory.push({
            type: 'sell',
            asset: asset,
            amount: amount,
            price: asset.currentPrice,
            timestamp: new Date()
        });

        asset.sellTokens(amount);
    }

    calculateProfit(asset) {
        const boughtAmount = this.assets.get(asset) || 0;
        const currentValue = boughtAmount * asset.currentPrice;
        const originalCost = boughtAmount * asset.originalPrice;

        return currentValue - originalCost;
    }

    getTotalProfit() {
        let totalProfit = 0;
        for (const [asset, amount] of this.assets) {
            totalProfit += this.calculateProfit(asset);
        }
        return totalProfit;
    }

    getAvailableBalance() {
        return this.balance;
    }

    getAssetQuantity(asset) {
        return this.assets.get(asset) || 0;
    }

    getTradeHistory() {
        return this.tradeHistory;
    }
}