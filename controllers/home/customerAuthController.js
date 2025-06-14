const Customer = require('../../models/Customer')
const bcrypt = require('bcrypt')
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel')
const createToken = require('../../utils/tokenCreate')

const customer_register = async(req, res) => {
    // console.log(req.body);

    const {name, email, password} = req.body
    
    try {
        const customer = await Customer.findOne({email})
        if (customer) {
            res.status(404).json({error: 'Email Already Exist'})
        } else {
            const createCustomer = await Customer.create({
                name: name.trim(),
                email: email.trim(),
                password: await bcrypt.hash(password, 10),
                method: 'manually'
            })

            await sellerCustomerModel.create({
                myId: createCustomer.id
            })

            const token = await createToken({
                id: createCustomer.id,
                name: createCustomer.name,
                email: createCustomer.email,
                method: createCustomer.method
            })

            res.cookie('customerToken', token, {
                expires: new Date(Date.now() + 7*24*60*60*1000)
            })

            res.status(201).json({message: "User Register Success!!", token})
        }
    } catch (error) {
        console.log(error.message);
        
    }
}

const customer_login = async(req, res) => {
    // console.log(req.body);

    const {email, password} = req.body

    try {
        const customer = await Customer.findOne({email}).select("+password")
        if (customer) {
            const match = await bcrypt.compare(password, customer.password)
            if (match) {
                const token = await createToken({
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    method: customer.method
                })

                res.cookie('customerToken', token, {
                    expires : new Date(Date.now() + 7*24*60*60*1000)
                })

                res.status(200).json({message: 'User Login Sucess!!', token})
            } else {
                res.status(404).json({error: 'Password Wrong'})
            }
        } else {
            res.status(404).json({error: "Email not Found"})
        }
    } catch (error) {
        console.log(error.message);
        
    }
    
}

module.exports = {
    customer_register,
    customer_login
}