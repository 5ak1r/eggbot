const { LEVEL_LIST, LEVEL_ROLE_LIST } = require('./config');

async function AssignRole(member, level) {
  let newRole = null;

  for (let i = 0; i < LEVEL_LIST.length; i++) {
    if (LEVEL_LIST[i] == level)
      newRole = LEVEL_ROLE_LIST[i];
  }

  if (!newRole) return;

  await member.roles.add(newRole);
}

module.exports = {
  AssignRole
}