const Blog = require('../models/blogs');
const path = require('path');


// blog_index, blog_details, blog_create_get, blog_create_post, blog_delete

const blog_index = (req, res) => {
    Blog.find().sort({ createdAt: -1})
    .then(result => {
        res.render('index', {blogs: result, title: 'All blogs'})
    })
    .catch(err => {
        console.log(err);
    })
}

const blog_details = (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
    .then(result => {
        res.render('details', {blog: result, title: 'Blog Details'});
    })
    .catch(err => {
        console.log(err);
    });
}

const blog_create_get = (req, res) => {
    res.render('create', { title: 'Create a new blog' });
}

const blog_create_post = (req, res) => {
    //console.log(body.req);
    /*
    if we expect one uploaded file with a known field name(e.g, 'image'), we can us
    const { image } = req.files

    If you anticipate multiple uploaded files with various field names or need to handle file
    uploads more generically, you can use
    const { files } = req; 
    to extract all uploaded files and then access them based on their field names.
    */

    const { files } = req; // access uploaded file

    if (!files || Object.keys(files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const image = files.image; // Access the uploaded image

    // Move the uploaded image to the desired location
    image.mv(path.resolve(__dirname, '../public/uploads', image.name), (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send('File upload failed.');
        }
         // create a new blog entry with the uploaded image path
         const blog = new Blog({
            ...req.body,
            image: `uploads/${image.name}`
        });
        
        blog.save()
        .then(result => {
            res.redirect('/blogs');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Blog creation failed.');
        });
    });
}

const blog_delete = (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result => {
        res.json({ redirect: '/blogs'});
    })
    .catch(err => {
        console.log(err);
    });
}

module.exports = {
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete,
}