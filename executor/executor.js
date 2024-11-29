export default class Executor {
    constructor() {

    }
    init_bondToken(bondingToken) {
        this.bondingToken = bondingToken;
    }
    buyTokens(amount) {
        this.bondingToken.buyTokens(amount);
    }
    sellTokens() {
        this.bondingToken.buyTokens(amount);
    }

}