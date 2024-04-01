//Database setup
require("dotenv").config();
const mongoose = require("mongoose");
const mongoDBURL = process.env.MONGODB_URL;

mongoose
  .connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connectedd");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const start = async () => {
  try {
    await mongoose
      .connect(mongoDBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        const port = process.env.PORT || 3000;
        const server = app.listen(port, "0.0.0.0", () => {
          const addr = server.address();
          console.log(`🛸 Server listening at http://localhost:${addr.port}`);
        });
      });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
start();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); //allows our client to access our server locally
const passport = require("passport");
const session = require("express-session");
flash = require("express-flash");
require("dotenv").config();
require("./config/passport");
require("./config/google");

const app = express();
app.use(bodyParser.json());

const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "https://rdt-backend-production.up.railway.app",
  "https://superb-pocket.surge.sh",
  "http://enormous-fowl.surge.sh",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// app.use(cors({ origin: "http://localhost:3001", credentials: true }));
// routes
var authRouter = require("./routes/auth");

app.use(
  session({
    secret: "anthony_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto", // or true if you're using HTTPS
      maxAge: 3600000, // Adjust according to your needs
    },
  })
);
app.use(flash());

// Initialize Passport and configure it to use sessions
app.use(passport.initialize());
app.use(passport.session());
app.use(authRouter);

const Event = require("./models/Event");
const User = require("./models/User");
const Ticket = require("./models/Ticket");

// this will be your "database"
var database = [
  {
    name: "Event1",
    date: "2024-02-15T00:00:00Z",
    deadline: "2024-02-18T12:00:00Z",
    description: "This is the first event",
    price: [10.99, 15.99, 20.99],
    startTime: "2024-02-20T18:00:00Z",
    endTime: "2024-02-20T22:00:00Z",
    location: "Venue A",
  },
  {
    name: "Event2",
    date: "2024-03-15T00:00:00Z",
    deadline: "2024-03-10T12:00:00Z",
    description: "Another event happening next month",
    price: [12.99, 18.99, 25.99],
    startTime: "2024-03-15T19:30:00Z",
    endTime: "2024-03-15T23:00:00Z",
    location: "Venue B",
  },
  {
    name: "Event3",
    date: "2024-04-10T00:00:00Z",
    deadline: "2024-04-05T12:00:00Z",
    description: "An event with a different location",
    price: [8.99, 14.99, 19.99],
    startTime: "2024-04-10T17:00:00Z",
    endTime: "2024-04-10T21:30:00Z",
    location: "Venue C",
  },
];

// TODO ROUTE #1 - Get all current events
// for admin to be able to see all events (past and future)
//Done
app.get("/getallevents", async (req, res, next) => {
  const all_events = await Event.find();
  res.json(all_events);
});

// default for client to see all upcoming events - Rahul Done
app.get("/getallfutureevents", async (req, res, next) => {
  try {
    const currentDate = new Date();
    //filtered events to see if date field is greater than or equal to current date
    const future_events = await Event.find({
      startDate: { $gte: currentDate },
    });
    if (future_events.length != 0) {
      res.json(future_events);
    } else {
      throw new Error("No Upcoming Events. Check Later");
    }
  } catch (err) {
    console.log(err.message);
    res.status(405).json({ error: err.message });
  }
});

app.get("/getByPromo", async (req, res, next) => {
  //assume promo code is entered as a string
  //returns events that contain a specific promocode and are future events so
  //people can't access past events that contain a same promocode
  try {
    const promoCode = req.body.promoCode;
    const currentDate = new Date();
    const events = await Event.aggregate([
      {
        $addFields: {
          redemptionCodesArray: { $objectToArray: "$redemptionCodes" },
        },
      },
      // Match documents where any key matches the specified key
      {
        $match: {
          "redemptionCodesArray.k": promoCode,
          startDate: { $gte: currentDate },
        },
      },
    ]);
    if (events.length != 0) {
      res.json(events);
    } else {
      throw new Error("No Events with that Promo Code");
    }
  } catch (error) {
    console.log(error.message);
    res.status(405).json({ error: error.message });
  }
});

// TODO ROUTE #2 -> For Next Week

// For client to see their events
app.get("/getMyTickets", async (req, res, next) => {
  //assuming the input from the request is the id of
  //the user who's finding their tickets
  try {
    const user = await User.findOne({ _id: req.body.user_id });
    const my_tickets = user.tickets;
    if (my_tickets.length != 0) {
      res.json(my_tickets);
    } else {
      throw new Error("You don't have any tickets");
    }
  } catch (error) {
    console.log(error.message);
    res.status(406).json({ error: error.message });
  }
});

