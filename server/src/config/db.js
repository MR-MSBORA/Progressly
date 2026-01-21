import { mongoose } from "mongoose"
import { DB_NAME } from "../../src/constant"


const connectdb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connect.host}`)
    } catch (error) {
        console.log("ERROR CONNECTING DATABASE");
        process.exit(1);
        /* process.exit(0) → Program ended successfully
           process.exit(1) → Program ended due to an error*/

    }

}

export default connectdb