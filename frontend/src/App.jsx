import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  const getPostFromNode = () => {
    fetch('http://localhost:3001/posts')
      .then(res => res.json())
      .then(data => {
        console.log('data posts:', data);
        setPosts(data.data);
      });
  };


  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPostFromNode()
  }, []);

  const addPost = () => {
    const newPost = { post: post };
    fetch('http://localhost:3001/addpost', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)

    }).then(res => res.json()).then((status) => {
      console.log("Status of deleting post: " + status.status)
      getPostFromNode();
    });
    setPost("");
  };
  

const deletePost = (id) => {
  console.log('...requested to update post ' + id);
  fetch(`http://localhost:3001/posts/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
    .then(res => res.json()).then((status) => {
      console.log("Status of deleting post: " + status.status)
      getPostFromNode();
    });
};

const parseDateAndTime = (createdAt) => {
  const dateTimeObject = new Date(createdAt);

  let time = dateTimeObject.toLocaleTimeString().split(":");
  let unit = time[2].slice(3).toLocaleUpperCase();

  let date = dateTimeObject.toDateString().split(" ").slice(1);

  let formattedString = `${date[0]} ${date[1]} ${date[2]} - ${time[0]}:${time[1]} ${unit}`;

  return formattedString;
}




return (
  <div className='react-app-component text-center'>
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-6">
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Enter your post</label>
                <textarea className="form-control" id="post-content" rows="3" value={post} onChange={(e) => (setPost(e.target.value))}></textarea>
                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-primary mt-2" onClick={() => addPost()}>Post</button>
                </div>
              </div>
            </div>
          </div>

          {posts.map((post, index) => {
            return (
              <div key={index} className="card text-white bg-dark my-3 text-start">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">{parseDateAndTime(post.createdAt)}</h6>
                  <p className="card-text">{post.post}</p>
                  <a href="#" className="card-link" onClick={() => deletePost(post._id)}>Delete</a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </div>
);
}

export default App;