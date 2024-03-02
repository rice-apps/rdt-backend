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
const Ticket = require('./models/Ticket');
const Item = require("./models/Event");

// this will be your "database"
var database =[
    {
      "name": "Event1",
      "date": "2024-02-15T00:00:00Z",
      "deadline": "2024-02-18T12:00:00Z",
      "description": "This is the first event",
      "price": [10.99, 15.99, 20.99],
      "startTime": "2024-02-20T18:00:00Z",
      "endTime": "2024-02-20T22:00:00Z",
      "location": "Venue A"
    },
    {
      "name": "Event2",
      "date": "2024-03-15T00:00:00Z",
      "deadline": "2024-03-10T12:00:00Z",
      "description": "Another event happening next month",
      "price": [12.99, 18.99, 25.99],
      "startTime": "2024-03-15T19:30:00Z",
      "endTime": "2024-03-15T23:00:00Z",
      "location": "Venue B"
    },
    {
      "name": "Event3",
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

// For the admin to get attendees - Tayten
app.get('/getattendees', async (req, res, next) => {
        console.log("test4");
        //Need to filter by users that are going to events 
        const attendees = await User.find();
        res.json(attendees);
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

// Delete event - Timauri
app.delete("/remove", (req, res, next) => {
    //console.log(req.body)
    try {
    let newDatabase = database.filter(item => item.name != req.body.name)
    database = newDatabase
    console.log(newDatabase);
    res.json(database)
   
    } catch (error) {
        console.error(error);
    }
    });

// TODO ROUTE #4 - Update event by time/name 

app.put("/update", (req, res, next) => {
    console.log(req)
    //let newData = database
})

// TODO ROUTE #5 - Get shopping items that satisfy a condition/filter (harder)





module.exports = app;