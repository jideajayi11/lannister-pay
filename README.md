# Lannister-Pay
A service that calculates transaction fee during an online payment based on pre-configured specs.

### API Endpoints

<table>
  <tr>
    <th>HTTP VERB</th>
    <th>ENDPOINT</th>
    <th>FUNCTIONALITY</th>
    <th>REQUEST BODY (eg.)</th>
  </tr>
	<tr>
		<td>POST</td>
		<td>/fees</td>
		<td>Create fee configuration spec</td>
		<td>{
  "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
}</td>
	</tr>
	<tr>
		<td>POST</td>
		<td>/compute-transaction-fee</td>
		<td>Compute the fee applicable to a transaction</td>
		<td>{
    "ID": 91203,
    "Amount": 5000,
    "Currency": "NGN",
    "CurrencyCountry": "NG",
    "Customer": {
        "ID": 2211232,
        "EmailAddress": "anonimized29900@anon.io",
        "FullName": "Abel Eden",
        "BearsFee": true
    },
    "PaymentEntity": {
        "ID": 2203454,
        "Issuer": "GTBANK",
        "Brand": "MASTERCARD",
        "Number": "530191******2903",
        "SixID": 530191,
        "Type": "CREDIT-CARD",
        "Country": "NG"
    }
}</td>
	</tr>
</table>

### API Deployment
[`APIs`](https://lannister-pay-jide.herokuapp.com/)

### Technologies
- NodeJS
- ExpressJS
- MongoDB
