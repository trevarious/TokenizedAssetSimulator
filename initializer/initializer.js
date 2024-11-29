export default class Initializer {
    constructor(initialSupply, scalingFactor) {
        this.initialSupply = initialSupply;
        this.scalingFactor = scalingFactor;
    }
    initializePrice() {
        const initialPrice = Math.log(this.scalingFactor * this.initialSupply + 1).toFixed(2);
        this._logInitialState(initialPrice, this.initialSupply, this.scalingFactor)
        return Math.log(this.scalingFactor * this.initialSupply + 1);
    }
    initialize(bondingCurve, executor, activityManager, validator) {
        executor.init_bondToken(bondingCurve);
        activityManager.init_executor(executor);
    }
    _logInitialState(initialPrice, initialSupply, scalingFacor) {
        const initialPriceMessage = `Initial Price Of Token Launch is ${initialPrice} with a seed supply of ${initialSupply} and a  scaling factor of ${scalingFacor}`;
        console.log(initialPriceMessage);
        console.log(`Initial Token State:
        Price: $${this.currentPrice.toFixed(2)}
        Total Supply: ${this.totalSupply}
        Scaling Factor: ${this.scalingFactor}`);
    }
}