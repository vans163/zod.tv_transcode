# zod.tv_transcode
Decentralized Video Transcoder

## To Run on local node
Step 1: Create account for the contract and deploy the contract.
```
npm install
near create_account --account_id id
near deploy --account_id id
```

Step 2:
modify src/settings.js line that sets the contractName. Set it to id from step 1.
```
const contractName = "contractId"; /* TODO: fill this in! */
```

Step 3:
Open src/index.html in your browser.
That's it!

