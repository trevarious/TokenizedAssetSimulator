export default class Helpers {
    simulateMarketTrend() {
        const trends = [-1, 0, 1];
        return trends[Math.floor(Math.random() * trends.length)];
    }

    calculateTradeProbability(marketTrend) {
        const baseProbability = 0.5;
        const trendMultipliers = { '-1': 0.3, '0': 0.5, '1': 0.7 };
        return baseProbability * trendMultipliers[marketTrend];
    }


    determineTrade(marketTrend) {
        const buyBias = {
            '-1': 0.3,  // bearish
            '0': 0.5,   // neutral
            '1': 0.7    // bullish
        };
        return Math.random() < buyBias[marketTrend] ? 'buy' : 'sell';
    }
    calculateTradeAmount(tradeType, currentPrice) {
        const baseVolume = 10;
        const volumeVariance = currentPrice / 100;
        const trendMultipliers = {
            'buy': { '-1': 0.5, '0': 1, '1': 1.5 },
            'sell': { '-1': 1.5, '0': 1, '1': 0.5 }
        };

        return Math.floor(
            baseVolume *
            trendMultipliers[tradeType][this.simulateMarketTrend()] *
            (1 + Math.random() * volumeVariance)
        );

    }
}