# Liquality Wallet SDK

---

You can use npm or yarn to install the Liquality SDK

```
npm install @liquality/wallet
```

Liquality Wallet API and SDK relies on Torus wallet tech for authentication. This significantly simplifies the onboarding experience and removes risk of key loss as users do not need to keep track of a seed phrase. Instead, authentication is handled by key shares that allow for easy recoverability without compromising security.

### This is how it works:

The keys are managed by creating shares of the private key via Shamir Secret Sharing.

**ShareNumberOne** Could be stored on the user's device, similarly to how you usually can store a private key or seed phrase on a hardware device.

**ShareNumberTwo** could be split across the Web3Auth network, only accessed by a OAuth provider login that the user owns. This could be Google SSO, or any of the other login providers that are currently supported (Facebook, Twitch, Discord)

**ShareNumberThree**
This share is a recovery share, which can be accessed through a users set password

---

Liquality SDK provides different levels of support for the auth and creation.

- Full flow is provided by a UI component that can be embedded and you get login flow + full recovery.

- Programmatic access: easy to use API for login and recovery but the integration with UI happens by the developer. This gives flexibility for any use case.

---

## Docs

For full documentation, please see https://docs.liquality.io/
