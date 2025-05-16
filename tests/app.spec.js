import request from 'supertest';
import app from '../server/app';


describe('Users API', () => {
    it('GET /users --> array of users', () => {
        return request(app)
                .get('/users')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(res.body)
                    .toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            email: expect.any(String)
                        })
                    ]));
                });
    });

    it('GET /users/id --> specific user by ID', () => {
        return request(app)
        .get('/users/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
            expect(res.body).toEqual(
                expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                email: expect.any(String)
            }));
        });
    });

    it('GET /users/id --> 404 if not found', () => {
        return request(app).get('/users/0').expect(404);
    });

    it('POST /users --> create user', () => {
        return request(app)
                .post('/users')
                .send({
                    name: 'John Doe',
                    email: '2M4iI@example.com'
                })
                .expect(201)
                .then(res => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                        id: expect.any(Number),
                        name: 'John Doe',
                        email: '2M4iI@example.com'
                    }));
                });;
    });

    it('POST /users --> validates request body', () => {
        return request(app)
                .post('/users')
                .send({
                    name: 123,
                })
                .expect(422);
    });

    it('PUT /users --> update user', () => {
        return request(app)
                .put('/users/1')
                .send({
                    name: 'John Doe 2',
                })
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                        id: expect.any(Number),
                        name: 'John Doe 2',
                        email: expect.any(String)
                    }));
                });
    });
})
