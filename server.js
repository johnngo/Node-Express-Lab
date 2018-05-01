// import your node modules
const express = require('express');
const db = require('./data/db.js');
const server = express();

// add your server code starting here
server.use(express.json());
// ---------------wrote an endpoint that returns an array of all post objects in the db
server.get('/api/posts',(req,res) => {
    db
    .find()
    .then(posts => {
        res.json(posts);
    })
    .catch(err => {
        res.status(500).json({ error: 'The posts information could not be retrieved.'})
    })
});

//-------------------- wrote endpoint to return a post object with a specified ID
server.get('/api/posts/:id', (req,res) => {
    const {id }= req.params;

    db
    .findById(id)
    .then(posts => {
        if (posts.length < 1) {
            return res.status(404).json({ message: 'The post with the specified ID does not exist.'});
        } else {
            return res.json(posts[0]);
        }
    })
    .catch(err => {
        res.status(500).json({ error: 'The posts information could not be retreived.'});
    });
})

// ----------------wrote endpoint to remove post with specified Id and return deleted post
server.post('/api/posts', (req,res) => {

    const { title, contents} = req.body
    const post = {tiltle, contents}
    db
    .insert(post)
    .then(post => {
        res.status(201).json(post)
    })
    .catch(error => {
        res
        .status(500)
        .json({
            error: 'There was an error while saving the post to the database'
        });
    });
    if(!title || !contents) {
        res
        .status(404)
        .json({
            errorMessage:
                'Please proove title and contents for the post'
        })
    }
});


// ----------------------return deleted post

server.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    let user;

db.findById(id)
.then(response => {
    user = {...response[0] };
    db
    .remove(id)
    .then(post => {
        if(post.length< 1) {
            return res
            .status(404)
            .json({
                message: 'The post with the specified ID does not exist',
            });
        
        } else {
            return res.status(200).json(user);
        }
    })
    .catch(err=> {
        res.status(500).json({ error: 'The post could not be removed.'});
    });
})
.catch(err => {
    res.status(500).json(err);
    });
});

server.put('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
    const update = { title, contents };
  
    db
      .update(id, update)
      .then(count => {
          if(count > 0) {
              db.findById(id).then(updatedPosts => {
                res.status(200).json(updatedPosts[0]);
              });
          } else {
              res
                .status(404)
                .json({
                  message:
                    'The post with the specified ID does not exist.',
                });
          }
      })
      .catch(err => {
          res
            .status(500)
            .json({
              error: 'The post information could not be modified.',
            });
      });
      if (!title || !contents) {
        res
        .status(400)
        .json({
            errorMessage: 'Please provide title and contents for the post.'
        }) 
      }
  });



server.listen(5000, () =>console.log(' \n== API Running on port 5000 ==\n'))
