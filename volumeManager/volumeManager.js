export default class VolumeManager {
    constructor(volumeWindow) {
        this.volumeWindow = volumeWindow;
        this.volumeHistory = [];
    }

    recordVolume(amount) {
        this.volumeHistory.push(amount);
        if (this.volumeHistory.length > this.volumeWindow) {
            this.volumeHistory.shift();
        }
    }
    calculateMovingAverage() {
        let totalVolume = this.volumeHistory.reduce((sum, volume) => sum + volume, 0);
        return totalVolume / this.volumeHistory.length;
    }
}