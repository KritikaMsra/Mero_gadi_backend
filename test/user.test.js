const User = require('../models/user_register_model');
const mongoose = require("mongoose");
 
const url = 'mongodb://127.0.0.1:27017/testingDB';
 
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
 

     describe('Reg', () =>{
it('User reg',()=>{
    const reg = {
        'fname':'pasish',
        'lname':'pandey',
        'address': 'kjbsdv',
        'phone_number': '823768',
        'username': 'ppas',
        'password': 'ppas',
        'email':'kjsdbvjk@gmail.com',
        'userType': 'Admin',
        'locationPoint':{
            "type":"Point",
            "coordinates":[23.23,24.55]
        }
    }
    return User.create(reg).then((res)=>{
        expect(res.username).toEqual('ppas')
    })
})
     
 
    
    it('Update', async() => {
        let user = await User.find({})
        const reg ={
                    'username': 'Tinker'
                } ;
        return User.findOneAndUpdate({_id:user[0]._id},
        {$set : reg})  
    });
 

    it('LOGIN', async () => {
        let user = await User.find({})
            return User.findOne({_id:user[0]._id})
            expect(status.ok).toBe(1);
        });
 
    
    it('user del', async() => {
        let user = await User.find({})
        return User.deleteOne({_id:user[0]._id})
            expect(status.ok).toBe(1);
    })
})