exports.calculateMargin = function calculateMargin(odds) {
    let margin = 0
    odds.forEach(odd => {
        margin += 1/odd
    })
    return margin
}