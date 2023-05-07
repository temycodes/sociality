import React from 'react';
import { useSelector } from "react-redux";
import MyPostWidget from "../../scenes/widgets/MyPostWidget";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import Layout from "../../components/Layout";

const HomePage = () => {
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Layout>    
      <MyPostWidget picturePath={picturePath} />
      <PostsWidget userId={_id} />
    </Layout>
  );
};

export default HomePage;
