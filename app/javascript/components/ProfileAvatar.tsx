import React, { useState, useCallback } from "react"

type Props = {
  user: {
    public_id: string
    display_id: string
    name: string
  },
  size: string
}

const ProfileAvatar: React.FC<Props> = props => {
  const classnames: string[] = [
    "avatar_icon",
    props.size ? props.size : 'middle'
  ]

  return (
    <div className="ProfileAvatar" data-scope-path="components/profile_avatar">
      <img className={classnames.join(' ')} src={`http://localhost:3000/dev_assets/avatar_sample.jpg`} />
    </div>
  )
}

export default ProfileAvatar
