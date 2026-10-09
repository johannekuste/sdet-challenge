# User Management API — Bugs Report

## BUG-001 — GET nonexistent user returns 500

**Endpoint:** `GET /{environment}/users/{email}`  
**Environments:** dev, prod

### Expected
`404 Not Found`

### Actual
`500 Internal Server Error`

### Reproduction
Request a user using an email that does not exist.

---

## BUG-002 — DELETE succeeds but returns 404

**Endpoint:** `DELETE /{environment}/users/{email}`  
**Environments:** dev, prod

### Expected
`204 No Content`

### Actual
`404 User Not Found`

### Additional observation
The user is removed successfully despite the API reporting that the user was not found.

---

## BUG-003 — Duplicate POST returns 500

**Endpoint:** `POST /{environment}/users`  
**Environments:** dev, prod

### Expected
`409 Conflict`

### Actual
`500 Internal Server Error`

### Reproduction
Create a user, then attempt to create another user using the same email address.

---

## BUG-004 — DELETE authentication is not enforced in dev

**Endpoint:** `DELETE /dev/users/{email}`  
**Environment:** dev

### Expected
`401 Unauthorized` when the `Authentication` header is missing or invalid.

### Actual
`204 No Content`

The user is deleted even when:

- the `Authentication` header is absent
- the supplied authentication token is invalid

### Environment comparison
The equivalent requests against `prod` correctly return `401`.

This also violates the documented expectation that dev and prod provide identical behavior.