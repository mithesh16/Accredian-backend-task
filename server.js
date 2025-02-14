const express= require('express')
const bodyParser = require('body-parser');
const cors=require('cors')
const refRoutes=require('./routes/referalRoutes')
const mysql = require('mysql');

const app=express()
app.use(cors({
    origin:'*'
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/ref', refRoutes);

const port=process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3000
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

