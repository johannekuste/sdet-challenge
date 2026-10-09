import { test, expect, APIRequestContext } from '@playwright/test';

const environment = process.env.TEST_ENV ?? 'dev';
const baseUrl = `http://localhost:3000/${environment}/users`

async function createUser(
    request: APIRequestContext,
    email: string
) {
    return request.post(baseUrl, {
        data:
        {
            name: 'Test User',
            email,
            age: 38
        }
    });
}

test.describe('POSITIVE TESTS', () => {
    test('GET (200) - Request users info', async ({ request }) => {
        const response = await request.get(baseUrl);

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(Array.isArray(body)).toBeTruthy();
    });

    test('POST (202) - Create new user', async ({ request }) => {
        const email = `user_${Date.now()}@email.com`;

        const response = await createUser(request, email);
        expect(response.status()).toBe(201);

        const body = await response.json();

        expect(body).toEqual({
            name: 'Test User',
            email,
            age: 38
        });
    });

    test('PUT (200) - Update user', async ({ request }) => {
        const email = `update_${Date.now()}@email.com`;

        await createUser(request, email);

        const response = await request.put(`${baseUrl}/${email}`,
            {
                data:
                {
                    name: 'Updated Test User',
                    email,
                    age: 53
                }
            }
        )

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toEqual({
            name: 'Updated Test User',
            email,
            age:53
        })
    });

    test('DELETE (204) - Delete user', async ({ request }) => {
        const email = `to_be_deleted_${Date.now()}@email.com`;

        await createUser(request, email);

        const response = await request.delete(
            `{$baseUrl}/{$email}`,
            {
                headers: { Authentication: 'mysecrettoken'}
            }
        );

        expect(response.status()).toBe(204);
    });
});

test.describe('NEGATIVE TESTS', () => {
    test('POST (400) - Invalid user data', async ({ request }) => {
        const response = await request.post(baseUrl, {
            data:
            {
                name: 'Invalid User',
                email: 'Invalid Email',
                age: 0
            }
        });

        expect(response.status()).toBe(400);
    });

    test('GET (404) - Wrong/user not found', async ({ request }) => {
        const response = await request.get(`${baseUrl}/wronguser@email.com`);

        expect(response.status()).toBe(404);
    });

    test('POST (409) - Duplicate email', async ({ request }) => {
        const email = `duplicate_${Date.now()}@email.com`;

        await createUser(request, email);

        const response = await createUser(request, email);

        expect(response.status()).toBe(409);
    });

    test('PUT (400) - Update not performed/invalid user data', async ({ request }) => {
        const email = `invalid_update_${Date.now()}@email.com`

        await createUser(request, email);

        const response = await request.put(`${baseUrl}/${email}`, {
            data:
            {
                name: 'Invalid Name',
                email: 'Invalid Email',
                age: 0
            }
        });

        expect(response.status()).toBe(400);
    });

    test('PUT (404) - Update not performed/User not found', async ({ request }) => {
        const email = `missing_user_${Date.now()}@email.com`;

        const response = await request.put(`${baseUrl}/${email}`, {
            data:
            {
                name: 'Missing User',
                email,
                age: 35
            }
        });

        expect(response.status()).toBe(404);
    });

    test('PUT (409) - Update not performed/Duplicated email', async ({ request }) => {
        const emailOne = `original_${Date.now()}@email.com`;
        const emailTwo = `new_${Date.now()}@email.com`;

        await createUser(request, emailOne);
        await createUser(request, emailTwo);

        const response = await request.put(`${baseUrl}/${emailTwo}`, {
            data:
            {
                name: 'Updated User',
                email: emailOne,
                age: 35
            }
        });

        expect(response.status()).toBe(409);
    });

    test('DELETE (401) - Authentication error', async ({ request }) => {
        const email = `auth_error_${Date.now()}@email.com`;

        await createUser(request, email);

        const response = await request.delete(`${baseUrl}/${email}`);

        expect(response.status()).toBe(401);
    });

    test('DELETE (401) - Invalid Authentication', async ({ request }) => {
        const email = `invalid_auth_${Date.now()}@email.com`;

        await createUser(request, email);

        const response = await request.delete(`${baseUrl}/${email}`, {
            headers: { Authentication: 'wrongToken'}
        });

        expect(response.status()).toBe(401);
    });

    test('DELETE (404) - User not found', async ({ request }) => {
        const email = `missing_${Date.now()}@email.com`;

        const response = await request.delete(`${baseUrl}/${email}`, {
            headers: { Authentication: 'mysecrettoken' }
        });

        expect(response.status()).toBe(404);
    });
});