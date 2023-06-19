const secp = require('ethereum-cryptography/secp256k1')
const { keccak256 } = require('ethereum-cryptography/keccak')
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils')

function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
  };

const privateKey = 'a95d8882b83bbc8e008edde60ab06ce4c014ee4f808379f1b0ee82a37fc443bf';
const address = '449bd13a03a6078b1ab3eebe66385d031e384195';
const recipient = 'a95af7400ed6a46c5d03fe8ce109514aeef748ab';
const sendAmount = '10';
const hashMsg = hashMessage(`Sender: ${address}; Recipient: ${recipient}; Amount: ${sendAmount};`)
const signature = secp.secp256k1.sign(hashMsg, privateKey);

sig = secp.secp256k1.Signature.fromDER("304402206bb4ac32a5b0b448e065e513c84e1ee7b6404e54ba873f3b77d26bfed72c25aa022014f1357cf96bdec030630bdc50201e059747513b4ff72d54af76a38709c64875")
sig = sig.addRecoveryBit(1)
derivedKey = sig.recoverPublicKey(hashMsg);
console.log(derivedKey.toHex())
console.log(secp.secp256k1.verify(signature, toHex(hashMsg), derivedKey.toHex()));