import React, { useState, useCallback, useEffect } from "react"
import ProfileAvatar from "./ProfileAvatar"
import Dropdown from "./Dropdown"
import { useAPIUser } from "./APIUserHooks"
import { useAPISession } from "./APISessionHooks"
import {dispatchFlash} from "../Events/FlashMessageEvent"

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
  const [session] = useAPISession();

  const handleLogout = ()=>{
    session.logout().then( result => {
      if( result.isSuccess() ){
        window.location.reload();
      }else{
        dispatchFlash("不明な操作です","danger");
      }
    });
  }

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
            <Dropdown.Item href={user.getUrl("edit")}>プロファイル編集</Dropdown.Item>
            <Dropdown.Item href={user.getUrl("newPost")}>記事新規作成</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>ログアウト</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    }
    </React.Fragment>
  )
}

export default ProfileDropdownMenu
