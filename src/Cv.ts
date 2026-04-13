import { GraphQLError } from "graphql";
export const Cv = {
  skills: (parent: any, _: any, { DB }: any) => {
    const skills = DB.skills.filter((skill: { cvIds: string[] }) =>
      skill.cvIds.includes(parent.id));
    if (!skills || skills.length === 0) {
      throw new GraphQLError(`Aucun skill trouvé pour le CV ${parent.id}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return skills;
  },

  cvOwner: (parent: any, _: any, { DB }: any) => {
    const user = DB.users.find(
      (user: { id: string }) => user.id === parent.cvOwnerId);
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
