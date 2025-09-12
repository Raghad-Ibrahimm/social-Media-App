import { resolve } from "path";
import { config } from "dotenv";
config({ path: resolve("./config/.env") });
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { appErr } from "./utilts/classError.js";
import userRouter from "./modules/users/user.controller.js";
import connectionDB from "./DB/connectionDB.js";
const app = express();
const port = process.env.PORT || 5000;
const limiter = rateLimit({
    windowMs: 4 * 60 * 1000,
    limit: 10,
    message: {
        error: "game Over ..😂😂"
    },
    statusCode: 429,
    legacyHeaders: false
});
const bootstrap = async () => {
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(limiter);
    await connectionDB();
    app.use("/users", userRouter);
    app.get("", (req, res, next) => {
        return res.status(200).json({ message: "Welcome on my social media app .......❤️❤️❤️❤️" });
    });
    app.use("{/*demo}", (req, res, next) => {
        throw new appErr(`404 page not found Invalid Url (${req.originalUrl}).......🤷‍♂️🤦🤦‍♂️`, 404);
    });
    app.use((err, req, res, next) => {
        return res.status(err.statusCode || 500).json({ message: err.message, Stack: err.stack, Error: err });
    });
    app.listen((port), () => {
        console.log(`server is running on port ${port}.........👌👌`);
    });
};
export default bootstrap;
