/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useEffect } from "react"
import ProfileAvatar from "./ProfileAvatar"
import { useAPIUser } from "./APIUserHooks"

const cssContainer = css({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  textDecoration: "none",
  color: "#282c37",

  "&:hover": {
    textDecoration: "underline",
  },
});

const cssVariableItem = css({
  flex: "1",
});

const cssRowCenter = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const cssSpan = css({
  marginLeft: "8px",
});

type Props = {
  userId: string
  size?: "small" | "middle" | "big" | "adjust"
}

const ProfileRowCard: React.FC<Props> = props => {

  const [loaded, user] = useAPIUser( props.userId );

  return (
    <div>
      { loaded &&
        <React.Fragment>
          <a href={user.getUrl()} css={cssContainer}>
            <ProfileAvatar user={user} size={props.size} className="user_profile_pic" />
            <div css={css([cssVariableItem, cssRowCenter])}>
              <span css={cssSpan}>{user.name}</span>
            </div>
            <div>{user.postsCount} 記事</div>
          </a>
        </React.Fragment>
      }
    </div>
  )
}

ProfileRowCard.defaultProps = {
  size: "small"
};

export default ProfileRowCard;
