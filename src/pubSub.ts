import { createPubSub } from "graphql-yoga";
export const pubSub = createPubSub<{
  CV_CHANGED: [{ cvChanged: { type: string; cv: any } }];
}>();
