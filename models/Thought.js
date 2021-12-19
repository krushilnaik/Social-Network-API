const { Schema, model } = require('mongoose');
const moment = require('moment');

const ReactionSchema = require('./Reaction');

const ThoughtSchema = new Schema(
	{
		thoughtText: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 280
		},
		createdAt: {
			type: Date,
			default: Date.now,
			get: data => moment(data).format('MMM DD, YYYY [at] hh:mm a')
		},
		username: {
			type: String,
			required: true,
			ref: 'User'
		},
		reactions: [ReactionSchema]
	},
	{
		toJSON: {
			virtuals: true,
			getters: true
		},
		id: false
	}
);

ThoughtSchema.virtual('reactionCount').get(function () {
	return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
