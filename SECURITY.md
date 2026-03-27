# 🔐 Security Policy

## 📌 Supported Versions

We actively maintain and provide security updates for:

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅ Yes     |
| < 1.0   | ❌ No      |

> ⚠️ Unsupported versions will not receive security patches. Upgrade immediately before reporting issues.

---

## 🚨 Reporting a Vulnerability

**Do NOT open public issues for security vulnerabilities.**

Report privately via:

- 📧 Email: security@yourdomain.com  
- 🔐 (Optional) PGP Key: [link to your public key]  
- 🛡️ (Optional) Bug bounty platform: HackerOne / Bugcrowd  

### 📋 Include in Your Report:
- Clear description of the vulnerability  
- Step-by-step reproduction  
- Proof of Concept (PoC)  
- Potential impact  
- Suggested fix (optional)  

### ⏱ Response SLA:
- Acknowledgement: within **48 hours**
- Initial assessment: within **3–5 days**

---

## 🧠 Severity Levels & Response Time

| Severity   | Example                          | Fix Timeline |
|------------|----------------------------------|-------------|
| Critical   | RCE, auth bypass, data breach    | 24–72 hrs   |
| High       | Sensitive data exposure          | 3–7 days    |
| Medium     | Privilege escalation             | 7–14 days   |
| Low        | Minor misconfigurations          | 14+ days    |

---

## 🔄 Responsible Disclosure

We follow a coordinated disclosure process:

1. Vulnerability is reported privately  
2. Issue is validated internally  
3. Fix is developed and tested  
4. Patch is released  
5. Public disclosure after resolution  

> ❗ Do not disclose vulnerabilities publicly before a fix is deployed.

---

## 🛡️ Core Security Practices

### 🔑 Authentication & Authorization
- Passwords hashed using **bcrypt (cost ≥ 12)**
- JWT:
  - Short-lived access tokens (≤ 15 minutes)
  - Refresh tokens required
  - Stored in **HTTP-only cookies**
- Role-based access control (RBAC)

---

### 🌐 Web Security Controls
- Strict **CORS policy** (whitelisted domains only)
- **CSRF protection** for state-changing requests
- Security headers via Helmet:
  - Content-Security-Policy (CSP)
  - X-Frame-Options
  - X-Content-Type-Options
- Input sanitization (prevent XSS, injection attacks)

---

### ⚡ Rate Limiting & Abuse Protection
- Authentication routes: **5 req/min/IP**
- API routes: **100 req/min/user**
- Brute-force protection enabled
- IP + user-based throttling

---

### 🗄️ Database Security
- Least-privilege database roles
- Sensitive data encryption (PII, tokens)
- Parameterized queries (prevent SQL injection)
- Query logging and anomaly detection

---

### 💳 Payment Security
- Payments processed via Razorpay
- All transactions verified via **server-side webhook**
- Signature validation required
- Never trust client-side payment confirmation

---

### 🔐 Secrets Management
- Secrets stored in **environment variables (dev only)**
- Production: use secret managers (AWS/GCP/Vault)
- No secrets in source code
- Regular key rotation enforced

---

## 🧪 Security Testing

We enforce continuous security testing:

- SAST (Static Analysis): ESLint security plugins  
- DAST (Dynamic Testing): OWASP ZAP  
- Dependency Scanning:
  ```bash
  npm audit
