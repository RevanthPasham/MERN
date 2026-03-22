# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅         |
| < 1.0   | ❌         |

If you are using an unsupported version, upgrade to the latest release before reporting issues.

---

## Reporting a Vulnerability

If you discover a security vulnerability, **do not create a public GitHub issue**.

Instead, report it responsibly using one of the following methods:


Include the following details in your report:

* Description of the vulnerability
* Steps to reproduce
* Proof of concept (if possible)
* Potential impact
* Suggested fix (optional)

We will acknowledge your report within **48 hours**.

---

## Responsible Disclosure

We follow a responsible disclosure process:

1. You report the vulnerability privately.
2. We investigate and validate the issue.
3. A fix is developed and deployed.
4. The vulnerability is disclosed publicly after the patch is released.

Please allow reasonable time for us to address the issue before public disclosure.

---

## Security Practices

This project follows several security best practices:

* Password hashing using **bcrypt**
* Token-based authentication using **JWT**
* Environment variable management via **dotenv**
* Input validation using **Zod**
* Secure payment processing through **Razorpay**
* Secure database access with **PostgreSQL + Sequelize**

---

## Security Recommendations for Deployment

When deploying this backend:

* Always use **HTTPS**
* Store secrets in **environment variables**, never in source code
* Rotate API keys regularly
* Restrict database access to trusted IPs
* Enable rate limiting and request logging
* Keep dependencies updated

---

## Dependency Security

Run the following regularly:

```
npm audit
npm audit fix
```

or use automated tools like:

* GitHub Dependabot
* Snyk
* npm audit

---

## Acknowledgements

We appreciate security researchers who responsibly disclose vulnerabilities and help improve this project.
