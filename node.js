app.get('/api/comments', async (req, res) => {
    const comments = await Comment.find({});
    res.json(comments);
});

app.delete('/api/comments/:id', async (req, res) => {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

app.get('/api/posts/:postId/comments', async (req, res) => {
    const post = await Post.findById(req.params.postId).populate('comments');
    res.json(post.comments);
});

app.post('/api/posts/:postId/comments', async (req, res) => {
    const { username, content } = req.body;
    const post = await Post.findById(req.params.postId);

    const newComment = new Comment({
        username: username,
        content: content
    });

    post.comments.push(newComment);
    await newComment.save();
    await post.save();

    res.status(201).json(newComment);
});
