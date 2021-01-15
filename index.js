const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const config = require('./config');
const testAccounts = config.accountStructureExample;

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Base route to get bank name
app.get('/', (req, res) => {
    return res.json({
        message: `Welcome to ${config.bankName}`
    });
});

// App status to make sure things are up and running
app.get('/status', (req, res) => {
    return res.json({
        message: `App is running on port ${config.port}`
    });
});

// Fetch all of the account data
app.get('/accounts', (req, res) => {
    return res.json(testAccounts);
});

// Fetch account by owner id
app.get('/accounts/:id', (req, res) => {
    const id = Number(req.params.id);
    const userAccount = testAccounts.find(account => account.id === id);
    return res.json(userAccount);
});

app.post('/accounts/deposit', (req, res) => {
    const { id, amount } = req.body;
    const account = testAccounts.find(account => account.id === id);
    account.balance =  account.balance + amount;
    // Update account balance in a connected db
    return res.json(account);
});

app.post('/accounts/withdraw', (req, res) => {
    const { id, amount } = req.body;
    const account = testAccounts.find(account => account.id === id);
    if (account.accountType === 'checking' && account.checkingType === 'individual' && amount > 1000) {
        return res.json({
            message: `The withdrawal limit of an individual account is $1000. You tried to withdraw ${amount}`
        });
    } else if (account.balance < amount) {
        return res.json({
            message: `Insufficent funds in ${account.accountType} account. You tried to withdraw: ${amount}. Balance: ${account.balance}`
        });
    } else {
        account.balance = account.balance - amount;
        // Update account balance in a connected db
        return res.json(account)
    }
});

app.post('/accounts/transfer', (req, res) => {
    const { fromAccount, toAccount, amount } = req.body;
    const fromAcc = testAccounts.find(account => account.id === fromAccount);
    const toAcc = testAccounts.find(account => account.id === toAccount);
    if (fromAcc.balance < amount) {
        return res.json({
            message: `Insufficent funds in ${account.accountType} account. You tried to withdraw: ${amount}. Balance: ${account.balance}`
        });
    } else {
        fromAcc.balance = fromAcc.balance - amount;
        toAcc.balance = toAcc.balance + amount;
        // Update account balances in connected db
        return res.json({
            message: 'Success',
            fromAccount: `New balance for ${fromAcc.accountType} account number ${fromAccount} is ${fromAcc.balance}`,
            toAccount: `New balance for ${toAcc.accountType} account number ${toAccount} is ${toAcc.balance}`,
        });
    }
});

// Fetch account by owner firstname and lastname
app.get('/accounts/:firstname/:lastname', (req, res) => {
    const firstname = req.params.firstname.toLowerCase();
    const lastname = req.params.lastname.toLowerCase();
    const userAccounts = testAccounts.filter(account => account.owner.lastname === lastname && account.owner.firstname === firstname);
    return res.json(userAccounts);
});

app.listen(config.port, config.host, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log(`Server listening at ${config.host}:${config.port}`)
});

module.exports = app;