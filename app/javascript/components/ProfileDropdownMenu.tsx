import React, { useState, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import ProfileAvatar from "./ProfileAvatar"
import Dropdown from "./Dropdown"
import { useAPIUser } from "./APIUserHooks"
import User from "../API/models/User"

type Props = {
  user: {
    public_id:    string
    display_id:   string
    name:         string
    posts_count:  number
  }
  userId: string
}

const ProfileDropdownMenu: React.FC<Props> = props => {
  const [loaded, user] = useAPIUser( props.userId );

  return (
    <React.Fragment>
    { loaded &&
      <div className="ProfileDropdownMenu" data-scope-path="components/profile_dropdown_menu">
        <Dropdown>
          <Dropdown.Trigger hover>
            <div className="avatar_container">
              {loaded && <ProfileAvatar user={user} size="adjust" />}
              <div className="dropangle"></div>
            </div>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item href="http://www.google.com/">プロファイル編集</Dropdown.Item>
            <Dropdown.Item>記事新規作成</Dropdown.Item>
            <Dropdown.Item>ほげほげ</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>ログアウト</Dropdown.Item>
            <Dropdown.Item>ログアウトするにはログインが必要です</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    }
    </React.Fragment>
  )
}

export default ProfileDropdownMenu
