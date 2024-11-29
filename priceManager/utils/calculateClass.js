export default class Calculate {
    constructor() { }
    price(initialPrice, scalingFactor, totalSupply) {
        return initialPrice + Math.log(scalingFactor * totalSupply + 1);
    }

    // Calculate the moving average of the trading volume over the volume window
    volumeMovingAverage(volumeHistoryArr) {
        const totalVolume = volumeHistoryArr.reduce((sum, volume) => sum + volume, 0);
        return totalVolume / volumeHistoryArr.length;
    }

    // Calculates the burn rate based on the trading volume
    burnRate(movingAverage, volumeHistoryArr, burnMultiplier) {
        const movingAverage = this._calculateVolumeMovingAverage();
        let burnRate;

        // Increase burn multiplier if the buy volume is high relative to the moving average
        if (volumeHistoryArr.length > 1) {
            const currentVolume = this.volumeHistory[volumeHistoryArr.length - 1];

            if (currentVolume > movingAverage) {
                // More buys than average → increase burn
                burnRate = burnMultiplier + (currentVolume / movingAverage) * 0.02;
            } else {
                // More sells than average → decrease burn
                burnRate = burnMultiplier - (movingAverage / currentVolume) * 0.01;
            }
        }
        // Ensure the burn rate stays within a reasonable range
        burnRate = Math.max(0.01, Math.min(0.1, burnRate)); // Example range: between 1% and 10%

        return burnRate;
    }
    initialPrice(initialSupply, scalingFactor) {
        const initialPrice = Math.log(scalingFactor * initialSupply + 1).toFixed(2);
        const initialPriceMessage = `Initial Price Of Token Launch is ${initialPrice} with a seed supply of ${initialSupply} and a  scaling factor of ${scalingFactor}`;
        console.log(initialPriceMessage);
        return Math.log(scalingFactor * initialSupply + 1);
    }

    tradeProbability(marketTrend) {
        const baseProbability = 0.5;
        const trendMultipliers = { '-1': 0.3, '0': 0.5, '1': 0.7 };
        return baseProbability * trendMultipliers[marketTrend];
    }
    tradeAmount(tradeType, currentPrice) {
        const baseVolume = 10;
        const volumeVariance = currentPrice / 100;
        const trendMultipliers = {
            'buy': { '-1': 0.5, '0': 1, '1': 1.5 },
            'sell': { '-1': 1.5, '0': 1, '1': 0.5 }
        };

        return Math.floor(
            baseVolume *
            trendMultipliers[tradeType][this._simulateMarketTrend()] *
            (1 + Math.random() * volumeVariance)
        );
    }
}