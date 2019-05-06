function newNonce() { return nacl.randomBytes(nacl.box.nonceLength); }

//export const generateKey = () => nacl.encodeBase64(nacl.randomBytes(nacl.box.keyLength));

var acc1 = {"public_key":"PjghzUtpzhXHra5YH4LyqsLZUVVixQjbBqVptCfNHc3","secret_key":"44zsbWT9Xk1RjJysfZaZ1qF8CpGQQ8yLP8Xk4ydqZ6GdGfiHPm5u7VbiUZRSiPkWwQAjJWpebcQZ1V58PTbPnHt3","account_id":"zod_tv3"}
var acc2 = {"public_key":"CNDyTgAxZ9iGfM9317PejABm1UymhiVwyf87Btsq9SKh","secret_key":"4r1CxsiMsrQ1ZQsZhCWRdwBQEqd9Uo5yyQQFmoCxnwxgDEUC1dDtCKARcfR81BDacU6N7tXtF1vUfrJ9WYP2p5EP","account_id":"zod_tv4"}
acc1["publicKeyX25519"] = ed2curve.convertPublicKey(Base58.decode(acc1.public_key));
acc1["secretKeyX25519"] = ed2curve.convertSecretKey(Base58.decode(acc1.secret_key));
acc2["publicKeyX25519"] = ed2curve.convertPublicKey(Base58.decode(acc2.public_key));
acc2["secretKeyX25519"] = ed2curve.convertSecretKey(Base58.decode(acc2.secret_key));
console.log(acc1);
console.log(acc2);

/*
const message = "this is a test";
console.log(message);
const key1 = nacl.box.keyPair();
console.log(key1);
const key2 = nacl.box.keyPair();
console.log(key2);
var nonce = newNonce();
console.log(nonce);
var boxed = nacl.box((new TextEncoder()).encode(message), nonce, key1.publicKey, key2.secretKey)
console.log(boxed);

var unboxed = nacl.box.open(boxed, nonce, key2.publicKey, key1.secretKey)
console.log((new TextDecoder()).decode(unboxed));
*/

/*
const message = "this is a test2";
console.log(message);
var nonce = newNonce();
console.log(nonce);
var boxed = nacl.box((new TextEncoder()).encode(message), nonce, acc1.publicKeyX25519, acc2.secretKeyX25519)
console.log(boxed);

var unboxed = nacl.box.open(boxed, nonce, acc2.publicKeyX25519, acc1.secretKeyX25519)
console.log((new TextDecoder()).decode(unboxed));
*/




const message = "this is a test3";
console.log(message);
var nonce = newNonce();
console.log(nonce);
var shared_secret_1 = nacl.box.before(acc1.publicKeyX25519, acc2.secretKeyX25519)
console.log(shared_secret_1);
var shared_secret_2 = nacl.box.before(acc2.publicKeyX25519, acc1.secretKeyX25519)
console.log(shared_secret_2);
var boxed = nacl.box.after((new TextEncoder()).encode(message), nonce, shared_secret_2)
console.log(boxed);

var unboxed = nacl.box.open.after(boxed, nonce, shared_secret_1)
console.log((new TextDecoder()).decode(unboxed));







/*
export const encrypt = (json, key) => {
  const keyUint8Array = decodeBase64(key);

  const nonce = newNonce();
  const messageUint8 = decodeUTF8(JSON.stringify(json));
  const box = secretbox(messageUint8, nonce, keyUint8Array);

  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

export const decrypt = (messageWithNonce, key) => {
  const keyUint8Array = decodeBase64(key);
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    secretbox.nonceLength,
    messageWithNonce.length
  );

  const decrypted = secretbox.open(message, nonce, keyUint8Array);

  if (!decrypted) {
    throw new Error("Could not decrypt message");
  }

  const base64DecryptedMessage = encodeUTF8(decrypted);
  return JSON.parse(base64DecryptedMessage);
};*/
/*
const key = generateKey();
const obj = { "hello": "world" };
const encrypted = encrypt(obj, key);
const decrypted = decrypt(encrypted, key);
console.log(decrypted, obj); // should be shallow equal*/