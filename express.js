const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const wol = require('wake_on_lan');
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({origin: '*'}));




app.get('/filter', async function(req, res)
{
	var filter = req.query.var;
	var value = req.query.value;
	client = new mongoClient("mongodb://192.168.1.12:27017");
	
	switch (filter)
	{
		case "kraje":
			var database = client.db("projekt");
			var result = await database.collection("kraje").find({},{projection: {Kraj:1, _id:1}}).toArray();
			res.status(200).send(result);
			break;
		case "kraj":
			var database = client.db("projekt");
			var result = await database.collection("kraje").find({Kraj: `${value}`},{projection: {_id:1}}).toArray();
			
			if (Object.keys(result).length == 0)
				res.status(404).send();

			var result2Part1 = await database.collection("mecze 2022").find({"Drużyna 1": result[0]._id}).toArray();
			var result2Part2 = await database.collection("mecze 2022").find({"Drużyna 2": result[0]._id}).toArray();
			
			if (Object.keys(result2Part1).length == 0 || Object.keys(result2Part2).length == 0)
			{
				res.status(404).send()
			}
			else
			{
				res.status(200).send({result2Part1,result2Part2});
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