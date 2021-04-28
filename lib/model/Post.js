function Post({
    PostId,
    Sender,
    Receiver,
    PostHtml,
    Timestamp,
    Likes
  }) {
    this.PostId = PostId || -1;
    this.Sender = Sender || null;
    this.Receiver = Receiver || null;
    this.PostHtml = PostHtml || "";
    this.Timestamp = Timestamp || null;
    this.Likes = Likes || [];
  }
  
  module.exports = Post;
  