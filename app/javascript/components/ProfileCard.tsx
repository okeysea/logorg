import React, { useState, useCallback, useEffect } from "react"
import * as PropTypes from "prop-types"
import ProfileAvatar from "./ProfileAvatar"
import { useAPIUser } from "./APIUserHooks"

/*
class ProfileCard extends React.Component {
  render () {
    return (
      <React.Fragment>
      </React.Fragment>
    );
  }
}
*/

type cardProps = {
  user: {
    public_id:    string
    display_id:   string
    name:         string
    posts_count:  number
  }
  userId: string
}

const ProfileCard: React.FC<cardProps> = props => {

  const [loaded, user] = useAPIUser( props.userId );

  return (
    <React.Fragment>
      { loaded &&
      <div className="ProfileCard" data-scope-path="components/profile_card">
        <div className="user_basic_inform">
          <div className="user_avatar">
            <ProfileAvatar user={user} size="big" />
          </div>
          <div className="user_name">{user.name}</div>
          <div className="user_id">{`ID: ${user.displayId}`}</div>
        </div>
        <div className="user_activity_inform">
          <a className="user_activity_element" href={user.getUrl("posts")}>
            <div className="user_activity_count">{user.postsCount}</div>
            <div className="user_activity_description">投稿</div>
          </a>
          <a className="user_activity_element" href="#">
            <div className="user_activity_count">0</div>
            <div className="user_activity_description">Now in Dev</div>
          </a>
          <a className="user_activity_element" href="#">
            <div className="user_activity_count">0</div>
            <div className="user_activity_description">Now in Dev</div>
          </a>
        </div>
      </div>
      }
  </React.Fragment>
  )
}

export default ProfileCard
