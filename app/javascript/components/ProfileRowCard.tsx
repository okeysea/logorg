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
}

const ProfileRowCard: React.FC<Props> = props => {

  const [loaded, user] = useAPIUser( props.userId );

  return (
    <div>
      { loaded &&
        <React.Fragment>
          <a href={user.getUrl()} css={cssContainer}>
            <ProfileAvatar user={user} size="small" className="user_profile_pic" />
            <div css={css([cssVariableItem, cssRowCenter])}>
              <span css={cssSpan}>{user.name}</span>
            </div>
          </a>
        </React.Fragment>
      }
    </div>
  )
}

export default ProfileRowCard;
