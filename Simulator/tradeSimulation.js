// import Account from "./accountClass.js";
import TokenizedAssetBondingCurve from "../TokenizedAsset/tokenizedAsset.js";

// function simulateTokenTrading(initialBalance, initialPrice, numTrades) {
// Create a new token bonding curve
const tokenizedAsset = new TokenizedAssetBondingCurve();
console.log(tokenizedAsset.getPrice());

// // Create an account with initial balance
// const trader = new Account('Crypto Trader', initialBalance);

// // Trading simulation results
// const tradeResults = {
//     initialBalance: initialBalance,
//     finalBalance: 0,
//     trades: [],
//     finalState: null
// };

// Simulation strategy: Alternating buy and sell with random amounts
// for (let i = 0; i < numTrades; i++) {
//     try {
//         // Randomize trade amount and type
//         const tradeAmount = Math.floor(Math.random() * 10) + 1; // 1-10 tokens
//         const tradeType = i % 2 === 0 ? 'buy' : 'sell';

//         // Execute trade
//         if (tradeType === 'buy') {
//             // Ensure we have enough balance for buying
//             const currentPrice = tokenAsset.currentPrice;
//             const tradeCost = tradeAmount * currentPrice;

//             if (trader.balance >= tradeCost) {
//                 trader.executeTrade(tokenAsset, 'buy', tradeAmount);

//                 tradeResults.trades.push({
//                     type: 'buy',
//                     amount: tradeAmount,
//                     price: currentPrice,
//                     balanceAfter: trader.balance
//                 });
//             }
//         } else {
//             // Ensure we have enough tokens to sell
//             const currentTokens = trader.getAssetQuantity(tokenAsset);

//             if (currentTokens >= tradeAmount) {
//                 trader.executeTrade(tokenAsset, 'sell', tradeAmount);

//                 tradeResults.trades.push({
//                     type: 'sell',
//                     amount: tradeAmount,
//                     price: tokenAsset.currentPrice,
//                     balanceAfter: trader.balance
//                 });
//             }
//         }
//     } catch (error) {
//         // Log trade errors without stopping the simulation
//         console.error(`Trade error: ${error.message}`);
//     }
// }

// Capture final simulation state
//     tradeResults.finalBalance = trader.balance;
//     tradeResults.finalState = tokenAsset.getCurrentState();

//     return tradeResults;
// }

// Example usage
// function runTradingSimulation() {
//     const simulationResults = simulateTokenTrading(1000, 10, 20);
//     console.log('Simulation Results:', JSON.stringify(simulationResults, null, 2));
//     return simulationResults;
// }
// runTradingSimulation()