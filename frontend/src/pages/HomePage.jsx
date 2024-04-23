import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Ошибка", data.error, "error");
        }
        setPosts(data);
      } catch (e) {
        console.log(e);
        showToast("Ошибка", e, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <>
      {loading && (
        <Flex justify={"center"} align={"center"} h={"100vh"}>
          <Spinner size="xl" />
        </Flex>
      )}
      {!loading && posts.length === 0 && (
        <h1>Вы не подписались ни на одного пользователя</h1>
      )}
      {posts.map((post) => (
        <Post post={post} key={post._id} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default HomePage;
