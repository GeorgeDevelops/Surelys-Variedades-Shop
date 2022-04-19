
const request = require('supertest');
const { accountSchema } = require('./../../models/accounts');
const bcrypt = require('bcrypt');

describe("Test suite for authentication route", () => {
    let { server } = require('./../../index');

    afterAll( async ()=>{
        await accountSchema.deleteMany({});
    });

    afterEach(()=>{ server.disable()})
    
    describe("POST /", () => {
        it("should return a 400 status code if req.body is less than 2 values", async () => {
            const response = await request(server).post('/api/login').send({ });
            expect(response.status).toBe(400);
        });
    });

    describe("POST /", () => {
        it("should return a 404 status code if email or password are invalid", async () => {
            const response = await request(server).post('/api/login')
            .send({ 
                email: "test@test.test",
                password: "a123456789"
            });
            expect(response.status).toBe(404);
        });
    });

    describe("POST /", () => {
        it("should return a 200 status code if email or password are correct", async () => {
            const Salt = await bcrypt.genSalt(8);
            const password = await bcrypt.hash("A123456789", Salt);

            const obj = {
                email: "test@test.test",
                password: password
            };

            await accountSchema.collection.insertOne(obj);

            const response = await request(server).post('/api/login')
            .send({ 
                email: "test@test.test",
                password: "A123456789"
            });
            expect(response.status).toBe(200);
            expect('response.header.x-auth-token').toBeTruthy();
        });
    });
});