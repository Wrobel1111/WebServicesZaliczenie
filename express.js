const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const wol = require('wake_on_lan');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({origin: '*'}));




app.get('/filter', async function(req, res)
{
	const filter = req.query.var;
	const value = req.query.value;
	client = new mongoClient("mongodb://192.168.1.12:27017");
	switch (filter)
	{
		case "kraj":
			database = client.db("projekt");
			result = await database.collection("kraje").find({Kraj: `"${value}"`},{projection: {Kraj:1, _id:0}}).toArray();
			if (result == null)
			{
				res.status(404).send();
			}
			else
			{
				res.status(200).send(result);
			}
			break;
		
		case "data":
			break;
		default:
			break;
	}
});

/*
To nie jest część projektu, ale przydało mi się do moich własnych potrzeb
Więc działa przy okazji
*/
app.get('/wol', async function(req, res)
{
	//var magicPacket = wol.createMagicPacket('50:EB:F6:58:82:F5');
	wol.wake('50:EB:F6:58:82:F5', function(error)
	{
		error ? res.status(523).send() : res.status(200).send('<p>Obudzono</p>')
	});
})

app.listen(3000, () =>
{
	console.log("Server started");
});