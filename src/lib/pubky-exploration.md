# Pubky API Exploration - Identity Birth

## Overview

Identity Birth in Pubky involves creating a new sovereign identity that can interact with the Pubky ecosystem.

## API Flow (from @synonymdev/pubky v0.6.0-rc.7)

### 1. Create Pubky Instance
```typescript
import { Pubky } from '@synonymdev/pubky';

const pubky = new Pubky();  // Mainnet with default relays
// OR
const pubky = Pubky.testnet();  // Local testnet
```

**What happens:**
- Initializes the facade with configured HTTP client
- Sets up PKARR relays (mainnet or testnet)
- No network calls yet

---

### 2. Generate Keypair (Local)
```typescript
import { Keypair } from '@synonymdev/pubky';

const keypair = Keypair.random();
```

**What happens:**
- Generates Ed25519 keypair locally
- No network calls
- This is the user's sovereign identity

**Access properties:**
```typescript
const publicKey = keypair.publicKey;  // PublicKey instance
const publicKeyStr = publicKey.z32();  // z-base-32 string
const secretKey = keypair.secretKey(); // Uint8Array (32 bytes)
```

---

### 3. Create Recovery File (Local, Optional)
```typescript
const passphrase = "correct horse battery staple";
const recoveryFile = keypair.createRecoveryFile(passphrase); // Uint8Array
```

**What happens:**
- Encrypts the secret key with the passphrase
- Creates a recovery file that can be saved/downloaded
- No network calls

**Recovery:**
```typescript
const recoveredKeypair = Keypair.fromRecoveryFile(recoveryFile, passphrase);
```

---

### 4. Create Signer (Local)
```typescript
const signer = pubky.signer(keypair);
```

**What happens:**
- Wraps the keypair in a Signer object
- Signer handles authentication operations
- No network calls

**Access signer properties:**
```typescript
const publicKey = signer.publicKey;  // PublicKey instance
const pkdns = signer.pkdns;          // PKDNS actor for DHT operations
```

---

### 5. Signup to Homeserver (Network - DHT + Homeserver)
```typescript
import { PublicKey } from '@synonymdev/pubky';

// Example homeserver public key
const homeserver = PublicKey.from(
  "8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo"
);

const session = await signer.signup(homeserver, signupToken);  // signupToken can be null
```

**What happens:**
1. **Publishes PKARR record to Mainline DHT:**
   - Maps publicKey → homeserver
   - Creates `_pubky` SVCB DNS record
   - Allows global resolution of user's homeserver

2. **Registers with Homeserver:**
   - Authenticates using the keypair
   - Creates a session with HTTP-only cookie
   - Homeserver now accepts requests from this identity

**Returns:**
- `session`: Session instance with storage access

**Throws:**
- `{ name: "AuthenticationError" }`: Bad/expired token
- `{ name: "RequestError" }`: Network/server errors
- `{ name: "PkarrError" }`: DHT publish failed

---

### 6. Verify Session
```typescript
// Access session info
const sessionInfo = session.info;
const userPublicKey = sessionInfo.publicKey;  // PublicKey instance
const userPubkyStr = userPublicKey.z32();     // z-base-32 string
const capabilities = sessionInfo.capabilities; // string[] like ["/pub/app/:rw"]

console.log("User:", userPubkyStr);
console.log("Caps:", capabilities);

// Session provides storage access
const storage = session.storage;
await storage.putText("/pub/example.com/hello.txt", "Hello, Pubky!");
```

**What happens:**
- Session contains immutable `SessionInfo`
- Session provides `storage` API for reading/writing data
- HTTP-only cookie automatically included in requests

---

## Complete Identity Birth Example

```typescript
import { Pubky, Keypair, PublicKey } from '@synonymdev/pubky';

// 1. Initialize
const pubky = new Pubky();

// 2. Generate keypair
const keypair = Keypair.random();
console.log("Public key:", keypair.publicKey.z32());

// 3. Create recovery file (optional but recommended)
const passphrase = "my secure passphrase";
const recoveryFile = keypair.createRecoveryFile(passphrase);
// Save recoveryFile to disk/download

// 4. Create signer
const signer = pubky.signer(keypair);

// 5. Signup to homeserver
const homeserver = PublicKey.from("8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo");

try {
  const session = await signer.signup(homeserver, null);

  // 6. Verify and use session
  console.log("Signup successful!");
  console.log("User:", session.info.publicKey.z32());
  console.log("Capabilities:", session.info.capabilities);

  // Can now use session.storage to read/write data
} catch (error) {
  const pubkyError = error as PubkyError;
  console.error(`Signup failed: ${pubkyError.name} - ${pubkyError.message}`);
}
```

