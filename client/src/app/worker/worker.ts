// public/worker.js
self.onmessage = function (e) {
    const data = e.data;
    // console.log(data)
    const sortedPosts = data.map((post:any) => ({
      ...post,
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
    })).sort(() => Math.random() - 0.5);
    postMessage(sortedPosts);
  };
  