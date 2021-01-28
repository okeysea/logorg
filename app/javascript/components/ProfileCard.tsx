import React, { useState, useCallback } from "react"
import * as PropTypes from "prop-types"
import ProfileAvatar from "./ProfileAvatar"
import Dropdown from "./Dropdown"

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
}

const ProfileCard: React.FC<cardProps> = props => {
  const propTypes = {
    user: PropTypes.shape({
      public_id:    PropTypes.string,
      display_id:   PropTypes.string,
      name:         PropTypes.string,
      posts_count:  PropTypes.number
    })
  }

  return (
    <div className="ProfileCard" data-scope-path="components/profile_card">
      <div className="user_basic_inform">
        <div className="user_avatar">
          <ProfileAvatar user={props.user} size="big" />
        </div>
        <div className="user_name">{props.user.name}</div>
        <div className="user_id">{`ID: ${props.user.display_id}`}</div>
      </div>
      <div className="user_activity_inform">
        <a className="user_activity_element" href="#">
          <div className="user_activity_count">{props.user.posts_count}</div>
          <div className="user_activity_description">投稿</div>
        </a>
        <a className="user_activity_element" href="#">
          <div className="user_activity_count">16</div>
          <div className="user_activity_description">Posts</div>
        </a>
        <a className="user_activity_element" href="#">
          <div className="user_activity_count">16</div>
          <div className="user_activity_description">Posts</div>
        </a>
      </div>
    </div>
  )
}

export default ProfileCard
