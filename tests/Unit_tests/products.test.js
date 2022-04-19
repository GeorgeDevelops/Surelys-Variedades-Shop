
const request = require('supertest');
const Product = require('./../../models/product');
const mongoose = require('mongoose');

describe("Products test suite", ()=>{
    const { server } = require('./../../index');
    const objs = [
        { name: "product #1"},
        { name: "product #2"},
        { name: "product #3"}
    ]

    afterEach(async ()=>{
        await Product.deleteMany({});
    });

    describe("GET /", ()=>{
        it("should return all products", async ()=>{
            objs.forEach(async o => await Product.collection.insertOne(o));
            const response = await request(server).get('/api/products');
            
            expect(response.statusCode).toEqual(200)
        });
    });

    describe("GET /", ()=>{
        it("should return a 404 status code if product ain't found", async ()=>{
            const obj = new Product({
                _id: new mongoose.Types.ObjectId(),
                name: "Product #1"
            });
        
            const response = await request(server)
            .get(`/api/products/${obj._id}`)
            .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVkN2ZlZWM2YTc2NjYwMjE0MzA4YjYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjUwMjk0NzY2fQ.2HTb49F3Vid0Ak9W1MC3lmlKKXRCGLaRz5vaOo3967s')
            
            expect(response.statusCode).toBe(404)
        });
    });

    describe("GET /", ()=>{
        it("should return a 200 status code if product is found", async ()=>{
            const obj = new Product({
                _id: new mongoose.Types.ObjectId(),
                name: "Product #1"
            });
            await Product.collection.insertOne(obj);
        
            const response = await request(server)
            .get(`/api/products/${obj._id}`)
            .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjVkN2ZlZWM2YTc2NjYwMjE0MzA4YjYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjUwMjk0NzY2fQ.2HTb49F3Vid0Ak9W1MC3lmlKKXRCGLaRz5vaOo3967s')
            
            expect(response.statusCode).toBe(200)
        });
    });
});