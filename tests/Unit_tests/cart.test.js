
const request = require('supertest');
const { accountSchema } = require('./../../models/accounts');
const Product = require('./../../models/product');
const mongoose = require('mongoose');

describe("Cart test suite", ()=>{
        const { server } = require('./../../index');

        afterEach( async ()=>{
            await accountSchema.deleteMany({});
            await Product.deleteMany({});
        });
    
    describe("GET /", ()=>{
        it("should return a 404 status code if account is not found.", async () => {
            const response = await request(server)
            .get('/api/cart/625df4299e8fb6f6ad784af5')
            .set('x-auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVkN2ZlZWM2YTc2NjYwMjE0MzA4YjYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjUwMjk0NzY2fQ.2HTb49F3Vid0Ak9W1MC3lmlKKXRCGLaRz5vaOo3967s')

            expect(response.statusCode).toBe(404);
        });
    });

    describe("GET /", ()=>{
        it("should return a 200 status code if account is found", async () => {
            const obj = new accountSchema({
                _id: new mongoose.Types.ObjectId(),
                username: "test",
                email: "test@test.test",
                password: "testing1!",
                phone: "0000000000",
                cart: [{ name: "item #1"}]
            });
            await accountSchema.collection.insertOne(obj);

            const response = await request(server)
            .get(`/api/cart/${obj._id}`)
            .set('x-auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVkN2ZlZWM2YTc2NjYwMjE0MzA4YjYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjUwMjk0NzY2fQ.2HTb49F3Vid0Ak9W1MC3lmlKKXRCGLaRz5vaOo3967s')
            
            expect(response.statusCode).toBe(200);
            expect(response.body[0]).toMatchObject(obj.cart[0])
        });
    });

    describe("PUT /", ()=>{
        it("should return a 404 status code if account is not found.", async () => {
            const obj2 = new mongoose.Types.ObjectId();

            const response = await request(server)
            .put(`/api/cart/new/${obj2}/${obj2}`)
            .set('x-auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVkN2ZlZWM2YTc2NjYwMjE0MzA4YjYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjUwMjk0NzY2fQ.2HTb49F3Vid0Ak9W1MC3lmlKKXRCGLaRz5vaOo3967s')
            
            expect(response.statusCode).toBe(404);
        });
    });

    describe("PUT /", ()=>{
        it("should return a 404 status code if product is not found.", async () => {
            const obj2 = new accountSchema({
                _id: new mongoose.Types.ObjectId(),
                username: "test",
                email: "test@test.test",
                password: "testing1!",
                phone: "0000000000",
                cart: []
            });
            await accountSchema.collection.insertOne(obj2);

            const obj = new mongoose.Types.ObjectId();

            const response = await request(server)
            .put(`/api/cart/new/${obj2._id}/${obj}`)
            .set('x-auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVkN2ZlZWM2YTc2NjYwMjE0MzA4YjYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjUwMjk0NzY2fQ.2HTb49F3Vid0Ak9W1MC3lmlKKXRCGLaRz5vaOo3967s')
            
            expect(response.statusCode).toBe(404);
        });
    });

    describe("PUT /", ()=>{
        it("should return a 200 status code if item is added to cart.", async () => {
            const obj = new Product({
                _id: new mongoose.Types.ObjectId(),
                name: "test",
                price: 1000,
                desc: "testing1!",
                stock: 10,
                category: ["category #1"],
                images: [{ name: "item #1"}]
            });
            await Product.collection.insertOne(obj);

            const obj2 = new accountSchema({
                _id: new mongoose.Types.ObjectId(),
                username: "test",
                email: "test@test.test",
                password: "testing1!",
                phone: "0000000000",
                cart: []
            });
            await accountSchema.collection.insertOne(obj2);

            const response = await request(server)
            .put(`/api/cart/new/${obj2._id}/${obj._id}`)
            .set('x-auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVkN2ZlZWM2YTc2NjYwMjE0MzA4YjYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjUwMjk0NzY2fQ.2HTb49F3Vid0Ak9W1MC3lmlKKXRCGLaRz5vaOo3967s')
            
            expect(response.statusCode).toBe(200);
        });
    });

    describe("DELETE /", ()=>{
        it("should return a 404 status code if user is not found.", async () => {
            const obj = new mongoose.Types.ObjectId();

            const response = await request(server)
            .delete(`/api/cart/delete/${obj}/${obj}`)
            .set('x-auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVkN2ZlZWM2YTc2NjYwMjE0MzA4YjYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjUwMjk0NzY2fQ.2HTb49F3Vid0Ak9W1MC3lmlKKXRCGLaRz5vaOo3967s')
            
            expect(response.statusCode).toBe(404);
        });
    });

    describe("DELETE /", ()=>{
        it("should return a 404 status code if product is not found.", async () => {
            const obj = new mongoose.Types.ObjectId();

            const response = await request(server)
            .delete(`/api/cart/delete/${obj}/${obj}`)
            .set('x-auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVkN2ZlZWM2YTc2NjYwMjE0MzA4YjYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjUwMjk0NzY2fQ.2HTb49F3Vid0Ak9W1MC3lmlKKXRCGLaRz5vaOo3967s')
            
            expect(response.statusCode).toBe(404);
        });
    });

    describe("DELETE /", ()=>{
        it("should return a 200 status code if item is deleted from cart.", async () => {
            const obj = new Product({
                _id: new mongoose.Types.ObjectId(),
                name: "test",
                price: 1000,
                desc: "testing1!",
                stock: 10,
                category: ["category #1"],
                images: [{ name: "item #1"}]
            });
            await Product.collection.insertOne(obj);

            const obj2 = new accountSchema({
                _id: new mongoose.Types.ObjectId(),
                username: "test",
                email: "test@test.test",
                password: "testing1!",
                phone: "0000000000",
                cart: [{_id: obj._id, name: "item #1"}]
            });
            await accountSchema.collection.insertOne(obj2);

            const response = await request(server)
            .delete(`/api/cart/delete/${obj2._id}/${obj._id}`)
            .set('x-auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVkN2ZlZWM2YTc2NjYwMjE0MzA4YjYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjUwMjk0NzY2fQ.2HTb49F3Vid0Ak9W1MC3lmlKKXRCGLaRz5vaOo3967s')
           
            expect(response.statusCode).toBe(200);
        });
    });
});