class HealthFactor {
    constructor(borrowedValueUsd, liquidation_threshold = 50, liquidation_precision = 100) {
        this.borrowedValueUsd = borrowedValueUsd;
        this.liquidation_threshold = liquidation_threshold;
        this.liquidation_precision = liquidation_precision;
        this.mintedTokens = 0;
    }
    checkHealth() {
        let adjustedHealth = (this.borrowedValueUsd * this.liquidation_threshold) / this.liquidation_precision;
        let finalHealth = adjustedHealth / (this.mintedTokens + 1);
        console.log(finalHealth)
    }
    health() {
        let adjustedHealth = (this.borrowedValueUsd * this.liquidation_threshold) / this.liquidation_precision;
        let finalHealth = adjustedHealth / (this.mintedTokens + 1);
        return finalHealth;
    }
    borrow(amount) {
        this.mintedTokens += amount;
        let health = this.health();
        if (health < 1.03)
            console.log("Health is bad, you risk liquidation");
        if (health < 1) {
            throw new Error("You cannot borrow, please depoist more collateral");

        }
    }

}

const accountHealth = new HealthFactor(100);
accountHealth.checkHealth();
accountHealth.borrow(20);
accountHealth.checkHealth();
accountHealth.borrow(20);
accountHealth.checkHealth();
accountHealth.borrow(5);
accountHealth.checkHealth();
