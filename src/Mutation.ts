import { GraphQLError } from "graphql";
import { MyContext } from "./main";
import { pubSub } from "./pubSub";

type CvParent = (typeof import("./db/db").DB.cvs)[number];
type CreateCvInput = {
  name: string;
  age: number;
  job?: string;
  skillIds?: string[];
  cvOwnerId: string;
};
type UpdateCvInput = {
  name?: string;
  age?: number;
  job?: string;
  skillIds?: string[];
  cvOwnerId?: string;
};

export const Mutation = {
  addCv: (
    _: unknown,
    { input }: { input: CreateCvInput },
    { DB }: MyContext,
  ) => {
    const owner = DB.users.find((u) => u.id === input.cvOwnerId);
    if (!owner) {
      throw new GraphQLError(`User ${input.cvOwnerId} introuvable`, {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (input.skillIds) {
      input.skillIds.forEach((skillId) => {
        const skill = DB.skills.find((s) => s.id === skillId);
        if (!skill) {
          throw new GraphQLError(`Skill ${skillId} introuvable`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
      });
    }

    const newCv: CvParent = {
      id: String(DB.cvs.length + 1),
      name: input.name,
      age: input.age,
      job: input.job ?? "",
      skillIds: input.skillIds ?? [],
      cvOwnerId: input.cvOwnerId,
    };

    DB.cvs.push(newCv);
    owner.cvIds.push(newCv.id);

    if (input.skillIds) {
      input.skillIds.forEach((skillId) => {
        const skill = DB.skills.find((s) => s.id === skillId);
        skill!.cvIds.push(newCv.id);
      });
    }

    pubSub.publish("CV_CHANGED", {
      cvChanged: { type: "ADDED", cv: newCv },
    });

    return newCv;
  },

  updateCv: (
    _: unknown,
    { id, input }: { id: string; input: UpdateCvInput },
    { DB }: MyContext,
  ) => {
    const cv = DB.cvs.find((c) => c.id === id);
    if (!cv) {
      throw new GraphQLError(`CV ${id} introuvable`, {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (input.cvOwnerId) {
      const owner = DB.users.find((u) => u.id === input.cvOwnerId);
      if (!owner) {
        throw new GraphQLError(`User ${input.cvOwnerId} introuvable`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
    }

    if (input.skillIds) {
      input.skillIds.forEach((skillId) => {
        const skill = DB.skills.find((s) => s.id === skillId);
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

  deleteCv: (_: unknown, { id }: { id: string }, { DB }: MyContext) => {
    const index = DB.cvs.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new GraphQLError(`CV ${id} introuvable`, {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const cv = DB.cvs[index];

    const owner = DB.users.find((u) => u.id === cv.cvOwnerId);
    if (owner) {
      owner.cvIds = owner.cvIds.filter((cvId) => cvId !== id);
    }

    DB.skills.forEach((skill) => {
      skill.cvIds = skill.cvIds.filter((cvId) => cvId !== id);
    });

    DB.cvs.splice(index, 1);

    pubSub.publish("CV_CHANGED", {
      cvChanged: { type: "DELETED", cv },
    });

    return `CV ${id} supprimé avec succès`;
  },
};
