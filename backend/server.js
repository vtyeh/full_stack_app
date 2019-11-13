const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router()

// const dbRoute = 
//     "mongodb+srv://user-01:YFfm1dHTY5oSjj2s@cluster0-3rgkf.mongodb.net/test?retryWrites=true&w=majority"
const dbRoute = 
    "mongodb://localhost:27017/full_stack_app";

// connects our back end code with the database
const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
};

mongoose.connect(dbRoute, options)
    .catch((error)=> {throw(error)});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => 
    console.log('connected to the database'));

// bodyParser, parses the request body to be a readable json format (for logging)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// GET method: fetches are available data in our db
router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if(err) return res.json({success: false, error: err});
        return res.json({success:true,data:data});
    });
});

// UPDATE method: overwrites existing data in our db
router.post('/updateData', (req, res) => {
    const { id,update } = req.body;
    Data.findByIdAndUpdate(id, update, (err) => {
        if (err) return res.json({success:false, error:err});
        return res.json({success:true});
    });
});

// DELETE method: removes existing data in our db
router.delete('/deleteData', (req,res) => {
    const {id} = req.body;
    console.log("LOOK HERE");
    console.log(id);
    Data.findByIdAndRemove(id, (err) => {
        if(err) return res.send(err);
        return res.json({success: true});
    });
});

// CREATE method: adds new data in our db
router.post('/putData', (req,res) => {
    let data = new Data();
    const {id, message} = req.body;
    if ((!id && id !==0) || !message) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }

    data.message = message;
    data.id = id;
    data.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});
    
// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));


