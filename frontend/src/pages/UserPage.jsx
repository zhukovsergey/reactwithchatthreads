import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Spinner, Flex } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();

  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Ошибка", data.error, "error");
        }
        setPosts(data);
      } catch (e) {
        showToast("Ошибка", e, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [username, showToast, setPosts]);
  console.log("posts here recoil tutorial", posts);
  if (!user && !loading) return <h1>Пользователь не найден</h1>;
  if (!user && loading)
    return (
      <Flex justifyContent="center">
        <Spinner size={"xl"} />
      </Flex>
    );

  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts?.length === 0 && (
        <h1>У пользователя нет публикаций</h1>
      )}
      {fetchingPosts && (
        <Flex justifyContent="center" my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post post={post} postedBy={post.postedBy} key={post._id} />
      ))}
    </>
  );
};

export default UserPage;
