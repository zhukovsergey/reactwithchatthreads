import { Link } from "react-router-dom";
import { Flex } from "@chakra-ui/layout";
import { Avatar, Box, Text, Image } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
import ru from "date-fns/locale/ru";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users//profile/${postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast("Ошибка", data.error, "error");
          return;
        }
        console.log(data);
        setUser(data.user);
        console.log(user);
      } catch (e) {
        showToast("Ошибка", e, "error");
      }
    };
    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Ошибка", data.error, "error");
        return;
      }
      showToast("Успешно", "Пост удален", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (e) {
      console.log(e);
    }
  };

  if (!user) return null;
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={user?.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>☹️</Text>}
            {post.replies[0] && (
              <Avatar
                size={"xs"}
                name="Dan Abrahmov"
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left={"20px"}
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size={"xs"}
                name="sage"
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right={"-10px"}
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size={"xs"}
                name="sage"
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right={"15px"}
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.name}
              </Text>
              <Image src="/verified.png" alt="verified" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                w={36}
                color={"gray.light"}
                textAlign={"right"}
              >
                {formatDistanceToNow(new Date(post.createdAt), {
                  locale: ru,
                })}{" "}
              </Text>
              {currentUser?._id === user._id && (
                <DeleteIcon size={20} onClick={(e) => handleDeletePost(e)} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} alt="post-image" />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
