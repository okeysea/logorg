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

type Props = {
  userId: string
}

const ProfileWallAvatar: React.FC<Props> = props => {

  const [loaded, user] = useAPIUser( props.userId );

  return (
    <React.Fragment>
      { loaded &&
        <ProfileAvatar user={user} size="big" className="user_profile_pic" />
      }
  </React.Fragment>
  )
}

export default ProfileWallAvatar
