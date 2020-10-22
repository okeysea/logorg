import React, { useState, useCallback } from "react"
import PropTypes from "prop-types"
import ProfileAvatar from "./ProfileAvatar"
import Dropdown from "./Dropdown"

type Props = {
  user: {
    public_id:    string
    display_id:   string
    name:         string
    posts_count:  number
  }
}

const ProfileDropdownMenu: React.FC<Props> = props => {
  const propTypes = {
    user: PropTypes.shape({
      public_id:    PropTypes.string,
      display_id:   PropTypes.string,
      name:         PropTypes.string,
      posts_count:  PropTypes.number
    })
  }

  return (
    <div className="ProfileDropdownMenu" data-scope-path="components/profile_dropdown_menu">
      <Dropdown>
        <Dropdown.Trigger hover>
          <div className="avatar_container">
            <ProfileAvatar user={props.user} size="adjust" />
            <div className="dropangle"></div>
          </div>
        </Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>プロファイル編集</Dropdown.Item>
          <Dropdown.Item>記事新規作成</Dropdown.Item>
          <Dropdown.Item>ほげほげ</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>ログアウト</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default ProfileDropdownMenu
