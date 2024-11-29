import ActivityManager from "./activityManager/activityManager";
import BurnManager from "./burnManager/burnManager";
import Calculate from "./priceManager/utils/calculateClass";
import VolumeManager from "./volumeManager/volumeManager";
import Initializer from "./initializer/initializer";
import Validator from "./validator/validator";
import Logger from "./logger/logger";
import PriceManager from "./priceManager/priceManager";
import Executor from "./executor/executor";

export default class TokenBondingCurve {

    constructor(name, initialSupply, maxPrice = 1000, maxHistory = 50, scalingFactor = 900, burnMultiplier = 0.05, volumeWindow = 150, {
        activityManager = new ActivityManager(),
        burnManager = new BurnManager(),
        volumeManager = new VolumeManager(),
        priceManager = new PriceManager(maxHistory, maxPrice, this.initializer.initializePrice(), this.logger),
        initializer = new Initializer(),
        validator = new Validator(),
        logger = new Logger(),
        executor = new Executor()
    }) {
        this.name = name;

        this.burnManager = burnManager;
        this.volumeManager = volumeManager;
        this.priceManager = priceManager;
        this.initializer = initializer;
        this.validator = validator;
        this.logger = logger;
        this.executor = executor;
        this.activityManager = activityManager

        this.validator.validateConstructorParams(initialSupply, maxHistory, scalingFactor);
        // Configuration constants
        this.initializer.initializeExecutorAndActivityManager(this.executor, this.activityManager);
        this.activityManager.startTradingActivity();
    }


    // Common functionality
    _processTrade(action, amount) {
        let burnedAmount = this.burnManager.burnTokens(this.volumeManager.volumeHistory, this.priceManager.totalSupply);
        this.priceManager.updatePrice(action, amount, burnedAmount);
        this.volumeManager.recordVolume(amount);

        this.logger.logTradeDetails(action === 'buy' ? 'BUY' : 'SELL', amount, oldSupply, oldPrice, newPrice);
    }

    buyTokens(amount) {
        this.validator.validateTradeAmount(amount);
        this._processTrade('buy', amount);
    }

    sellTokens(amount) {
        this.validator.validateTradeAmount(amount);
        this.validator.validateSellAmount(this.totalSupply, amount);
        this._processTrade('sell', amount);
    }

    getPriceHistory() {
        return [...this.priceManager.priceHistory];
    }

    getCurrentState() {
        this.logger.logCurrentState(this.name, this.currentPrice, this.totalSupply, this.priceManager.highestPrice, this.scalingFactor);
        return {
            currentPrice: this.currentPrice,
            totalSupply: this.totalSupply,
            highestPrice: this.highestPrice,
            scalingFactor: this.scalingFactor
        };
    }

    getTotalTokensBurned() {
        this.logger.logTotalTokensBurned(this.burnManager.totalTokensBurned);
        return this.burnManager.totalTokensBurned;
    }
}