import { GraphQLError } from "graphql";
import { MyContext } from "./main";

export const Query = {
  getAllCvs: (_: unknown, __: unknown, { DB }: MyContext) => {
    const cvs = DB.cvs;
    if (!cvs || cvs.length === 0) {
      throw new GraphQLError("Aucun CV trouvé", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return cvs;
  },

  getCvById: (_: unknown, { id }: { id: string }, { DB }: MyContext) => {
    const cv = DB.cvs.find((cv) => cv.id === id);
    if (!cv) {
      throw new GraphQLError(`CV avec l'id ${id} introuvable`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return cv;
  },
};
