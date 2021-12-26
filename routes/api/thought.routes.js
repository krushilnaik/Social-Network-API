const router = require('express').Router();

const Thought = require('../../models/Thought');
const User = require('../../models/User');

router
	.route('/')

	.get((_req, res) => {
		Thought.find({})
			.then(data => res.json(data))
			.catch(err => res.status(500).json(err));
	})

	.post(({ body }, res) => {
		Thought.create(body)
			.then(({ _id }) => {
				return User.findOneAndUpdate(
					{ username: body.username },
					{ $push: { thoughts: _id } },
					{ new: true }
				);
			})
			.then(data => res.json(data))
			.catch(err => res.status(500).json(err));
	});

router
	.route('/:_id')
	.get(({ params }, res) => {
		const { _id } = params;

		Thought.findOne({ _id })
			.then(data => res.json(data))
			.catch(err => res.status(500).json(err));
	})

	.put(({ body, params }, res) => {
		const { _id } = params;

		Thought.findOneAndUpdate({ _id }, body, {
			new: true,
			runValidators: true
		})
			.then(data => res.json(data))
			.catch(err => res.json(err));
	})

	.delete(({ params }, res) => {
		const { _id } = params;

		Thought.findOneAndDelete({ _id })
			.then(data => res.json(data))
			.catch(err => res.json(err));
	});

router
	.route('/:_id/reactions')

	.post(({ body, params }, res) => {
		const { _id } = params;

		Thought.findOneAndUpdate(
			{ _id },
			{ $push: { reactions: body } },
			{ new: true, runValidators: true }
		)
			.populate({ path: 'reactions', select: '-__v' })
			.select('-__v')
			.then(dbThoughtsData => {
				if (!dbThoughtsData) {
					res
						.status(404)
						.json({ message: 'No thoughts with this particular ID!' });
					return;
				}
				res.json(dbThoughtsData);
			})
			.catch(err => res.status(400).json(err));
	});

router.delete('/:_id/reactions/:reactionId', ({ params }, res) => {
	const { _id, reactionId } = params;

	Thought.findOneAndUpdate(
		{ _id },
		{ $pull: { reactions: { reactionId } } },
		{ new: true }
	)
		.then(dbThoughtsData => {
			if (!dbThoughtsData) {
				res
					.status(404)
					.json({ message: 'No thoughts with this particular ID!' });
				return;
			}
			res.json(dbThoughtsData);
		})
		.catch(err => res.status(400).json(err));
});

module.exports = router;
