import {
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import ru from "date-fns/locale/ru";

import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const { user, loading } = useGetUserProfile();
  const showToast = useShowToast();

  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentPost = posts[0];
  const { pid } = useParams();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Ошибка", data.error, "error");
          return;
        }
        setPosts([...posts, data]);
        console.log(data);
      } catch (e) {
        showToast("Ошибка", e, "error");
      }
    };
    getPost();
  }, [pid, showToast, setPosts]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch(`/api/posts/${currentPost?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Ошибка", data.error, "error");
        return;
      }
      showToast("Успешно", "Пост удален", "success");
      navigate(`/${user.username}`);
    } catch (e) {
      console.log(e);
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent="center">
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;
  return (
    <div>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} size={"md"} name={user?.name} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username}
            </Text>
            <Image src="/verified.png" alt="verified" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} w={36} color={"gray.light"} textAlign={"right"}>
            {formatDistanceToNow(new Date(currentPost.createdAt), {
              locale: ru,
            })}{" "}
          </Text>
          {currentUser?._id === user?._id && (
            <DeleteIcon
              size={20}
              onClick={(e) => handleDeletePost(e)}
              cursor={"pointer"}
            />
          )}
        </Flex>
      </Flex>
      <Text my={3}>asdasdas</Text>
      {currentPost?.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost?.img} alt="post-image" w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>😙</Text>
          <Text color={"gray.light"}>Get the app to like</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </div>
  );
};

export default PostPage;
