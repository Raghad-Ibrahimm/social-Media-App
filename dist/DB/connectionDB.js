import mongoose from "mongoose";
const connectionDB = async () => {
    try {
        mongoose.connect(process.env.DB_url);
        console.log(`connection DB successfully socialMedia App ${process.env.DB_url}........👍😍😍`);
    }
    catch (error) {
        console.log(error, ["connection DB faild.......😮😮😮"]);
    }
};
export default connectionDB;
