import { pubSub, CvChangedPayload } from "./pubSub";
export const Subscription = {
  cvChanged: {
    subscribe: () => pubSub.subscribe("CV_CHANGED"),
    resolve: (payload: { cvChanged: CvChangedPayload }) => payload.cvChanged,
  },
} as any;
