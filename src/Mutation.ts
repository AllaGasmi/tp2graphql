import { GraphQLError } from "graphql";
import { pubSub } from "./pubSub";

export const Mutation = {
  addCv: (_: any, { input }: any, { DB }: any) => {
    const owner = DB.users.find((u: any) => u.id === input.cvOwnerId);
    if (!owner) {
      throw new GraphQLError(`User ${input.cvOwnerId} introuvable`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    if (input.skillIds) {
      input.skillIds.forEach((skillId: string) => {
        const skill = DB.skills.find((s: any) => s.id === skillId);
        if (!skill) {
          throw new GraphQLError(`Skill ${skillId} introuvable`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
      });
    }
    const newCv = {
      id: String(DB.cvs.length + 1),
      name: input.name,
      age: input.age,
      job: input.job ?? null,
      skillIds: input.skillIds ?? [],
      cvOwnerId: input.cvOwnerId,
    };

    DB.cvs.push(newCv);
    owner.cvIds.push(newCv.id);
    if (input.skillIds) {
      input.skillIds.forEach((skillId: string) => {
        const skill = DB.skills.find((s: any) => s.id === skillId);
        skill.cvIds.push(newCv.id);
      });
    }
    pubSub.publish("CV_CHANGED", {
      cvChanged: { type: "ADDED", cv: newCv },
    });

    return newCv;
  },

  updateCv: (_: any, { id, input }: any, { DB }: any) => {
    const cv = DB.cvs.find((c: any) => c.id === id);
    if (!cv) {
      throw new GraphQLError(`CV ${id} introuvable`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    if (input.cvOwnerId) {
      const owner = DB.users.find((u: any) => u.id === input.cvOwnerId);
      if (!owner) {
        throw new GraphQLError(`User ${input.cvOwnerId} introuvable`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
    }
    if (input.skillIds) {
      input.skillIds.forEach((skillId: string) => {
        const skill = DB.skills.find((s: any) => s.id === skillId);
        if (!skill) {
          throw new GraphQLError(`Skill ${skillId} introuvable`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
      });
      }
    
    if (input.name) cv.name = input.name;
    if (input.age) cv.age = input.age;
    if (input.job) cv.job = input.job;
    if (input.skillIds) cv.skillIds = input.skillIds;
    if (input.cvOwnerId) cv.cvOwnerId = input.cvOwnerId;
    pubSub.publish("CV_CHANGED", {
      cvChanged: { type: "UPDATED", cv },
    });

    return cv;
  },

  deleteCv: (_: any, { id }: any, { DB }: any) => {
    const index = DB.cvs.findIndex((c: any) => c.id === id);
    if (index === -1) {
      throw new GraphQLError(`CV ${id} introuvable`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    const cv = DB.cvs[index];
    const owner = DB.users.find((u: any) => u.id === cv.cvOwnerId);
    if (owner) {
      owner.cvIds = owner.cvIds.filter((cvId: string) => cvId !== id);
    }
    DB.skills.forEach((skill: any) => {
      skill.cvIds = skill.cvIds.filter((cvId: string) => cvId !== id);
    });
    DB.cvs.splice(index, 1);
    pubSub.publish("CV_CHANGED", {
      cvChanged: { type: "DELETED", cv },
    });

    return `CV ${id} supprimé avec succès`;
  },
};
