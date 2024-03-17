//Database setup
const mongoose = require("mongoose");
const mongoDBURL = "mongodb+srv://tigerking:wphPpplcHRwNdv29@riceapps2020-21.ppsrv.gcp.mongodb.net/rdt";

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

// this will be your "database"
const database =[
    {
      "name": "Event1",
      "date": "2024-02-15T00:00:00Z",
      "deadline": "2024-02-18T12:00:00Z",
      "description": "This is the first event",
      "price": [10.99, 15.99, 20.99],
      "startTime": "2024-02-20T18:00:00Z",
      "endTime": "2024-02-20T22:00:00Z",
      "location": "Venue A",
      "id": "1"
    },
    {
      "name": "Event2",
      "date": "2024-03-15T00:00:00Z",
      "deadline": "2024-03-10T12:00:00Z",
      "description": "Another event happening next month",
      "price": [12.99, 18.99, 25.99],
      "startTime": "2024-03-15T19:30:00Z",
      "endTime": "2024-03-15T23:00:00Z",
      "location": "Venue B",
      "id": "2"
    },
    {
      "name": "Event3",
      "date": "2024-04-10T00:00:00Z",
      "deadline": "2024-04-05T12:00:00Z",
      "description": "An event with a different location",
      "price": [8.99, 14.99, 19.99],
      "startTime": "2024-04-10T17:00:00Z",
      "endTime": "2024-04-10T21:30:00Z",
      "location": "Venue C",
      "id": "3"
    }
  ]

// TODO ROUTE #1 - Get all current events
// for admin to be able to see all events (past and future)
//Done
app.get("/getallevents", async (req, res, next) => {
    console.log('test1')
    const all_events = await Event.find();
    res.json(all_events);

});

// default for client to see all upcoming events - Rahul Done
app.get('/getallfutureevents', async (req, res, next) => {
    try{
        console.log("test2")
        const currentDate = new Date();
        //filtered events to see if date field is greater than or equal to current date
        const future_events = await Event.find({date: {$gte: currentDate}})
        if (future_events.length != 0) {
            res.json(future_events);
        } else {
            throw new Error('No Upcoming Events. Check Later')
        }
    } catch (err) {
        console.log(err.message)
        res.status(405).json({error: err.message})
    }
    
    });



// TODO ROUTE #2 -> For Next Week 

    // For client to see their events
app.get('/getmytickets', async (req, res, next) => {
        console.log("test3");
        const tickets = await Ticket.find();
        res.json(tickets);
    });

// For the admin to get tickets - Tayten
app.get('/getTicketsEvent', async (req, res, next) => {
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
app.post('/getticket', async (req, res, next) => {
    console.log("test5");
    const ticket = await Ticket.find();
    res.json(ticket);
});

// Get event- Rachel
app.get('/getevent/:itemName', async (req, res, next) => {
    console.log("test6");
    const itemName = req.params.name;
    const event = await Event.findOne({"name" : itemName});
    res.json(event);
});
 

//Make Tickets --Neyida
app.post('/makeTicket', async (req, res, next) => {
    const newTicket = new Ticket({...req.body});
    newTicket.save();
    res.json(newTicket);
});

    
// TODO ROUTE #2 - Add a new event Done

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




//Delete Event Route:
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

// TODO ROUTE #4 - Update event 
app.patch("/updateevent/:id", async(req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).send("Event not found");

    try {
        const updatedEvent = await Event.findByIdAndUpdate({_id:eventId}, req.body, {new: true});
        console.log(updatedEvent);
        res.send({updatedEvent});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
        }
    });


module.exports = app;