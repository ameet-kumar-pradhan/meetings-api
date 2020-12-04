const express = require('express');
const Meeting = require('../models/meeting');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const $match = {};
        const start = req.query.start || '';
        const end = req.query.end || '';
        const page = parseInt(req.query.page, 10) || '';
        const limit = parseInt(req.query.limit, 10) || '';
        const participantEmail = req.query.participant || '';

        if (participantEmail) {
            $match['participants.email'] = participantEmail;
            const docs = await Meeting.aggregate(
                [
                    { $unwind: '$participants' },
                    {
                        $lookup: {
                            from: 'participants',
                            localField: 'participants',
                            foreignField: '_id',
                            as: 'participants'
                        }
                    },
                    { $match },
                    { $group: { _id: '$participants', meetings: { $push: '$$ROOT' } } },
                    { $unset: 'meetings.participants' }
                ]
            );
            return res.json(docs);
        }

        if (start && end) {
            const docs = await Meeting.aggregate([{
                $project: {
                    startTime:
                    {
                        $subtract:
                            ['$startTime', new Date('1970-01-01')]
                    },
                    endTime: {
                        $subtract:
                            ['$endTime', new Date('1970-01-01')]
                    },
                    title: 1,
                    participants: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }]);
            const newArr = docs.filter((meeting) => start <= meeting.startTime && end >= meeting.endTime);
            return res.json(newArr);
        }

        if (page && limit) {
            const docs = await Meeting.find({}).skip((page - 1) * limit).limit(limit).populate('participants');
            return res.json(docs);
        }

        const docs = await Meeting.aggregate([{
            $lookup: {
                from: 'participants',
                localField: 'participants',
                foreignField: '_id',
                as: 'participants'
            }
        }]);
        res.json(docs);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const doc = new Meeting(req.body);
        const newMeeting = await doc.save();
        res.json(newMeeting);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const doc = await Meeting.findOne({ _id: id });
        if (!doc) return next();
        const updated = await Meeting.findOneAndUpdate({ _id: id }, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const doc = await Meeting.findOne({ _id: id });
        if (!doc) return next();
        await Meeting.deleteOne({ _id: id });
        res.json({ message: 'Success' });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const doc = await Meeting.findOne({ _id: id }).populate('participants');
        if (!doc) return next();
        return res.json(doc);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
