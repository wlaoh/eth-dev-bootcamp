const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');

app.use(cors());
app.use(express.json());

const balances = {
  "449bd13a03a6078b1ab3eebe66385d031e384195": 100,
  "a95af7400ed6a46c5d03fe8ce109514aeef748ab": 50,
  "c001c7e7b215cffa1d851b610a94808310e7bd71": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
};

app.post("/send", (req, res) => {
  const { sender, recipient, signature, amount } = req.body;
  console.log(signature)
  msgHash = hashMessage(`Sender: ${sender}; Recipient: ${recipient}; Amount: ${amount};`)
  let sig = secp.secp256k1.Signature.fromDER(signature)
  sig = sig.addRecoveryBit(1)
  let senderKey = sig.recoverPublicKey(msgHash)
  if (secp.secp256k1.verify(sig, toHex(msgHash), senderKey.toHex())) {
    setInitialBalance(sender);
    setInitialBalance(recipient);
  
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(401).send({ message: 'Incorrect signature!'})
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
