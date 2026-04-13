import { createPubSub } from "graphql-yoga";
import { DB } from "./db/db";
type CvParent = (typeof DB.cvs)[number];
export type CvChangedPayload = {
  type: string;
  cv: CvParent;
};
export const pubSub = createPubSub<{
  CV_CHANGED: [{ cvChanged: CvChangedPayload }];
}>();
