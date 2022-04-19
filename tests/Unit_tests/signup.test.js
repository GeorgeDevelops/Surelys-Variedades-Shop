
const request = require('supertest');
const { accountSchema } = require('../../models/accounts');
const mongoose = require('mongoose');

describe('Sign up routes', ()=>{
    let userTestSchema = new mongoose.Types.ObjectId().toHexString();
    let { server } = require('../../index');
    let user;
module.exports.user = user = {
        _id: userTestSchema,
        username: "adminTest",
        email: "admin@admin.test",
        password: "Q123456789",
        phone: '0000000000'
    }

    afterEach(()=>{ server.disable()})

    afterAll( async ()=>{
        console.log("afterAll");
        await accountSchema.deleteMany({});
    });

    describe('POST /', () => {
        it('should return a 400 status error if req.body is empty', async () => {
            const response = await request(server)
            .post('/api/signup')
            .send({ email: "test@test.test" });
            
            expect(response.status).toBe(400);
        });
    });

    describe('POST /', () => {

        it('should return a 200 status if request outcomes successfully', async () => {
            const response = await request(server)
            .post('/api/signup')
            .send(user);
            
            expect(response.status).toBe(200);
            expect('response.header.x-auth-token').toBeTruthy();
        });
    });

});