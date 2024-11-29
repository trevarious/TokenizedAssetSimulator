export default class Logger {
    constructor() {

    }
    logTradeDetails(tradeType, amount, oldSupply, oldPrice, newPrice, totalSupply, highestPrice) {
        console.log(`${tradeType} Operation:
      Amount: ${amount} tokens
      Supply: ${oldSupply} → ${totalSupply}
      Price: $${oldPrice.toFixed(2)} → $${newPrice.toFixed(2)}
      Highest Price: $${highestPrice.toFixed(2)}`);
    }
    logTotalTokensBurned(amount) {
        console.log(`Total Tokens Bured: ${amount}`);
    }
    logCurrentState(name, currentPrice, totalSupply, highestPrice, scalingFactor) {
        console.log(`Current State Of ${name}-\n\n\
            Current Price: ${currentPrice}\n
            Total Supply: ${totalSupply}\n
            Heighest Price: ${highestPrice}\n
            ScalingFactor: ${scalingFactor}\n\n`);
    }
    logTradeRunEnd() {
        console.log("Trade Run Complete!");
    }
    logAdjustedScalingFactor(action, scalingFactor) {
        console.log(`Scaling Factor Adjusted: 
            Action: ${action}
            New Factor: ${scalingFactor}`);
    }

}
