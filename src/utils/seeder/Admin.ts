import { EMOJIS, RolesEnum } from "../../constants/constants";
import { Role } from "../../modules/role/role.model";
import { User } from "../../modules/user/user.model";


export const seedAdmin = async (
  RolesEnum: RolesEnum.ADMIN,
  email: string,
  password: string,
  name: string
) => {
  let roleAdmin = await Role.findOne({ code: RolesEnum });

  if (roleAdmin) {
    let Admin = await User.find({
      role: roleAdmin._id,
    }).countDocuments();

    if (Admin > 0) {
      console.log(`${RolesEnum} user exist`);
    } else {
      try {
        let Admin = {
          role: roleAdmin._id,
          isEmailVerified: true,
          firstName : name,
          lastName : name,
          email,
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        console.log(Admin)

        await User.create(Admin);

        console.log(
          `a new ${RolesEnum} has been created successfully ` + EMOJIS.SUCCESS
        );
      } catch (error) {
        console.log('error : ', error);
      }
    }
  } else {
    console.log('Role user inexistant !');
  }
};
