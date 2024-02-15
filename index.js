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
    const location = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${city}`);
    if (location.data.length === 0) {
        res.render("index.ejs", {err: "error"});
    } else if (location.data.length > 1) {
        res.render("locations.ejs", {locations: location.data});
    } else {
        try {
            console.log(location.data.length);
            let lat = location.data[0].lat;
            let lon = location.data[0].lon;
            console.log(lat);
            console.log(lon);
            const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${apiKey}&units=imperial`);
            // console.log(result.data);
            res.render("index.ejs", {info: result.data, loc: location.data[0].display_name});
        } catch(error) {
            console.log(error.message);
            res.render("index.ejs", {err: error});
        }
    }
});

app.post("/location", async (req, res) => {
    const lon = req.body.longitude;
    const lat = req.body.latitude;
    try {
        console.log(lat);
        console.log(lon);
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${apiKey}&units=imperial`);
        const place = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        console.log(place.data);
        res.render("index.ejs", {info: result.data, loc:
             (((place.data.address.city || place.data.address.county || place.data.address.town || place.data.address.village)+", " +  (place.data.address.state || place.data.address.country)) 
         ||place.data.address.city_district || place.data.address.state)});
    } catch(error) {
        console.log(error.message);
        res.render("index.ejs", {err: error});
    }

})
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
