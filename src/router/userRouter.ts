import express from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/IUser";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import tokenVerifier from "../middleware/tokenVerifier";

const userRouter: express.Router = express.Router();

userRouter.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).json({
        msg: "main router for users",
    });
});
userRouter.post(
    "/register",
    [
        body("name").not().isEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("email isnot valid"),
        body("password")
            .isLength({ min: 5 })
            .withMessage("min 5 char requi for password"),
    ],
    async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let { name, email, password } = req.body;
            //check if user is exist
            let user: User | null = await User.findOne({ email: email });
            if (user) {
                return res.status(400).json({
                    msg: "user already exist",
                });
            }

            // emcrypt password
            let salt = await bcrypt.genSalt(10);
            let hashPass = await bcrypt.hash(password, salt);

            //get avatar url
            const avatar = gravatar.url(email, {
                s: "300",
                r: "pg",
                d: "mm",
            });
            // register user
            user = new User({ name, email, password: hashPass, avatar });
            user = await user.save();
            return res.status(200).json({
                msg: "Registration is sucesssss",
                hashedpass: hashPass,
            });
        } catch (error) {
            return res.status(500).json({
                msg: error,
            });
        }
    },
);

userRouter.post(
    "/login",
    [
        body("email").isEmail().withMessage("email is not valid"),
        body("password")
            .isLength({ min: 5 })
            .withMessage("min 5 characters required for password"),
    ],
    async (req: express.Request, res: express.Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            const user: User | null = await User.findOne({ email: email });

            if (!user) {
                return res.status(401).json({
                    msg: "Invalid email",
                });
            }

            const isMatch: boolean = await bcrypt.compare(
                password,
                user.password,
            );

            if (!isMatch) {
                return res.status(401).json({
                    msg: "Incorrect password",
                });
            }

            const secretKey: string | undefined = "ssssshhhhh";
            if (!secretKey) {
                return res.status(500).json({
                    msg: "JWT secret key not available",
                });
            }

            const payLoad = {
                user: {
                    id: user.id,
                    name: user.name,
                },
            };

            const token = jwt.sign(payLoad, secretKey);
            res.setHeader("authorization",token);
            res.cookie("userName", user.name);
            res.cookie("userId", user.id);
            return res.status(200).json({
                msg: "Login is successful",
                token: token,
            });
        } catch (error) {
            return res.status(500).json({
                msg: error,
            });
        }
    },
);



userRouter.get(
    "/profile",
    tokenVerifier,
    async (req: express.Request, res: express.Response) => {
        try {
            interface UserHeader {
                id: string;
                name: string;
            }
            const requestedUser:UserHeader  | undefined = req.headers["user"] as UserHeader | undefined;

            if (!requestedUser) {
                return res.status(400).json({
                    msg: "User header missing.",
                });
            }
            
            const user: User | null | any= await User.findOne({ _id: requestedUser.id }).select("-password");
            
            if (!user) {
                return res.status(401).json({
                    msg: "User data not found.",
                });
            }
            
            return res.status(200).json({
                msg: {
                    user: user,
                },
            });
        } catch (error) {
            return res.status(500).json({
                msg: "Error fetching user profile.",
            });
        }
    },
);

export default userRouter;
