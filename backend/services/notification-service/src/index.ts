import app from "./app.ts";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3003;

app.listen(PORT as number, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}`);
});