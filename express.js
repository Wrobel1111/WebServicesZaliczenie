const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({origin: '*'}));




app.get('/filter', async function(req, res)
{
	const filter = req.query.var;
	client = new mongoClient("mongodb://localhost:27017");
	switch (filter)
	{
		case "kraj":
			database = client.db("projekt");
			result = await database.collection("kraje").find({},{projection: {Kraj:1, _id:0}}).toArray();
			res.status(200).send(result);
			break;
	
		default:
			break;
	}
});

app.listen(3000, () =>
{
	console.log("Server started");
});