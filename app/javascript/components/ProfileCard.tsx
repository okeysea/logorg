import React, { useState, useCallback } from "react"
import PropTypes from "prop-types"
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
type Item = {
  id: number
  title: string
}

const items: Item[] = [
  {
    id: 1,
    title: 'たかいしょうひん'
  },
  {
    id: 1,
    title: 'ださいしょうひん'
  }
]

type Props = {
  message: string
  children: React.ReactNode
}

const Child: React.FC<Props> = ({ message, children }) => {
  return (
    <div>
      <p>{ message }</p>
      <p>{ children }</p>
    </div>
  )
}

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
      public_id:    PropTypes.string
      display_id:   PropTypes.string
      name:         PropTypes.string
      posts_count:  PropTypes.number
    })
  }
  const [ count, setCount ] = useState<number>(0)
  const message: string = 'こんにちは React!!'

  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1)
  }, {})

  const handleDecrement = useCallback(() => {
    setCount(prev => prev - 1)
  }, {})

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
