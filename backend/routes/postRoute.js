const express = require('express');
const { ObjectID } = require('mongodb');
const Post = require('../models/postModel');
const Material = require('../models/materialModel');
const Sub = require('../models/subModel');

const router = new express.Router();

router.get('/', async(req, res) => {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.status(200).json(posts);
});

router.post('/', async(req, res) => {
    const newPost = new Post({
        authorId: req.body.authorId,
        avatarColor: req.body.avatarColor || 0,
        comments: [],
        likers: [],
        likesCount: 0,
        text: req.body.text,
        timestamp: new Date().getTime()
    });
    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.patch('/:id', (req, res) => {
    const { id } = req.params;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (req.body.action === 'like') {
        try {
            return Post.findByIdAndUpdate(
                id, {
                    $inc: { likesCount: 1 },
                    $addToSet: { likers: req.body.id }
                }, { new: true },
                (err, post) => {
                    if (err) return res.status(400).send(err);
                    return res.send(post);
                }
            );
        } catch (err) {
            return res.status(400).send(err);
        }
    }
    if (req.body.action === 'unlike') {
        try {
            return Post.findByIdAndUpdate(
                id, {
                    $inc: { likesCount: -1 },
                    $pull: { likers: req.body.id }
                }, { new: true },
                (err, post) => {
                    if (err) return res.status(400).send(err);
                    return res.send(post);
                }
            );
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    if (req.body.action === 'addComment') {
        try {
            return Post.findByIdAndUpdate(
                id, {
                    $push: {
                        comments: {
                            commenterId: req.body.commenterId,
                            text: req.body.text,
                            timestamp: new Date().getTime()
                        }
                    }
                }, { new: true },
                (err, post) => {
                    if (err) return res.status(400).send(err);
                    return res.send(post);
                }
            );
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    if (req.body.action === 'deleteComment') {
        try {
            return Post.findByIdAndUpdate(
                id, {
                    $pull: {
                        comments: {
                            _id: req.body.commentId
                        }
                    }
                }, { new: true },
                (err, post) => {
                    if (err) return res.status(400).send(err);
                    return res.send(post);
                }
            );
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    if (req.body.action === 'editComment') {
        try {
            return Post.findById(id, (err, post) => {
                const { comments } = post;
                const theComment = comments.find(comment =>
                    comment._id.equals(req.body.commentId));

                if (!theComment) return res.status(404).send('Comment not found');
                theComment.text = req.body.text;

                return post.save((error) => {
                    if (error) return res.status(500).send(error);
                    return res.status(200).send(post);
                });
            });
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    try {
        return Post.findByIdAndUpdate(
            id, { $set: { text: req.body.text } }, { new: true },
            (err, post) => {
                if (err) return res.status(400).send(err);
                return res.send(post);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        await post.remove();
        return res.json({ success: true });
    } catch (err) {
        return res.status(404).send(err);
    }
});
router.post('/savedoc', async(req, res) => {
    try {
        const { authorId, url, subjectName, year } = req.body;
        let { name } = req.body;
        name = name.toLowerCase();
        const foundsub = await Sub.findOne({ name });
        if (!foundsub) {
            const sub = await Sub.save(new Sub({ name, year }));
        }
        const newMaterial = new Material({
            authorId,
            name,
            url,
            subjectName,
            year
        })
        const Material = await newMaterial.save();
        return res.json({ success: true });
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.get('/getsubnames/:year', async(req, res) => {
    try {
        const { year } = req.params;
        const subNames = await Sub.find({ year }, 'name');
        console.log(subNames);
        return res.json({ success: true, subNames });
    } catch (err) {
        return res.status(400).send(err);
    }
})

router.post('/savefiles', async(req, res) => {
    try {
        const { uploadfiles } = req.body;
        uploadfiles.forEach(async(file) => {
            const sub = await Sub.findOne({ name: file.subjectName.toLowerCase() })
            if (!sub) {
                const subn = await new Sub({ name: file.subjectName.toLowerCase(), year: file.year }).save();
                console.log(subn);
            }
        })
        const allfiles = await Material.insertMany(uploadfiles)
        return res.json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send(err);
    }
})
router.get('/getfiles', async(req, res) => {
    try {
        const allfiles = await Material.find()
        return res.json({ success: true, allfiles });
    } catch (err) {
        console.log(err);
        return res.status(400).send(err);
    }
})

module.exports = router;