import { pubSub } from "./pubSub";
export const Subscription = {
  cvChanged: {
    subscribe: () => pubSub.subscribe("CV_CHANGED"),
    resolve: (payload: any) => payload.cvChanged,
  },
} as any;   
