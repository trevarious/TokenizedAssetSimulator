import Helpers from "./Helpers"; d
export default class ActivityManager {
    constructor(tradeRun, logger) {
        this.helpers = new Helpers();
        this.logger = logger;
        this.TRADE_RUN = tradeRun;
    }
    init_executor(executor) {
        this.executor = executor;
    }
    startTradingActivity() {
        let tradeCount = 0;
        this.tradingInterval = setInterval(() => {
            if (tradeCount >= this.TRADE_RUN) {
                clearInterval(this.tradingInterval);
                this.logger.logTradeRunEnd();
                return;
            }
            const marketTrend = this.helpers.simulateMarketTrend();
            const tradeProbability = this.helpers.calculateTradeProbability(marketTrend);
            if (Math.random() < tradeProbability) {
                const tradeType = this.helpers.determineTrade(marketTrend);
                const tradeAmount = this.helpers.calculateTradeAmount(tradeType);
                tradeType === 'buy'
                    ? this.executor.buyTokens(tradeAmount)
                    : this.executor.sellTokens(tradeAmount);
            }
            tradeCount++;
        }, 100);
    }

}