---

## Data Flow for Visualization

### Step 1: Generate Keypair
- **Location:** Local Machine
- **Operation:** Cryptographic key generation
- **Data produced:**
  - Public Key (32 bytes, displayed as z32 string)
  - Secret Key (32 bytes, never displayed)
- **Visual:** Key icon appears on Local Machine node

### Step 2: Create Recovery File
- **Location:** Local Machine
- **Operation:** Encrypt secret key with passphrase
- **Data produced:**
  - Recovery File (Uint8Array, encrypted)
- **Visual:** Lock/file icon, download animation

### Step 3: Publish to DHT
- **Location:** Local → Mainline DHT
- **Operation:** PKARR publish (happens during signup)
- **Data produced:**
  - DNS-like record: `_pubky` SVCB pointing to homeserver
- **Visual:** Packet labeled "PKARR Record" animates from Local to DHT

### Step 4: Register with Homeserver
- **Location:** Local → Homeserver
- **Operation:** HTTP POST with signed authentication
- **Data produced:**
  - Session with HTTP-only cookie
  - Root capabilities
- **Visual:** Packet labeled "Signed Auth" animates from Local to Homeserver
- **Visual:** Cookie icon appears, session established

### Step 5: Identity Complete
- **Location:** All components
- **Visual:** Green checkmarks on DHT (record published) and Homeserver (session active)
- **Display:** Show public key, capabilities in side panel

---

## Architecture Components Involved

1. **Local Machine:** Keypair generation, recovery file creation, signing operations
2. **Mainline DHT (via PKARR):** Stores publicKey → homeserver mapping globally
3. **Homeserver:** Authenticates user, provides storage, manages sessions
4. **(Not in Identity Birth) Nexus:** Indexes content (used later for posts)
5. **(Not in Identity Birth) Applications:** pubky.app, eventky.app use the identity

---

## Error Cases

### DHT Publish Fails (PkarrError)
- **Cause:** Network issues, DHT unreachable, relay problems
- **Result:** Identity not globally resolvable
- **Recovery:** Retry signup, or use `signer.pkdns.publishHomeserverForce()`

### Homeserver Signup Fails (AuthenticationError)
- **Cause:** Invalid signup token, authentication failed
- **Result:** No session, can't store data
- **Recovery:** Check token, retry signup

### Homeserver Network Error (RequestError)
- **Cause:** Homeserver down, network timeout, bad response
- **Result:** No session created
- **Recovery:** Try different homeserver, retry later

### Invalid Input (InvalidInput)
- **Cause:** Malformed homeserver public key, invalid capabilities
- **Result:** Signup doesn't start
- **Recovery:** Validate inputs, fix and retry

---

## Key Differences from v0.5.4

1. **Facade Pattern:** `Pubky` class is now main entry point
2. **Signer Class:** Wraps keypair, handles auth operations
3. **Session Object:** Cleaner API with `info` and `storage` properties
4. **Error Handling:** Structured `PubkyError` with `name` property
5. **Recovery File:** Moved to `keypair.createRecoveryFile()` method
6. **Public Key:** Now accessed as `keypair.publicKey` (property, not method)

---

## Testing Considerations

All tests MUST mock network calls:
- Mock `signer.signup()` to return mock Session
- Mock DHT operations via `signer.pkdns`
- Never write to real DHT or homeservers
- Use `Pubky.testnet()` only in manual/integration tests (with local testnet running)

---

## Next Steps for Implementation

1. Create step definitions in `src/flows/identity-birth/steps.ts`:
   - Step 1: Generate Keypair
   - Step 2: Create Recovery File
   - Step 3: Signup (DHT + Homeserver)
   - Step 4: Verify Session

2. Write tests for step logic (TDD)

3. Create Pubky wrapper in `src/lib/pubky.ts` with mocking support

4. Implement UI visualizations for each step
