const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Post = require('./models/Post');  // Model Postingan
const Comment = require('./models/Comment');  // Model Komentar
const Visitor = require('./models/Visitor');  // Model Pengunjung

app.use(bodyParser.json());

// Dapatkan ringkasan statistik
app.get('/api/stats', async (req, res) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const postCount = await Post.countDocuments({ date: { $gte: oneMonthAgo } });
    const commentCount = await Comment.countDocuments({ date: { $gte: oneMonthAgo } });
    const visitorCount = await Visitor.countDocuments({ date: { $gte: oneMonthAgo } });

    res.json({ postCount, commentCount, visitorCount });
});

// Tambah postingan baru
app.post('/api/posts', async (req, res) => {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
});

// Edit postingan
app.put('/api/posts/:id', async (req, res) => {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPost);
});

// Hapus postingan
app.delete('/api/posts/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

document.addEventListener("DOMContentLoaded", function() {
    loadStats();
    loadPosts();
    loadComments(); // Tambahkan fungsi untuk memuat komentar
});

// Fungsi untuk mengambil komentar dari backend
function loadComments() {
    fetch('/api/comments')
        .then(response => response.json())
        .then(data => {
            let commentList = document.getElementById('comment-list');
            commentList.innerHTML = '';

            data.forEach(comment => {
                commentList.innerHTML += `
                    <tr>
                        <td>${comment.username}</td>
                        <td>${comment.content}</td>
                        <td>${new Date(comment.date).toLocaleDateString()}</td>
                        <td>
                            <button class="delete-btn" onclick="deleteComment('${comment._id}')">Hapus</button>
                        </td>
                    </tr>
                `;
            });
        });
}

// Fungsi untuk menghapus komentar
function deleteComment(commentId) {
    if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
        fetch(`/api/comments/${commentId}`, {
            method: 'DELETE'
        }).then(() => loadComments());
    }
}



app.listen(3000, () => console.log('Server running on port 3000'));
