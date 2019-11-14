const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const ML = require('./model');

const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
});

// Express routes

app.post('/predict', async (req, res) => {
    ML.predictValue(req.body.lng, req.body.lat).then((response) => {
        console.log(response);
        res.send(response);
    }).catch((error) => {
        res.error(error);
    })
    //ML.predictValue(req.body.lng, req.body.lat);
});