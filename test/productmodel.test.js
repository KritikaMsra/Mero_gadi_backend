const Product = require('../models/productModel');
const mongoose = require("mongoose");
 
const url = 'mongodb://127.0.0.1:27017/finalnodedatabase_api';
 
beforeAll(async () =>{
    await mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
    })
})
 
afterAll(async () => {
    await mongoose.connection.close();
})
 
describe("product insert", async() =>{
    
    it('Insert', () => {
        const pp ={
            "pname":"Bicycle",
            "pdesc":"Its Robust",
            "pprice":100000,
            "discount":15,
            "availableStock":100,
            "brand":"Everest",
            "category":'chair',
            "onSale":true,
            "discountedAmount":5,
            "newPrice":555,
            "pBrand":'hhh',
            "productCode":7777,
            'sold':4
        } ;
        return Product.create(pp)
        .then((res) => {
            expect(res.pname).toEqual('Bicycle');
        })
    })
 
    
    it('update',async () => {
        const pname ={
                    'pname': 'Bike'
                } ;
        const status =await Product.updateOne({_id:Object('606c43e9666a4912207dc89e')},
        {$set : pname})

        expect(status.ok).toBe(1);
    });
 
    
    it('get', () => {
            return Product.findOne({_id:Object('606c43e9666a4912207dc89e')})
            expect(status.ok).toBe(1);
        });
 
    
    it('Delete', async() => {
        return Product.deleteOne({_id:Object('606c43e9666a4912207dc89e')})
            expect(status.ok).toBe(1);
    })
});