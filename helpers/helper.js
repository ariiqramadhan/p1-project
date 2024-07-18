const formatPrice = input => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });

    return formatter.format(input);
}

module.exports = formatPrice;