import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = process.env.PORT || 3000;;
const app = express();
const apiKey = process.env.API_KEY;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/info", async(req, res) => {
    let city = req.body.city;
    try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=imperial`);
        console.log(result.data);
        res.render("index.ejs", {info: result.data});
    } catch(error) {
        console.log(error.message);
        res.render("index.ejs", {err: error});
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});