// For the admin to get tickets - Tayten
app.get("/getTicketsEvent", async (req, res, next) => {
  try {
    const event = await Event.findOne({ name: req.body.name });
    if (event) {
      res.json(event.tickets);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    next(error); // Pass the error
  }
});

//Get all users - Ashley
app.get("/getusers", async (req, res, next) => {
  console.log("test5 ");
  const users = await User.find();
  res.json(users);
});

// Get ticket -Neyida
app.post("/getticket", async (req, res, next) => {
  console.log("test5");
  const ticket = await Ticket.find();
  res.json(ticket);
});

// Get event- Rachel
app.get("/getevent", async (req, res, next) => {
  const eventID = req.query.eventID;
  const event = await Event.findOne({ _id: eventID });
  res.json(event);
});

// TODO ROUTE #2 - Add a new event Done
app.post("/addevent", async (req, res, next) => {
  //Creates an event with empty tickets array
  try {
    const newEvent = new Event({
      name: req.body.name,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      description: req.body.description,
      basePrice: req.body.basePrice,
      redemptionCode: req.body.redemptionCode,
      location: req.body.location,
      studentDiscount: req.body.studentDiscount,
      atDoorPrice: req.body.atDoorPrice,
      // photo: req.body.photo,
      // availableSeats: req.body.seatingChart,
      // tickets: [],
    });

    //loops through each seat in the seating chart and creates a ticket for the seat
    //adds the ticket's id to the Event's ticket array
    for (let seat of newEvent.availableSeats) {
      try {
        const newTicket = new Ticket({
          seat: seat,
          event: newEvent._id,
          isPaid: false,
          user: null,
        });
        await newTicket.save();
        newEvent.tickets.push(newTicket._id);
      } catch (error) {
        console.error("Error creating ticket: ", error);
        res.status(501).send(error.message);
      }
    }

    await newEvent.save();
    res.status(201).json({ newEvent: newEvent });
  } catch (error) {
    console.error("Error creating event: ", error);
    res.status(500).send(error.message);
  }
});

// Edit profile
app.put("/editprofile", async (req, res, next) => {
  try {
    // Assuming for now that a user cannot update their email address
    // If a user can change their email, need to include functionality to potentially update isRiceStudent field
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.body.user_id },
      req.body.changes,
      {
        new: true,
      }
    ); // changes is a mapping of each field to its new value
    res.status(201).json({ updatedUserInfo: updatedUser });
  } catch (error) {
    console.error("Error editing profile: ", error);
    res.status(500).send(error.message);
  }
});

// Purchase ticket
app.put("/purchaseticket", async (req, res, next) => {
  try {
    //console.log(req);
    console.log(req.body);
    const user = await User.findOne({ _id: req.body.user_id });

    // Assume iterable of ticket IDs is passed in
    // Not sure if front end will know ticket IDs, might only pass in seat numbers
    // Need to discuss how seat selection process will work
    let purchasedTickets = [];
    for (const ticketID of req.body.ticketIDs) {
      const ticket = await Ticket.findOne({ _id: ticketID });
      ticket.user = req.body.user_id;
      ticket.isPaid = true;
      await ticket.save();

      purchasedTickets.push(ticket);

      // Push ticket into user's array of tickets
      user.tickets.push(ticketID);
      await user.save();
    }

    res
      .status(201)
      .json({ purchasedTickets: purchasedTickets, userTickets: user.tickets });
  } catch (error) {
    console.error("Error purchasing ticket(s): ", error);
    res.status(500).send(error.message);
  }
});

app.put("/removeticket", async (req, res, next) => {
  try {
    // inputs: ticketID and user_id
    const ticketToRemove = await Ticket.findOne({ _id: req.body.ticketID });
    ticketToRemove.user = null;
    ticketToRemove.isPaid = false;
    await ticketToRemove.save();

    const user = await User.findOne({ _id: req.body.user_id });
    // filter out ticketID from user's array of purchased tickets
    user.tickets = user.tickets.filter(
      (id) => id.toString() !== req.body.ticketID
    );
    await user.save();

    res
      .status(201)
      .json({ removedTicket: ticketToRemove, userTickets: user.tickets });
  } catch (error) {
    console.error("Error removing ticket: ", error);
    res.status(500).send(error.message);
  }
});

app.delete("/deleteevent", async (req, res, next) => {
  // delete all tickets associated with the event
  try {
    const eventToDelete = await Event.findOne({ _id: req.body.event_id });
    for (const ticket_id of eventToDelete.tickets) {
      await Ticket.findByIdAndDelete(ticket_id);

      // if a user already purchased this ticket, delete the ticket from their tickets array
      await User.updateOne(
        { tickets: ticket_id },
        { $pull: { tickets: ticket_id } }
      );
    }

    // delete the event
    const deletedEvent = await Event.findByIdAndDelete(req.body.event_id);
    res.status(200).json({ deletedEvent: deletedEvent });
  } catch (error) {
    console.error("Error deleting event: ", error);
    res.status(404).send(error.message);
  }
});

// TODO ROUTE #3 - Remove an existing shopping item

app.delete("/remove", (req, res, next) => {
  //console.log(req.body)
  try {
    let newDatabase = database.filter((item) => item.name != req.body.name);
    database = newDatabase;
    console.log(newDatabase);
    res.json(database);
  } catch (error) {
    console.error(error);
  }
});

// TODO ROUTE #4 - Update event by time/name

app.put("/updateevent", async (req, res, next) => {
  console.log(req);
  let filter = { name: req.name };
  let update = req.update;
  let updatedEvent = await Event.findOneAndUpdate(filter, update);
});

// TODO ROUTE #5 - Get shopping items that satisfy a condition/filter (harder)

module.exports = app;
