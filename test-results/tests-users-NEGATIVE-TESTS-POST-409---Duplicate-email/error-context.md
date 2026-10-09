# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/users.spec.ts >> NEGATIVE TESTS >> POST (409) - Duplicate email
- Location: tests/users.spec.ts:108:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 409
Received: 500
```

# Test source

```ts
  15  |             age: 38
  16  |         }
  17  |     });
  18  | }
  19  | 
  20  | test.describe('POSITIVE TESTS', () => {
  21  |     test('GET (200) - Request users info', async ({ request }) => {
  22  |         const response = await request.get(baseUrl);
  23  | 
  24  |         expect(response.status()).toBe(200);
  25  | 
  26  |         const body = await response.json();
  27  |         expect(Array.isArray(body)).toBeTruthy();
  28  |     });
  29  | 
  30  |     test('POST (202) - Create new user', async ({ request }) => {
  31  |         const email = `user_${Date.now()}@email.com`;
  32  | 
  33  |         const response = await createUser(request, email);
  34  |         expect(response.status()).toBe(201);
  35  | 
  36  |         const body = await response.json();
  37  | 
  38  |         expect(body).toEqual({
  39  |             name: 'Test User',
  40  |             email,
  41  |             age: 38
  42  |         });
  43  |     });
  44  | 
  45  |     test('PUT (200) - Update user', async ({ request }) => {
  46  |         const email = `update_${Date.now()}@email.com`;
  47  | 
  48  |         await createUser(request, email);
  49  | 
  50  |         const response = await request.put(`${baseUrl}/${email}`,
  51  |             {
  52  |                 data:
  53  |                 {
  54  |                     name: 'Updated Test User',
  55  |                     email,
  56  |                     age: 53
  57  |                 }
  58  |             }
  59  |         )
  60  | 
  61  |         expect(response.status()).toBe(200);
  62  | 
  63  |         const body = await response.json();
  64  | 
  65  |         expect(body).toEqual({
  66  |             name: 'Updated Test User',
  67  |             email,
  68  |             age:53
  69  |         })
  70  |     });
  71  | 
  72  |     test('DELETE (204) - Delete user', async ({ request }) => {
  73  |         const email = `to_be_deleted_${Date.now()}@email.com`;
  74  | 
  75  |         await createUser(request, email);
  76  | 
  77  |         const response = await request.delete(
  78  |             `{$baseUrl}/{$email}`,
  79  |             {
  80  |                 headers: { Authentication: 'mysecrettoken'}
  81  |             }
  82  |         );
  83  | 
  84  |         expect(response.status()).toBe(204);
  85  |     });
  86  | });
  87  | 
  88  | test.describe('NEGATIVE TESTS', () => {
  89  |     test('POST (400) - Invalid user data', async ({ request }) => {
  90  |         const response = await request.post(baseUrl, {
  91  |             data:
  92  |             {
  93  |                 name: 'Invalid User',
  94  |                 email: 'Invalid Email',
  95  |                 age: 0
  96  |             }
  97  |         });
  98  | 
  99  |         expect(response.status()).toBe(400);
  100 |     });
  101 | 
  102 |     test('GET (404) - Wrong/user not found', async ({ request }) => {
  103 |         const response = await request.get(`${baseUrl}/wronguser@email.com`);
  104 | 
  105 |         expect(response.status()).toBe(404);
  106 |     });
  107 | 
  108 |     test('POST (409) - Duplicate email', async ({ request }) => {
  109 |         const email = `duplicate_${Date.now()}@email.com`;
  110 | 
  111 |         await createUser(request, email);
  112 | 
  113 |         const response = await createUser(request, email);
  114 | 
> 115 |         expect(response.status()).toBe(409);
      |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  116 |     });
  117 | 
  118 |     test('PUT (400) - Update not performed/invalid user data', async ({ request }) => {
  119 |         const email = `invalid_update_${Date.now()}@email.com`
  120 | 
  121 |         await createUser(request, email);
  122 | 
  123 |         const response = await request.put(`${baseUrl}/${email}`, {
  124 |             data:
  125 |             {
  126 |                 name: 'Invalid Name',
  127 |                 email: 'Invalid Email',
  128 |                 age: 0
  129 |             }
  130 |         });
  131 | 
  132 |         expect(response.status()).toBe(400);
  133 |     });
  134 | 
  135 |     test('PUT (404) - Update not performed/User not found', async ({ request }) => {
  136 |         const email = `missing_user_${Date.now()}@email.com`;
  137 | 
  138 |         const response = await request.put(`${baseUrl}/${email}`, {
  139 |             data:
  140 |             {
  141 |                 name: 'Missing User',
  142 |                 email,
  143 |                 age: 35
  144 |             }
  145 |         });
  146 | 
  147 |         expect(response.status()).toBe(404);
  148 |     });
  149 | 
  150 |     test('PUT (409) - Update not performed/Duplicated email', async ({ request }) => {
  151 |         const emailOne = `original_${Date.now()}@email.com`;
  152 |         const emailTwo = `new_${Date.now()}@email.com`;
  153 | 
  154 |         await createUser(request, emailOne);
  155 |         await createUser(request, emailTwo);
  156 | 
  157 |         const response = await request.put(`${baseUrl}/${emailTwo}`, {
  158 |             data:
  159 |             {
  160 |                 name: 'Updated User',
  161 |                 email: emailOne,
  162 |                 age: 35
  163 |             }
  164 |         });
  165 | 
  166 |         expect(response.status()).toBe(409);
  167 |     });
  168 | 
  169 |     test('DELETE (401) - Authentication error', async ({ request }) => {
  170 |         const email = `auth_error_${Date.now()}@email.com`;
  171 | 
  172 |         await createUser(request, email);
  173 | 
  174 |         const response = await request.delete(`${baseUrl}/${email}`);
  175 | 
  176 |         expect(response.status()).toBe(401);
  177 |     });
  178 | 
  179 |     test('DELETE (401) - Invalid Authentication', async ({ request }) => {
  180 |         const email = `invalid_auth_${Date.now()}@email.com`;
  181 | 
  182 |         await createUser(request, email);
  183 | 
  184 |         const response = await request.delete(`${baseUrl}/${email}`, {
  185 |             headers: { Authentication: 'wrongToken'}
  186 |         });
  187 | 
  188 |         expect(response.status()).toBe(401);
  189 |     });
  190 | 
  191 |     test('DELETE (404) - User not found', async ({ request }) => {
  192 |         const email = `missing_${Date.now()}@email.com`;
  193 | 
  194 |         const response = await request.delete(`${baseUrl}/${email}`, {
  195 |             headers: { Authentication: 'mysecrettoken' }
  196 |         });
  197 | 
  198 |         expect(response.status()).toBe(404);
  199 |     });
  200 | });
```