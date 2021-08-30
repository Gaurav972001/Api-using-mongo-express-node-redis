const Redis = require('redis');
const redisClient = Redis.createClient();

const TTL = 3600;

const { getCollectionInstance } = require('../connection/connection');

createItem = async (req, res) => {
	if (!req.body) {
		res.status(400).send({ message: 'Content can not be emtpy!' });
		return;
	}
	const newItem = {
		itemName: req.body.itemName,
		stocks: req.body.stocks,
	};
	try {
		const insertedItem = await getCollectionInstance('items').insertOne(
			newItem
		);
		console.log(insertedItem.ops[0]);
		res.json(insertedItem.ops[0]);
	} catch (err) {
		console.log(err);
		res.json(err.message);
	}
};

// retrieve and return all items
getItem = async (req, res) => {
	redisClient.get('items', async (error, data) => {
		try {
			if (error) console.log(error);
			if (data != null) {
				console.log('cache hit');
				return res.json(JSON.parse(data));
			} else {
				console.log('cache miss');
				const fetchedItems = await getCollectionInstance('items')
					.find({})
					.toArray();
				redisClient.setex('items', TTL, JSON.stringify(fetchedItems));
				res.json(fetchedItems);
			}
		} catch (err) {
			console.log(err);
		}
	});
};

// Update a new idetified item by item id
updateItem = async (req, res) => {
	if (!req.body.itemName || !req.body.stocks) {
		return res.status(400).send({ message: 'Data to update can not be empty' });
	}

	try {
		const item = await getCollectionInstance('items')
			.find({ _id: new mongodb.ObjectId(req.params.id) })
			.count();

		if (item === 0) {
			res.status(400).send({ message: 'id not found' });
			return;
		}

		await getCollectionInstance('items').findOneAndUpdate(
			{ _id: new mongodb.ObjectId(req.params.id) },
			{ $set: { itemName: req.body.itemName, stocks: req.body.stocks } },
			() => {
				res.send('Success updated!');
			}
		);
	} catch (err) {
		res.send(err.message);
	}
};

// Delete a item with specified item id in the request
deleteItem = async (req, res) => {
	try {
		const item = await getCollectionInstance('items')
			.find({ _id: new mongodb.ObjectId(req.params.id) })
			.count();

		if (item === 0) {
			res.status(400).send({ message: 'id not found' });
			return;
		}

		await getCollectionInstance('items').deleteOne(
			{ _id: new mongodb.ObjectId(req.params.id) },
			function () {
				res.send('Successfully deleted!');
			}
		);
	} catch (err) {
		res.send(err.message);
		return;
	}
};

module.exports = {
	createItem,
	getItem,
	updateItem,
	deleteItem,
};
