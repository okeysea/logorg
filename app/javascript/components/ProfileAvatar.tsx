import React, { useState, useCallback } from "react"
import User from "../API/models/User"

type Props = {
  user: User
  size: string
  className?: string
}

const ProfileAvatar: React.FC<Props> = props => {
  const classnames: string[] = [
    "avatar_icon",
    props.size ? props.size : 'middle'
  ]

  console.log( props.user );

  return (
    <div className="ProfileAvatar" data-scope-path="components/profile_avatar">
      <img className={classnames.join(' ') + " " + ("" || props.className)} src={props.user.getAvatar("thumb")} />
    </div>
  )
}

export default ProfileAvatar
