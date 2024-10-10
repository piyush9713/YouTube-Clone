import React from "react";
import { AuthProvider } from "./AuthContext";
import { LikedVideosProvider } from "./likedVideoContext/likedVideoProvider";
import { SubscriptionProvider } from "./subscriptionContext/SubscriptionVideoProvider";
import { WatchHistoryProvider } from "./watchHistoryContext/WatchHistoryProvider";
import { YourChannelProvider } from "./yourChannelContext/YourChannelProvider";
import { CommentProvider } from "./commentContext/CommentProvider";
import { VideoInfoProvider } from "./videoInfoContext/VideoInfoProvider";
import { VideoDataProvider } from "./videoDataContext/VideoDataProvider";
import { VideoProvider } from "./videoContext/VideoProvider";

const ContextProvider = ({ children }) => {
  return (
    <>
      <AuthProvider>
        <VideoDataProvider>
          <LikedVideosProvider>
            <WatchHistoryProvider>
              <YourChannelProvider>
                <SubscriptionProvider>
                  <VideoInfoProvider>
                    <CommentProvider>
                      <VideoProvider>{children}</VideoProvider>
                    </CommentProvider>
                  </VideoInfoProvider>
                </SubscriptionProvider>
              </YourChannelProvider>
            </WatchHistoryProvider>
          </LikedVideosProvider>
        </VideoDataProvider>
      </AuthProvider>
    </>
  );
};

export default ContextProvider;
