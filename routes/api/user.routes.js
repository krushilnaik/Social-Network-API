const router = require('express').Router();

const User = require('../../models/User');

router
	.route('/')

	.get((_req, res) => {
		User.find({})
			.then(data => res.json(data))
			.catch(err => res.status(500).json(err));
	})

	.post(({ body }, res) => {
		User.create(body)
			.then(data => res.json(data))
			.catch(err => res.status(400).json(err));
	});

router
	.route('/:_id')

	.get(({ params }, res) => {
		const { _id } = params;

		User.findOne({ _id })
			.populate('thoughts')
			.populate('friends')
			.then(data => res.json(data))
			.catch(err => res.status(500).json(err));
	})

	.put(({ params, body }, res) => {
		const { _id } = params;

		User.findOneAndUpdate({ _id }, body, {
			new: true,
			runValidators: true
		})
			.then(data => {
				if (!data) {
					res.status(404).json({ message: 'No user with this ID exists' });
				}

				res.json(data);
			})
			.catch(err => res.json(err));
	})

	.delete(({ params }, res) => {
		const { _id } = params;

		User.findOneAndDelete({ _id })
			.then(data => {
				if (!data) {
					res.status(404).json({ message: 'No user with this ID exists' });
				}

				res.json(data);
			})
			.catch(err => res.status(400).json(err));
	});

router
	.route('/:_id/friends/:friendId')

	.post(({ params }, res) => {
		const { _id, friendId } = params;

		User.findOneAndUpdate(
			{ _id },
			{ $push: { friends: friendId } },
			{ new: true }
		)
			.populate({ path: 'friends' })
			.then(data => {
				if (!data) {
					res.status(404).json({ message: 'No user with this ID exists' });
				}
				res.json(data);
			})
			.catch(err => res.json(err));
	})

	.delete(({ params }, res) => {
		const { _id, friendId } = params;

		User.findOneAndUpdate(
			{ _id },
			{ $pull: { friends: friendId } },
			{ new: true }
		)
			.populate({ path: 'friends' })
			.then(data => {
				if (!data) {
					res.status(404).json({ message: 'No user with this ID exists' });
				}
				res.json(data);
			})
			.catch(err => res.status(400).json(err));
	});

module.exports = router;
