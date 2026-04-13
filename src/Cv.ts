import { GraphQLError } from "graphql";
import { MyContext } from "./main";

type CvParent = (typeof import("./db/db").DB.cvs)[number];
export const Cv = {
  skills: (parent: CvParent, _: unknown, { DB }: MyContext) => {
    const skills = DB.skills.filter((skill) => skill.cvIds.includes(parent.id));
    if (!skills || skills.length === 0) {
      throw new GraphQLError(`Aucun skill trouvé pour le CV ${parent.id}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return skills;
  },

  cvOwner: (parent: CvParent, _: unknown, { DB }: MyContext) => {
    const user = DB.users.find((user) => user.id === parent.cvOwnerId);
    if (!user) {
      throw new GraphQLError(
        `User propriétaire du CV ${parent.id} introuvable`,
        {
          extensions: { code: "NOT_FOUND" },
        },
      );
    }
    return user;
  },
};
