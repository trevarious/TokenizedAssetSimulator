export default class BurnManager {
    constructor(burnMultiplier) {
        this.burnMultiplier = burnMultiplier;
        this.totalTokensBurned = 0;
    }
    // Calculates the burn rate based on the trading volume
    calculateBurnRate(movingAverage, volumeHistoryArr) {
        let burnRate;
        if (volumeHistoryArr.length > 1) {
            const currentVolume = volumeHistoryArr[volumeHistoryArr.length - 1];

            if (currentVolume > movingAverage) {
                // More buys than average → increase burn
                burnRate = this.burnMultiplier + (currentVolume / movingAverage) * 0.02;
            } else {
                // More sells than average → decrease burn
                burnRate = this.burnMultiplier - (movingAverage / currentVolume) * 0.01;
            }
        }
        // Ensure the burn rate stays within a reasonable range
        burnRate = Math.max(0.01, Math.min(0.1, burnRate)); // Example range: between 1% and 10%

        return burnRate;
    }
    // Burn function: adjusts total supply based on burn rate
    burnTokens(movingAverage, volumeHistoryArr, totalSupply) {
        const burnRate = this.calculateBurnRate(movingAverage, volumeHistoryArr);
        const burnAmount = totalSupply * burnRate;
        this.totalTokensBurned += burnAmount;

        console.log(`Burning ${burnAmount.toFixed(2)} tokens at burn rate of ${burnRate.toFixed(2)}.`);
        return burnAmount;
    }
}