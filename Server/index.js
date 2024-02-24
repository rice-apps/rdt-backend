//Database setup
const mongoose = require("mongoose");
const mongoDBURL = "mongodb+srv://tigerking:wphPpplcHRwNdv29@riceapps2020-21.ppsrv.gcp.mongodb.net/launchpad_2023";



mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


const start = async () => {
    try {
        await mongoose.connect(
            mongoDBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            const port = 3000
            const server = app.listen(port, () => {
                const addr = server.address();
                console.log(`🛸 Server listening at http://localhost:${addr.port}`);
            });
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
start()

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors'); //allows our client to access our server locally

const app = express();
app.use(bodyParser.json());
app.use(cors());

const Event = require('./models/Event')
const User = require('./models/User')
const Ticket = require('./models/Ticket')

// this will be your "database"
var database =[
    {
      "name": "Event 1",
      "date": "2024-02-15T00:00:00Z",
      "deadline": "2024-02-18T12:00:00Z",
      "description": "This is the first event",
      "price": [10.99, 15.99, 20.99],
      "startTime": "2024-02-20T18:00:00Z",
      "endTime": "2024-02-20T22:00:00Z",
      "location": "Venue A"
    },
    {
      "name": "Event 2",
      "date": "2024-03-15T00:00:00Z",
      "deadline": "2024-03-10T12:00:00Z",
      "description": "Another event happening next month",
      "price": [12.99, 18.99, 25.99],
      "startTime": "2024-03-15T19:30:00Z",
      "endTime": "2024-03-15T23:00:00Z",
      "location": "Venue B"
    },
    {
      "name": "Event 3",
      "date": "2024-04-10T00:00:00Z",
      "deadline": "2024-04-05T12:00:00Z",
      "description": "An event with a different location",
      "price": [8.99, 14.99, 19.99],
      "startTime": "2024-04-10T17:00:00Z",
      "endTime": "2024-04-10T21:30:00Z",
      "location": "Venue C"
    }
  ]

// TODO ROUTE #1 - Get all current events
// for admin to be able to see all events (past and future)
app.get("/getallevents", async (req, res, next) => {
    console.log("test1")
    const all_events = await Event.find();
    res.json(all_events);

});

// default for client - Rahul
app.get('/getallfutureevents', async (req, res, next) => {
    console.log("test2");
    const currentDate = new Date();

    //database is not printing
    console.log(database)
    const events = database.filter(event => new Date(event.date) >= currentDate);
    console.log(events)
    res.json(events);
    });

    




// TODO ROUTE #2 -> For Next Week 

    // For client to see their events
app.get('/getmytickets', async (req, res, next) => {
        console.log("test3");
        const tickets = await Ticket.find();
        res.json(tickets);
    });

// For the admin to get tickets - Tayten
app.get('/getattendees', async (req, res, next) => {
    try {
        const event = await Event.findOne({ name: req.body.name });
        if (event) {
            res.json(event.tickets);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        next(error); // Pass the error
    }

    });

//Get all users - Ashley
app.get('/getusers', async (req, res, next) => {
    console.log("test5");
    const users = await User.find();
    res.json(users);
});

// Get ticket -Neyida
app.get('/getticket', async (req, res, next) => {
    console.log("test5");
    const ticket = await Ticket.find();
    res.json(ticket);
});

// Get event- Rachel
app.get('/getevent', async (req, res, next) => {
    console.log("test6");
    const event = await Event.find();
    res.json(event);
});

    



    
// TODO ROUTE #2 - Add a new event

app.post("/addevent", async (req, res, next) => {
    try {
        const newEvent = new Event({
            name: req.body.name,
            date: req.body.date,
            deadline: req.body.deadline,
            description: req.body.description,
            price: req.body.price,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            location: req.body.location,
            photo: req.body.photo,
            seatingChart: req.body.seatingChart,
            openTo: req.body.openTo
        });

        await newEvent.save();
        res.status(201).json({newEvent: newEvent})
    } catch (error) {
        console.error("Error creating event: ", error);
        res.status(500).send(error.message);
    } 
});


// TODO ROUTE #3 - Remove an existing shopping item


app.delete("/remove", (req, res, next) => {
    let newData = database.filter(item => item.name != req.body.name)
    database = newData;
    res.json(database);
})


// TODO ROUTE #4 - Update an existing shopping item (harder)

app.put("/update", (req, res, next) => {
    console.log(req)
    //let newData = database
})

// TODO ROUTE #5 - Get shopping items that satisfy a condition/filter (harder)





module.exports = app;