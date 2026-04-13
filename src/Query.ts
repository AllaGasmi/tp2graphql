import { GraphQLError } from "graphql";
export const Query = {
  getAllCvs: (_: any, __: any, { DB }: any) => {
    const cvs = DB.cvs;
    if (!cvs || cvs.length === 0) {
      throw new GraphQLError("Aucun CV trouvé", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return cvs;
  },
  getCvById: (_: any, { id }: { id: string }, { DB }: any) => {
    const cv = DB.cvs.find((cv: { id: string }) => cv.id === id);
    if (!cv) {
      throw new GraphQLError(`CV avec l'id ${id} introuvable`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return cv;
  },
};
