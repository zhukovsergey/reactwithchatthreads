import { Flex, Avatar, Text, Divider } from "@chakra-ui/react";

const Comment = ({ reply, lastReply }) => {
  console.log(reply);
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} name="Mark Zuckerberg" />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            justifyContent={"space-between"}
            w={"full"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply?.username}
            </Text>
          </Flex>
          <Text>{reply?.text}</Text>
        </Flex>
      </Flex>
      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;
