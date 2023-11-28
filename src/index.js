const express = require("express")
require("dotenv").config()
const fs = require("fs")
const app = express()
const cors = require("cors")
const crypto = require("crypto")

app.use(cors({
    origin: "http://localhost:5000",
    methods: "GET, POST, PUT, PATCH, DELETE"
}))

app.use(express.json())
const port = process.env.PORT  // || query.lastname || query.email || query.maobile
// || e.lastname.startsWith(query.lastname) || e.email.startsWith(query.email) || e.maobile.startsWith(query.maobile)

app.get('/getdata', function (req, res) {
    fs.readFile("json1.json", 'utf8', function (err, data) {
        try {
            res.send(data);
        }
        catch (parseError) {
            res.status(500).send("Internal Server Error");
            return;
        }
    });
})

app.post('/userdata', (req, res) => {
    var readfiledata = fs.readFileSync("json1.json", (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
    })
    try {
        var transfer_obj = JSON.parse(readfiledata)
        const body = {
            id: crypto.randomBytes(2).toString('hex'),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            maobile: req.body.mobile
        }
        body.id = crypto.randomBytes(2).toString('hex');
        transfer_obj.push(body);
        var newData2 = JSON.stringify(transfer_obj);
        fs.writeFile("json1.json", newData2, (err, data) => {
            if (err) {
                return err
            }
            res.send({ data: transfer_obj })
        })
    }
    catch {
        res.status(500).send("Internal Server Error");
    }
})

app.delete('/:id', (req, res) => {
    try {
        var readFile = fs.readFileSync('json1.json', "utf8", (err, data) => {
            if (err) {
                return res.status(500).send('Error reading file');
            }
        })
        var convertinobj = JSON.parse(readFile)
        const body = req.params.id
        const recordIndex = convertinobj.findIndex((e) => e.id === body);
        convertinobj.splice(recordIndex, 1);
        const newData = JSON.stringify(convertinobj, null, 2);
        fs.writeFileSync('json1.json', newData, 'utf8', (err, data) => {
            console.log(data)
        });
    }
    catch {
        console.log("Error ")
    }
})

app.get('/user/search', (req, res) => {
    const query = req.query

    var readFile = fs.readFileSync('json1.json', "utf8", (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
    })
    var convertObj = JSON.parse(readFile)
    if (Object.keys(query).length > 0) {

        if (query.firstname || query.lastname || query.email ) {
            const data1 = convertObj.filter(e => e.firstname.startsWith(query.firstname) || e.lastname.startsWith(query.lastname) || e.email.startsWith(query.email) )
            res.send(data1)

        }
        else {
            return res.status(400).send({ error: "Please give the correct query ex:- firstname, lastname" })

        }

    }
    else {

        res.send(convertObj)
    }
})

app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    var readFile = fs.readFileSync('json1.json', "utf8", (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
    })
    try {
        var transfer_obj = JSON.parse(readFile)

        const recordIndex = transfer_obj.findIndex((e) => e.id === id)
        if (recordIndex === -1) {
            return res.status(404).send('Item not found');
        }

        transfer_obj[recordIndex] = {
            id: id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile
        };
        fs.writeFileSync('json1.json', JSON.stringify(transfer_obj, null, 2), 'utf8', (err, data) => {
            console.log(data)
        });


        res.send({ data: transfer_obj });
        console.log("Id", id);
        console.log("Id", body);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error updating data');
    }
});

app.listen(port, function (error) {
    if (error) {
        console.log('Something went wrong', error);
    }
    else {
        console.log('Server is listening on port' + port);
    }
})