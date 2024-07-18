const { writeFile } = require('fs').promises;
const easyinvoice = require('easyinvoice');

const formatPrice = input => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });

    return formatter.format(input);
}

const generateInvoice = async (name, phoneNumber, address, city, prodName, prodPrice, randomCode, id) => {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        const localDate = `${year}-${month}-${day}`;
        const data = {
            apiKey: "free", // Please register to receive a production apiKey: https://app.budgetinvoice.com/register
            mode: "development", // Production or development, defaults to production   
            images: {
                // The logo on top of your invoice
                logo: "https://east.vc/wp-content/uploads/2020/01/hacktiv8-1.png",
            },
            // Your own data
            sender: {
                company: "Toko Kocak",
                address: "Jl. Jalan Sampai Kelar",
                zip: "SBY-06",
                city: "Surabaya",
                country: "Indonesia"
            },
            client: {
                company: name,
                phoneNumber: phoneNumber,
                address: address,
                zip: 'SBY-06',
                city: city,
                country: "Indonesia"
            },
            information: {
                // Invoice number
                number: `${new Date().getFullYear()}.${randomCode}`,
                // Invoice data
                date: `${localDate}`,
            },
            products: [
                {
                    quantity: 1,
                    description: prodName,
                    price: prodPrice
                }
            ],
            settings: {
                currency: "IDR",
                locale: "id-ID",    
            },
        };
        const result = await easyinvoice.createInvoice(data);
        await writeFile(`./invoices/invoice-${id}-${randomCode}.pdf`, result.pdf, 'base64');
    } catch (err) {
        throw err;
    }
}

module.exports = {
    formatPrice,
    generateInvoice
};