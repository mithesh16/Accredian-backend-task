const db=require('../models/db')
var voucher_codes = require('voucher-code-generator');
const nodemailer=require('nodemailer')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

require('dotenv').config()



const USER = 'mitheshsrini@gmail.com';
const PASS='tgtdfgkdmqhwyznu';


const transporter = nodemailer.createTransport({
    port: 465,               
    host: "smtp.gmail.com",
       auth: {
            user:USER,
            pass:PASS,
         },
    secure: true,
    });


exports.getRefs=async(req,res)=>{
    const refs=await prisma.referalcodes.findMany()
   res.json({refcodes:refs})
}

exports.addRef=async(req,res)=>{
    const {name,email,fname,femail}=req.body
    let alreadyexists=false
    const existingCode=await prisma.referalcodes.findMany({where:{email:email,femail:femail}, orderBy: {id: 'desc'},})
    if(existingCode.length>0){
        const today=new Date(); 
        const createdDate=existingCode[0].createdat;
        const threeDaysbefore=today.getDate()-3
        if((createdDate.getDate()>threeDaysbefore)){
            alreadyexists=true
        }
    }
    if(!alreadyexists){
        const newRefCode= voucher_codes.generate({
            length: 5,
            charset: voucher_codes.charset("alphanumeric")
        });
        const date=new Date()
        let day = date.getDate();
        let month = date.getMonth() ;
        let year = date.getFullYear();
        let now=`${year}-${month}-${day}`;
        const refdata = {
            name: name,
            email: email,
            fname: fname,
            femail: femail,
            refcode: newRefCode[0],
            used: 0,
            createdat: now
        }
          const query='INSERT INTO referalcodes SET ?'
        try{
        // const newCode=await prisma.referalcodes.create({data:refdata})
                          db.query(query,refdata,(err,result)=>{
                              if(err) throw err;
                              else {
                                  const email=sendEmail(refdata.refcode,femail)
                                   res.status(200).json({msg:'CodeAdded'});
                              }
                      })
        }
        catch(err){
            throw err
        }
    }
    else{
        res.status(200).json({msg:'Referral code already exists'});
    }
        
    }

exports.deleteRef=async(req,res)=>{
    console.log('Delete Ref')
}

exports.updateRefs=async(req,res)=>{
    console.log('update Ref')
}

function queryDatabase(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0]);
        });
    });
}

function sendEmail(refcode,email){
    const mailData = {
        from: 'mitheshsrini@gmail.com',  
          to: email,   
          subject: 'Accredian Referral Code',
          text: 'Hello world',
          html: `<b>Hey there! </b> <br> Please enter <b>${refcode}</b> as your referral code while signing up. <br/>`,
        };
        transporter.sendMail(mailData, function (err, info) {
            if(err)
              console.log(err)
            else
             return(info);
         });

}
