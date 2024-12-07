import TokenBondingCurve from "../TokenizedAssetSimulator/tokenizedAsset";

// Create token instance
let token = new TokenBondingCurve(100, 100);
let totalVolume = 0;

// Chart setup (your existing chart code)
let ctx = document.getElementById('priceChart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Token Price',
            borderColor: '#00ff00',
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            data: [{
                x: new Date(),
                y: token.getPrice()
            }],
            fill: true,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    displayFormats: {
                        second: 'HH:mm:ss'
                    }
                },
                title: {
                    display: true,
                    text: 'Time',
                    color: '#00ff00'
                },
                ticks: {
                    maxRotation: 0,
                    color: '#00ff00'
                },
                min: new Date(Date.now() - 30000),
                max: new Date(),
                grid: {
                    color: '#004400'
                }
            },
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Price ($)',
                    color: '#00ff00'
                },
                ticks: {
                    color: '#00ff00',
                    callback: function (value) {
                        return '$' + value.toFixed(2);
                    }
                },
                grid: {
                    color: '#004400'
                }
            }
        },
        animation: {
            duration: 0
        },
        plugins: {
            legend: {
                labels: {
                    color: '#00ff00'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return 'Price: $' + context.parsed.y.toFixed(2);
                    }
                }
            }
        }
    }
});

function addTradeRow(isBuy, amount, price, priceChange, percentChange) {
    const tradesContainer = document.getElementById('tradesContainer');
    const row = document.createElement('div');
    row.className = 'ticker-row';

    const time = new Date().toLocaleTimeString();
    const changeClass = priceChange >= 0 ? 'price-up' : 'price-down';
    const changeSymbol = priceChange >= 0 ? '▲' : '▼';

    totalVolume += amount;

    row.innerHTML = `
        <span class="ticker-symbol">TKN${isBuy ? ' BUY' : ' SELL'}</span>
        <span class="price">$${price.toFixed(2)}</span>
        <span class="change ${changeClass}">${changeSymbol} ${Math.abs(priceChange).toFixed(2)} (${Math.abs(percentChange).toFixed(2)}%)</span>
        <span class="volume">${amount}</span>
        <span class="timestamp">${time}</span>
    `;

    tradesContainer.insertBefore(row, tradesContainer.firstChild);

    // Keep only last 50 trades
    if (tradesContainer.children.length > 50) {
        tradesContainer.removeChild(tradesContainer.lastChild);
    }
}

function updateChart() {
    if (token.priceHistory.length > 0) {
        const latestData = token.priceHistory[token.priceHistory.length - 1];

        chart.data.datasets[0].data.push({
            x: latestData.time,
            y: latestData.price
        });

        const now = Date.now();
        chart.options.scales.x.min = new Date(now - 30000);
        chart.options.scales.x.max = new Date(now);

        chart.update('none');
    }
}

// Simulate trading
setInterval(() => {
    const isBuy = Math.random() < 0.5;
    const amount = Math.floor(Math.random() * 100) + 1;
    const oldPrice = token.currentPrice;

    if (isBuy) {
        token.buyTokens(amount);
    } else {
        token.sellTokens(amount);


    }

    const priceChange = token.currentPrice - oldPrice;
    const percentChange = (priceChange / oldPrice) * 100;

    addTradeRow(isBuy, amount, token.currentPrice, priceChange, percentChange);
    updateChart();
}, 100);