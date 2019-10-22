// jshint esversion: 6, node: true

"use strict";

const express = require('express');
const router = express.Router();
const passport  = require('passport');
const config = require('../config/database');
const Blog = require('../models/blog');

router.post('/', (req, res, next) => {
  const pageNumber = req.body.pn;
  const tag = req.body.tag;
  Blog.getBlogs(pageNumber, tag, (err, data) => {
    if (err) {
      console.error(` Error in fetching blogs
        ${err}`);
        res.json({
          success: false,
          msg: 'An error occured',
        });
    } else {
      res.send(data);
    }
  });
});

router.post('/countBlogs', (req, res, next) => {
  const blogObj = {
    tag: req.body.tag,
    searchString: req.body.searchString,
  };

  Blog.countBlogs(blogObj, (err, data) => {
    if (err) {
      console.error(` Error in fetching blogs
        ${err}`);
        res.json({
          success: false,
          msg: 'An error occured',
        });
    } else {
      res.json({
        success: true,
        count: data,
      });
    }
  });
});

router.post('/searchBlogs', (req, res, next) => {
  const searchObj = {
    pn: req.body.pn,
    searchString: req.body.searchString,
  };
  Blog.searchBlog(searchObj, (err, data) => {
    if (err) {
      console.log(`error in searching data ${ err }`);
    } else {
      res.send(data);
    }
  });
});

router.post('/getBlogById', (req, res, next) => {
  Blog.getBlogById(req.body.id, (err, data) => {
    if (err) {
      console.error(` Error in fetching blogs by id
        err`);
        res.json({
          success: false,
          msg: 'An error occured',
        });
    } else {
      res.json(data);
    }
  });
});

router.post('/getBlogByUsername', (req, res, next) => {
  Blog.getBlogByUsername(req.body.username, (err, data) => {
    if (err) {
      console.error(` Error in fetching blogs by username
        err`);
        res.json({
          success: false,
          msg: 'An error occured',
        });
    } else {
      res.json(data);
    }
  });
});

router.post('/addBlog', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const newBlog = new Blog({
    username: req.user.username,
    tags: req.body.tags,
    heading: req.body.heading,
    body: req.body.body,
  });
  Blog.insertBlog(newBlog, (err, blog) => {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        msg: 'Something went wrong please try again.',
      });
    } else {
      res.json({
        success: true,
        msg: 'Blog posted successfully.',
      });
    }
  });
});

router.post('/editBlog', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  Blog.getBlogById(req.body.id, (err, data) => {
    if (err) {
      return res.json({
        success: false,
        msg: "Something went wrong",
      });
    } else {
      if (data.username !== req.user.username) {
        return res.json({
          success: false,
          msg: "Unauthorized",
        });
      }

      const blog = {
        id: req.body.id,
        heading: req.body.heading,
        tags: req.body.tags,
        modifiedDate: Date.now(),
        body: req.body.body,
      };

      Blog.editBlog(blog, (err, data) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            msg: "Something went wrong",
          });
        } else {
          res.json({
            success: true,
            msg: "Blog edited successfully",
          });
        }
      });
    }
  });
});

router.post('/deleteBlog', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const blogId = req.body.id;

  Blog.getBlogById(blogId, (err, data) => {
    if (err) {
      return res.json({
        success: false,
        msg: "Something went wrong",
      });
    } else {
      if (data.username !== req.user.username) {
        return res.json({
          success: false,
          msg: "Unauthorized",
        });
      }
      Blog.deleteBlog(blogId, (err, data) => {
        if (err) {
          console.log(`Error in deleting blog ${ blogId } ---
            ${err}`);
          res.json({
            success: false,
            msg: "Something went wrong",
          });
        } else {
          res.json({
            success: true,
            msg: "Blog deleted successfully",
          });
        }
      });
    }
  });
});


/* ===============================================================
     LIKE BLOG POST
  =============================================================== */
  router.put('/likeBlog', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // Check if id was passed provided in request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search the database with id
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        // Check if error was encountered
        if (err) {
          res.json({ success: false, message: 'Invalid blog id' }); // Return error message
        } else {
          // Check if id matched the id of a blog post in the database
          if (!blog) {
            res.json({ success: false, message: 'That blog was not found.' }); // Return error message
          } else {
            // Get data from user that is signed in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                // Check if id of user in session was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                } else {
                  // Check if user who liked post is the same user that originally created the blog post
                  if (user.username === blog.username) {
                    res.json({ success: false, messagse: 'Cannot like your own post.' }); // Return error message
                  } else {
                    // Check if the user who liked the post has already liked the blog post before
                    if (blog.likedBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already liked this post.' }); // Return error message
                    } else {
                      // Check if user who liked post has previously disliked a post
                      if (blog.dislikedBy.includes(user.username)) {
                        blog.dislikes--; // Reduce the total number of dislikes
                        const arrayIndex = blog.dislikedBy.indexOf(user.username); // Get the index of the username in the array for removal
                        blog.dislikedBy.splice(arrayIndex, 1); // Remove user from array
                        blog.likes++; // Increment likes
                        blog.likedBy.push(user.username); // Add username to the array of likedBy array
                        // Save blog post data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog liked!' }); // Return success message
                          }
                        });
                      } else {
                        blog.likes++; // Increment likes
                        blog.likedBy.push(user.username); // Add liker's username into array of likedBy
                        // Save blog post
                        blog.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog liked!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     DISLIKE BLOG POST
  =============================================================== */
  router.put('/dislikeBlog', (req, res) => {
    // Check if id was provided inside the request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
      // Search database for blog post using the id
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid blog id' }); // Return error message
        } else {
          // Check if blog post with the id was found in the database
          if (!blog) {
            res.json({ success: false, message: 'That blog was not found.' }); // Return error message
          } else {
            // Get data of user who is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                } else {
                  // Check if user who disliekd post is the same person who originated the blog post
                  if (user.username === blog.username) {
                    res.json({ success: false, message: 'Cannot dislike your own post.' }); // Return error message
                  } else {
                    // Check if user who disliked post has already disliked it before
                    if (blog.dislikedBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
                    } else {
                      // Check if user has previous disliked this post
                      if (blog.likedBy.includes(user.username)) {
                        blog.likes--; // Decrease likes by one
                        const arrayIndex = blog.likedBy.indexOf(user.username); // Check where username is inside of the array
                        blog.likedBy.splice(arrayIndex, 1); // Remove username from index
                        blog.dislikes++; // Increase dislikeds by one
                        blog.dislikedBy.push(user.username); // Add username to list of dislikers
                        // Save blog data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog disliked!' }); // Return success message
                          }
                        });
                      } else {
                        blog.dislikes++; // Increase likes by one
                        blog.dislikedBy.push(user.username); // Add username to list of likers
                        // Save blog data
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Blog disliked!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });


module.exports = router;
