const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri =
	"mongodb+srv://mydbuser1:0HgdnZ6Ty8HGDQHf@cluster0.v25nn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
// user: mydbuser1
// password: 0HgdnZ6Ty8HGDQHf

async function run() {
	try {
		await client.connect();
		const database = client.db("foodMaster");
		const usersCollection = database.collection("users");

		// Get data and use to ui-------------------------------------------------------
		app.get("/users", async (req, res) => {
			const cursor = usersCollection.find({});
			const users = await cursor.toArray();
			res.send(users);
		});
		// update er jonno  id ke khoje ber korar jonno---------------------------------------------------------------------------
		app.get("/users/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const user = await usersCollection.findOne(query);
			// console.log("load user with id", id);
			res.send(user);
		});
		// post Api data and use to ui ------------------------------------------------------
		app.post("/users", async (req, res) => {
			const newUser = req.body;
			const result = await usersCollection.insertOne(newUser);
			console.log("got new user", req.body);
			console.log("added user", result);
			// res.send("hit the post");
			res.send(result);
		});
		// update Api-----------------------------------------------------------------------------
		app.put("/users/:id", async (req, res) => {
			const id = req.params.id;
			const updateUser = req.body;
			const filter = { _id: ObjectId(id) };
			const options = { upsert: true };
			const updateDoc = {
				$set: {
					name: updateUser.name,
					email: updateUser.email,
				},
			};
			const result = await usersCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			console.log("hitting id", req);
			res.json(result);
		});
		// Delete user item
		app.delete("/users/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await usersCollection.deleteOne(query);
			console.log("delete user id", result);
			res.json(result);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("hello world");
});
app.listen(port, () => {
	console.log("exp", port);
});
