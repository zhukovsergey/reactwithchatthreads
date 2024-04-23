import { VStack, Box, Flex } from "@chakra-ui/layout";
import { Avatar, Text, Link } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { Portal } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

const UserHeader = ({ user = { user } }) => {
  // под кем логинились
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );

  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    showToast(
      "Ссылка скопирована",
      "Ссылка скопирована в буфер обмена",
      "success"
    );
  };
  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Войдите", "Чтобы подписаться", "error");
      return;
    }
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.error) {
        showToast("Ошибка", data.error, "error");
        return;
      }
      if (following) {
        showToast(
          "Успешно",
          `Вы отписались от пользователя ${user.name}`,
          "success"
        );
        user.followers.pop();
      } else {
        showToast(
          "Успешно",
          `Вы подписались на пользователя ${user.name}`,
          "success"
        );
        user.followers.push(currentUser?._id);
      }

      setFollowing(!following);
    } catch (e) {
      showToast("Ошибка", e, "error");
      console.log(e);
    } finally {
      setUpdating(false);
    }
  };
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.next
            </Text>
          </Flex>
        </Box>
        <Box>
          {user?.profilePic && (
            <Avatar
              name={user?.name}
              src={user?.profilePic}
              size={{ base: "md", md: "xl" }}
            />
          )}
          {!user?.profilePic && (
            <Avatar
              name={user?.name}
              src={"https://bit.ly/broken-link"}
              size={{ base: "md", md: "xl" }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user?.bio}</Text>

      {currentUser?._id === user?._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Редактировать профиль</Button>
        </Link>
      )}
      {currentUser?._id !== user?._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Отписаться" : "Подписаться"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user?.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} fontSize={"sm"} onClick={copyUrl}>
                    Скопировать ссылку
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={"3"}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          pb={"3"}
          cursor={"pointer"}
          color={"gray.light"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
