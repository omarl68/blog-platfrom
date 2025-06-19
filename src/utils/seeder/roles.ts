import { EMOJIS, RolesEnum } from "../../constants/constants";
import { Role } from "../../modules/role/role.model";


const createRole = (code: string) => ({
  code,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const seedRoles = async (roles: RolesEnum[]) => {
  try {
    let notCreatedRole: RolesEnum[] = [];
    for (const role of roles) {
      const roleFound = await Role.findOne({ code: role });
      if (!roleFound) {
        await Role.create(createRole(role));
        console.info(`\n${EMOJIS.SUCCESS}\tRole ${role} created! \n`);
      } else {
        notCreatedRole.push(role);
      }
    }
    if (notCreatedRole.length > 0) {
      console.info(
        `\n${EMOJIS.SUCCESS}\tRoles ${notCreatedRole.join(
          ', '
        )} already exist! \n`
      );
    }
  } catch (err) {
    console.error('Error seeding roles:', err);
  }
};

