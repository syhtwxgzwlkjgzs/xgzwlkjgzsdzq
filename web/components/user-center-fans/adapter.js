export const followerAdapter = (data) => {
  const followers = [];
  Object.keys(data).forEach((key) => {
    const users = data[key];
    if (!users) return null;
    users.map(user => followers.push({
      id: user.user.pid,
      groupName: user.group.groupName,
      avatar: user.user.avatar,
      userName: user.user.userName,
      isMutual: user.userFollow.isMutual,
      isFollow: user.userFollow.isFollow,
    }));
  });

  return followers;
};
