import express from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { json } from "stream/consumers";
import Events from ".././models/IEvents";
import tokenVerifier from "../middleware/tokenVerifier";

const eventsRouter: express.Router = express.Router();

eventsRouter.get(
    "/free",
    async (req: express.Request, res: express.Response) => {
        try {
            let events: Events[] | null = await Events.find({ type: "free" });
            if (!events) {
                return res.status(401).json({
                    msg: "no free events found",
                });
            }
            return res.status(200).json({
                event: events,
            });
        } catch (error) {
            return res.status(500).json({
                msg: error,
            });
        }
    },
);

eventsRouter.get("/event/:eventId", async (req: express.Request, res: express.Response) => {
    try {
        let { eventId } = req.params;
        let event: Events | null = await Events.findById(eventId);
        if (!event) {
            return res.status(401).json({
                msg: `no event found with id ${eventId}`,
            });
        }
        return res.status(200).json({
            event: event,
        });
    } catch (error) {
        return res.status(500).json({
            msg: error,
        });
    }
   
});

eventsRouter.get(
    "/pro",
    async (req: express.Request, res: express.Response) => {
        try {
            let events: Events[] | null = await Events.find({ type: "pro" });
            if (!events) {
                return res.status(401).json({
                    msg: "no pro events found",
                });
            }
            return res.status(200).json({
                event: events,
            });
        } catch (error) {
            return res.status(500).json({
                msg: error,
            });
        }
    },
);

eventsRouter.post(
    "/upload",
    [
        body("name").not().isEmpty().withMessage("Name is required"),
        body("image").isURL().withMessage("Invalid image URL"),
        body("image").not().isEmpty().withMessage("image url is required"),
        body("price").not().isEmpty().withMessage("Price is required"),
        body("date").not().isEmpty().withMessage("date is required"),
        body("info").not().isEmpty().withMessage("Info is required"),
        body("type").not().isEmpty().withMessage("Type is required"),
    ],
    tokenVerifier,
    async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { name, image, price, date, info, type } = req.body;

            // check if the event exist
            let event: Events | null = await Events.findOne({ name: name });
            if (event) {
                return res.status(400).json({
                    msg: "event already exist with this name",
                });
            }

            // create the event
            event = new Events({ name, image, price, date, info, type });
            event = await event.save();
            return res.status(200).json({
                msg: "event uploaded sucessfully",
            });
        } catch (error) {
            return res.status(500).json({
                msg: error,
            });
        }
    },
);

export default eventsRouter;
