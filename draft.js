

constructor(name = 'Bitcoin', initialSupply = 9000000, maxPrice = 21000000, maxHistory = 2016, scalingFactor = 900, burnMultiplier = 0.03, volumeWindow = 2016, {
    activityManager = new ActivityManager(),
    burnManager = new BurnManager(),
    volumeManager = new VolumeManager(volumeWindow),
    priceManager = new PriceManager(maxHistory, maxPrice, this.initializer.initializePrice(), this.logger),
    initializer = new Initializer(),
    validator = new Validator(),
    logger = new Logger(),
    controller = new Controller()
}) {
    this.name = name;

    this.burnManager = burnManager;
    this.volumeManager = volumeManager;
    this.priceManager = priceManager;
    this.initializer = initializer;
    this.validator = validator;
    this.logger = logger;
    this.controller = controller;
    this.activityManager = activityManager;

    // Ensure we avoid runtime errors by validating our Token's constructor parameters
    this.validator.validateConstructorParams(initialSupply, maxHistory, scalingFactor);

    /**
     * @dev initializeTokenSubClasses function serves two purposes:
     *      1. Ensure executor class has the correct instance of token class
     *      2. Ensure activityManager has the correct instance of ececutor class
     * 
     * @notice That way executor can call this.buy and this.sell on behalf of other subclasses...
     * @notice and that activity manager can hold record of both executor activity and this(token) acivity
    */
    this.initializer.initializeTokenSubClasses(this.executor, this.activityManager);

    /**
     * @dev Ensures volume is always present in the token in a manner that...
     * @dev accurately mimics market conditions and participants.
     * 
     * @notice Begins internal function to simulate market activity with volume that runs for MAX_RUNS
     */

    this.activityManager.startTradingActivity();
}
