function profitOrLossForOneTrade(trade) {
    let amt = (trade?.exitPrice - trade?.entryPrice) * trade?.quantity;
    if (trade?.action === "sell") {
        amt = amt * (-1)
    }
    return amt;
}

module.exports = {
    profitOrLossForOneTrade,
};