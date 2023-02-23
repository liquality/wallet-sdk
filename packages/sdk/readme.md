# Liquality Wallet SDK

---

You can use npm or yarn to install the Liquality SDK

```
npm install @liquality/wallet-sdk
```

Authentication is handled by key shares that allow for easy recoverability without compromising security.

### This is how it works:

The keys are managed by creating shares of the private key via Shamir Secret Sharing.

**ShareNumberOne** Could be stored on the user's device, similarly to how you usually can store a private key or seed phrase on a hardware device.

**ShareNumberTwo** could be split across the Web3Auth network, only accessed by a OAuth provider login that the user owns. This could be Google SSO, or any of the other login providers that are currently supported (Facebook, Twitch, Discord)

**ShareNumberThree**
This share is a recovery share, which can be accessed through a users set password

---

## Demo site
To see examples of all of the SDK functions in a simple React demo site, please visit https://demo.liquality.io/
where the sourcecode can be found on https://github.com/liquality/liquality-sdk-demo 

## Docs

For full documentation, please see https://docs.liquality.io/
