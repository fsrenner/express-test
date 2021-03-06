module.exports = {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    bankName: 'Liberty Bank',
    accountStructureExample: [
        {
            id: 1,
            owner: {
                firstname: 'john',
                lastname: 'doe'
            },
            balance: 12345.54,
            accountType: 'checking',
            checkingType: 'individual', // Has a limit of 1000 dollars
        },
        {
            id: 2,
            owner: {
                firstname: 'jane',
                lastname: 'doe'
            },
            balance: 15345.54,
            accountType: 'checking',
            checkingType: 'money market',
        },
        {
            id: 3,
            owner: {
                firstname: 'john',
                lastname: 'doe'
            },
            balance: 15745.54,
            accountType: 'savings'
        }
    ]
};
